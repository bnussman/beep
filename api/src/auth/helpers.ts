import * as nodemailer from "nodemailer";
import { transporter } from "../utils/mailer";
import * as Sentry from "@sentry/node";
import { TokenEntry } from '../entities/TokenEntry';
import { BeepORM } from '../app';
import { User } from '../entities/User';
import { VerifyEmail } from '../entities/VerifyEmail';
import { wrap } from '@mikro-orm/core';

/**
 * Generates an authentication token and a token for that token (for offline logouts), stores
 * the entry in the tokens table, and returns that same data.
 *
 * @param userid a user's ID which is used to associate a token with a userid in our tokens table
 * @return user's id, auth token, and auth token's token to be used by login and sign up
 */
export async function getToken(user: User): Promise<TokenEntry> {
    const t = new TokenEntry(user);

    await BeepORM.tokenRepository.persistAndFlush(t);

    return t;
}

/**
 * Updates a user's pushToken in the database
 * @param id a user's id in which we want to update their push tokens
 * @param token the expo push token for the user
 */
export async function setPushToken(user: User, token: string | null): Promise<void> {
    if (!user) return;
    //run query to get user and update their pushToken
    wrap(user).assign({
        pushToken: token
    });

    await BeepORM.userRepository.persistAndFlush(user);
}

/**
 * works exactly like isTokenValid, but only returns a userid if user has userLevel == 1 (meaning they are an admin)
 *
 * @param token a user's auth token
 * @returns promice that resolves to null or a user's id
 */
/*
export async function isAdmin(token: string): Promise<string | null> {
    const id: string | null = await isTokenValid(token);

    if (id) {
        const hasCorrectLevel = await hasUserLevel(id, 1);
        
        if(hasCorrectLevel) {
            return id;
        }
    }
    return null;
}
*/

/**
 * get user data given an email
 *
 * @param email string of user's email
 * @returns Promise<UserPluckResult>
 */
export async function getUserFromEmail(email: string): Promise<User | null> {
    const user = await BeepORM.userRepository.findOne({ email: email });

    if (user) {
        return user;
    }

    return null;
}

/**
 * get user data given an email
 *
 * @param email string of user's email
 * @param pluckItems are items we want to pluck in the db query 
 * @returns Promise<UserPluckResult>
 */
export async function getUserFromId(id: string, ...pluckItems: string[]): Promise<Partial<User> | null> {
    const user = await BeepORM.userRepository.findOne(id, { fields: pluckItems });

    if (user) {
        return user;
    }

    console.log("oh no, user was null in getUserFromId");

    return null;
}

/**
 * Helper function to send password reset email to user
 *
 * @param email who to send the email to
 * @param id is the passowrdReset entry (NOT the user's id)
 * @param first is the first name of the recipiant so email is more personal
 */
export function sendResetEmail(email: string, id: string, first: string | undefined): void {

    const url: string = process.env.NODE_ENV === "development" ? "https://dev.ridebeep.app" : "https://ridebeep.app";
 
    const mailOptions: nodemailer.SendMailOptions = { 
        from : 'Beep App <banks@ridebeep.app>', 
        to : email, 
        subject : 'Change your Beep App password', 
        html: `Hey ${first}, <br><br>
            Head to ${url}/password/reset/${id} to reset your password. This link will expire in an hour. <br><br>
            Roll Neers, <br>
            -Banks Nussman
        ` 
    }; 

    transporter.sendMail(mailOptions, (error: Error | null, info: nodemailer.SentMessageInfo) => { 
        if (error) { 
            Sentry.captureException(error);
        } 
    });     
}

/**
 * Helper function that deactives all auth tokens for user by their userid
 *
 * @param userid string of their user id
 * @returns void
 */
export async function deactivateTokens(user: User): Promise<void> {
    await BeepORM.tokenRepository.nativeDelete({ user: user });
}

/**
 * Send Very Email Email to user
 *
 * @param email string user's email
 * @param id string is the eventid in the verifyEmail database
 * @param first string is the user's first name to make the email more personalized
 * @returns void
 */
export function sendVerifyEmailEmail(email: string, verifyEntry: VerifyEmail, first: string | undefined): void {
    const url: string = process.env.NODE_ENV === "development" ? "https://dev.ridebeep.app" : "https://ridebeep.app";
 
    const mailOptions: nodemailer.SendMailOptions = { 
        from : 'Beep App <banks@ridebeep.app>', 
        to : email, 
        subject : 'Verify your Beep App Email!', 
        html: `Hey ${first}, <br><br>
            Head to ${url}/account/verify/${verifyEntry._id} to verify your email. This link will expire in an hour. <br><br>
            Roll Neers, <br>
            -Banks Nussman
        ` 
    }; 

    transporter.sendMail(mailOptions, (error: Error | null, info: nodemailer.SentMessageInfo) => { 
        if (error) { 
            Sentry.captureException(error);
        } 
    });     
}

/**
 * Helper function for email verfication. This function will create and insert a new email verification entry and 
 * it will call the other helper function to actually send the email.
 *
 * @param id is the user's is
 * @param email is the user's email
 * @param first is the user's first name so we can make the email more personal
 * @returns void
 */
export async function createVerifyEmailEntryAndSendEmail(user: User, email: string | undefined, first: string | undefined): Promise<void> {
    if (!email || !first) {
        Sentry.captureException(new Error("Did not create verify email entry or send email due to no email or first name"));
        return;
    }

    await BeepORM.verifyEmailRepository.nativeDelete({ email });

    const entry = new VerifyEmail(user, email);

    await BeepORM.verifyEmailRepository.persistAndFlush(entry);

    const e = await BeepORM.verifyEmailRepository.findOneOrFail({ user: user._id });

    //send the email
    sendVerifyEmailEmail(email, e, first);
}

/**
 * function to tell you if a user exists by a username
 *
 * @param username string 
 * @returns Promise<boolean> true if user exists by username
 */
export async function doesUserExist(username: string): Promise<boolean> {
    try {
        const c = await BeepORM.userRepository.count({username: username});
        
        if (c >= 1) {
            return true;        
        }
    }
    catch (error) {
        Sentry.captureException(error);
    }
    return false;
}
