import type { SendMailOptions } from "nodemailer";
import { WEB_BASE_URL } from "../utils/constants";
import { email } from "../utils/email";
import { captureException } from "@sentry/bun";

interface SendVerificationEmailOptions {
  email: string;
  username: string;
  token: string;
}

export async function sendSignupVerificationEmail(options: SendVerificationEmailOptions) {
  const mailOptions: SendMailOptions = {
    from: "Beep App <banks@ridebeep.app>",
    to: options.email,
    subject: "Verify your Beep App Email!",
    html: `
      <p>Hey ${options.username},</p>
      <p>Head to ${WEB_BASE_URL}/account/verify/${options.token} to verify your email. This link will expire in 5 hours.</p>
      <p>- Beep App Team</p>
    `,
  };

  try {
    await email.sendMail(mailOptions);
  } catch (error) {
    captureException(error);
  }
}

interface SendResetPasswordOptions {
  email: string;
  username: string;
  token: string;
}

export async function sendResetPasswordEmail(options: SendResetPasswordOptions) {
  const mailOptions: SendMailOptions = {
    from: "Beep App <banks@ridebeep.app>",
    to: options.email,
    subject: "Change your Beep App password",
    html: `
      <p>Hey ${options.username},</p>
      <p>Head to ${WEB_BASE_URL}/password/reset/${options.token} to reset your password. This link will expire in 5 hours.</p>
      <p>- Beep App Team</p>
    `,
  };

  try {
    await email.sendMail(mailOptions);
  } catch (error) {
    captureException(error);
  }
}

export function isExpired(date: Date) {
  const expiresAt = date.getTime() + 18000 * 1000; // timestamp + 5 hours

  return expiresAt < Date.now()
}