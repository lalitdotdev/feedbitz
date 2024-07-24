import UserModel from '@/model/User';
import dbConnect from '@/lib/db';
import { usernameValidation } from '@/schemas/signUpSchema';
import { z } from 'zod';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await dbConnect();
  //   localhost:3000/api/check-username-unique?username=abc
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get('username'),
    };
    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    // TODO : REMOVE
    console.log(result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query Parameters',
        },
        {
          status: 400,
        },
      );
    }
    const { username } = result.data;
  } catch (error) {
    console.error(error);
  }
}
