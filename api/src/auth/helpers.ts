import * as nodemailer from "nodemailer";
import * as Sentry from "@sentry/node";
import { transporter } from "../utils/mailer";
import { User } from '../entities/User';
import { VerifyEmail } from '../entities/VerifyEmail';
import { EntityManager } from "@mikro-orm/core";
import { ENVIRONMENT } from "../utils/constants";

const urls = {
  development: 'http://localhost:5173',
  staging: 'https://staging.ridebeep.app',
  production: 'https://ridebeep.app'
};

const url = urls[ENVIRONMENT];

/**
 * Helper function to send password reset email to user
 *
 * @param {string} email who to send the email to
 * @param {string} id id of the reset token
 * @param {string} username the username of the user
 */
export function sendResetEmail(email: string, id: string, username: string): void {

  const mailOptions: nodemailer.SendMailOptions = {
    from: 'Beep App <banks@ridebeep.app>',
    to: email,
    subject: 'Change your Beep App password',
    html: `Hey ${username}, <br><br>
            Head to ${url}/password/reset/${id} to reset your password. This link will expire in 5 hours. <br><br>
            Roll Neers, <br>
            -Banks Nussman
        `
  };

  transporter.sendMail(mailOptions, (error: Error | null) => {
    if (error) {
      Sentry.captureException(error);
    }
  });
}

/**
 * Send Very Email Email to user
 *
 * @param {User} User the user from the ORM
 * @param {VerifyEmail} verifyEntry the VerifyEmail entry
 * @returns void
 */
export function sendVerifyEmailEmail(user: User, verifyEntry: VerifyEmail): void {
  const mailOptions: nodemailer.SendMailOptions = {
    from: 'Beep App <banks@ridebeep.app>',
    to: user.email,
    subject: 'Verify your Beep App Email!',
    html: `Hey ${user.username}, <br><br>
            Head to ${url}/account/verify/${verifyEntry.id} to verify your email. This link will expire in 5 hours. <br><br>
            Roll Neers, <br>
            -Banks Nussman
        `
  };

  transporter.sendMail(mailOptions, (error: Error | null) => {
    if (error) {
      Sentry.captureException(error);
    }
  });
}

/**
 * Helper function for email verfication. This function will create and insert a new email verification entry and 
 * it will call the other helper function to actually send the email.
 *
 * @param {User} user is the user entity
 * @returns void
 */
export async function createVerifyEmailEntryAndSendEmail(user: User, _em: EntityManager): Promise<void> {
  const em = _em.fork();

  await em.nativeDelete(VerifyEmail, { email: user.email });

  const entry = new VerifyEmail(user, user.email);

  sendVerifyEmailEmail(user, entry);

  await em.persistAndFlush(entry);
}