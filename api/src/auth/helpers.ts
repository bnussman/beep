import * as nodemailer from "nodemailer";
import * as Sentry from "@sentry/node";
import { transporter } from "../utils/mailer";
import { TokenEntry } from '../entities/TokenEntry';
import { BeepORM } from '../app';
import { User } from '../entities/User';
import { VerifyEmail } from '../entities/VerifyEmail';
import { wrap } from '@mikro-orm/core';

const url: string = process.env.NODE_ENV === "development" ? "https://staging.ridebeep.app" : "https://ridebeep.app";

/**
 * Generates an authentication token and a token for that token (for offline logouts), stores
 * the entry in the tokens table, and returns that same data.
 *
 * @param {User} user a user that must be manaeged by the ORM
 * @return {Promise<TokenEntry>} user's id, auth token, and auth token's token to be used by login and sign up
 */
export async function getToken(user: User): Promise<TokenEntry> {
  const t = new TokenEntry(user);

  const em = BeepORM.em.fork();

  await em.persistAndFlush(t);

  return t;
}

/**
 * Updates a user's pushToken in the database
 * 
 * @param {User} user a user that must be managed by the ORM
 * @param {string | nul} token the expo push token for the user
 */
export async function setPushToken(user: User, token: string | null): Promise<void> {
  if (!user) return;

  const em = BeepORM.em.fork();

  wrap(user).assign({
    pushToken: token
  });

  await em.persistAndFlush(user);
}

/**
 * Gets User entity form their email
 *
 * @param {string} email string of user's email
 * @returns {Promise<User | null>}
 */
export async function getUserFromEmail(email: string): Promise<User | null> {
  const em = BeepORM.em.fork();

  const user = await em.findOne(User, { email: email });

  return user;
}

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
 * Helper function that deactives all auth tokens for user by their userid
 *
 * @param {User} user user from the entity manager
 * @returns void
 */
export async function deactivateTokens(user: User): Promise<void> {
  const em = BeepORM.em.fork();

  await em.nativeDelete(TokenEntry, { user });
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
export async function createVerifyEmailEntryAndSendEmail(user: User): Promise<void> {
  const em = BeepORM.em.fork();

  await em.nativeDelete(VerifyEmail, { email: user.email });

  const entry = new VerifyEmail(user, user.email);

  sendVerifyEmailEmail(user, entry);

  await em.persistAndFlush(entry);
}