import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();

    // checking existingUserByEmail
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json({
        success: false,
        message: 'Username is already taken',
      });
    }

    // checking existingUserByEmail
    const existingUserByEmail = await UserModel.findOne({ email });

    // generate verifyCode
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json({ success: false, message: 'User already exist with this email' }, { status: 400 });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        // verifyCodeExpiry
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      // user first time comer so encrypt password
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      //   save user in database
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // send verification email

    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        },
      );
    }
    return Response.json(
      {
        success: true,
        message: 'User registered successfully ! Please verfify your email',
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log('Error in sign-up route: ', error);
    return Response.json(
      { success: false, message: 'Error in sign-up route' },
      {
        status: 500,
      },
    );
  }
}
