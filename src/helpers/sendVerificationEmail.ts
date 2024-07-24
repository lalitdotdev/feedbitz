import { ApiResponse } from '@/types/ApiResponse';
import VerificationEmail from '../../emails/verificationEmail';
import { resend } from '@/lib/resend';

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Important: Verify Your Email Address',
      react: VerificationEmail({
        username,
        otp: verifyCode,
      }),
    });
    return {
      success: true,
      message: 'Verification Email Sent',
    };
  } catch (emailError) {
    console.log('Error Sending Verification Email: ', emailError);
    return {
      success: false,
      message: 'Error Sending Verification Email',
    };
  }
}
