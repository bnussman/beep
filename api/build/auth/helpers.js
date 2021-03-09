"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doesUserExist = exports.createVerifyEmailEntryAndSendEmail = exports.sendVerifyEmailEmail = exports.deactivateTokens = exports.sendResetEmail = exports.getUserFromId = exports.getUserFromEmail = exports.setPushToken = exports.getToken = void 0;
const mailer_1 = require("../utils/mailer");
const Sentry = __importStar(require("@sentry/node"));
const TokenEntry_1 = require("../entities/TokenEntry");
const app_1 = require("../app");
const VerifyEmail_1 = require("../entities/VerifyEmail");
const core_1 = require("@mikro-orm/core");
/**
 * Generates an authentication token and a token for that token (for offline logouts), stores
 * the entry in the tokens table, and returns that same data.
 *
 * @param userid a user's ID which is used to associate a token with a userid in our tokens table
 * @return user's id, auth token, and auth token's token to be used by login and sign up
 */
async function getToken(user) {
    const t = new TokenEntry_1.TokenEntry(user);
    await app_1.BeepORM.tokenRepository.persistAndFlush(t);
    return t;
}
exports.getToken = getToken;
/**
 * Updates a user's pushToken in the database
 * @param id a user's id in which we want to update their push tokens
 * @param token the expo push token for the user
 */
async function setPushToken(user, token) {
    if (!user)
        return;
    //run query to get user and update their pushToken
    core_1.wrap(user).assign({
        pushToken: token
    });
    await app_1.BeepORM.userRepository.persistAndFlush(user);
}
exports.setPushToken = setPushToken;
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
async function getUserFromEmail(email) {
    const user = await app_1.BeepORM.userRepository.findOne({ email: email });
    if (user) {
        return user;
    }
    return null;
}
exports.getUserFromEmail = getUserFromEmail;
/**
 * get user data given an email
 *
 * @param email string of user's email
 * @param pluckItems are items we want to pluck in the db query
 * @returns Promise<UserPluckResult>
 */
async function getUserFromId(id, ...pluckItems) {
    const user = await app_1.BeepORM.userRepository.findOne(id, { fields: pluckItems });
    if (user) {
        return user;
    }
    console.log("oh no, user was null in getUserFromId");
    return null;
}
exports.getUserFromId = getUserFromId;
/**
 * Helper function to send password reset email to user
 *
 * @param email who to send the email to
 * @param id is the passowrdReset entry (NOT the user's id)
 * @param first is the first name of the recipiant so email is more personal
 */
function sendResetEmail(email, id, first) {
    const url = process.env.NODE_ENV === "development" ? "https://dev.ridebeep.app" : "https://ridebeep.app";
    const mailOptions = {
        from: 'Beep App <banks@ridebeep.app>',
        to: email,
        subject: 'Change your Beep App password',
        html: `Hey ${first}, <br><br>
            Head to ${url}/password/reset/${id} to reset your password. This link will expire in an hour. <br><br>
            Roll Neers, <br>
            -Banks Nussman
        `
    };
    mailer_1.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            Sentry.captureException(error);
        }
    });
}
exports.sendResetEmail = sendResetEmail;
/**
 * Helper function that deactives all auth tokens for user by their userid
 *
 * @param userid string of their user id
 * @returns void
 */
async function deactivateTokens(user) {
    await app_1.BeepORM.tokenRepository.nativeDelete({ user: user });
}
exports.deactivateTokens = deactivateTokens;
/**
 * Send Very Email Email to user
 *
 * @param email string user's email
 * @param id string is the eventid in the verifyEmail database
 * @param first string is the user's first name to make the email more personalized
 * @returns void
 */
function sendVerifyEmailEmail(email, verifyEntry, first) {
    const url = process.env.NODE_ENV === "development" ? "https://dev.ridebeep.app" : "https://ridebeep.app";
    const mailOptions = {
        from: 'Beep App <banks@ridebeep.app>',
        to: email,
        subject: 'Verify your Beep App Email!',
        html: `Hey ${first}, <br><br>
            Head to ${url}/account/verify/${verifyEntry.id} to verify your email. This link will expire in an hour. <br><br>
            Roll Neers, <br>
            -Banks Nussman
        `
    };
    mailer_1.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            Sentry.captureException(error);
        }
    });
}
exports.sendVerifyEmailEmail = sendVerifyEmailEmail;
/**
 * Helper function for email verfication. This function will create and insert a new email verification entry and
 * it will call the other helper function to actually send the email.
 *
 * @param id is the user's is
 * @param email is the user's email
 * @param first is the user's first name so we can make the email more personal
 * @returns void
 */
async function createVerifyEmailEntryAndSendEmail(user, email, first) {
    if (!email || !first) {
        Sentry.captureException(new Error("Did not create verify email entry or send email due to no email or first name"));
        return;
    }
    const entry = new VerifyEmail_1.VerifyEmail(user, email);
    await app_1.BeepORM.verifyEmailRepository.persistAndFlush(entry);
    //send the email
    sendVerifyEmailEmail(email, entry, first);
}
exports.createVerifyEmailEntryAndSendEmail = createVerifyEmailEntryAndSendEmail;
/**
 * function to tell you if a user exists by a username
 *
 * @param username string
 * @returns Promise<boolean> true if user exists by username
 */
async function doesUserExist(username) {
    try {
        const c = await app_1.BeepORM.userRepository.count({ username: username });
        if (c >= 1) {
            return true;
        }
    }
    catch (error) {
        Sentry.captureException(error);
    }
    return false;
}
exports.doesUserExist = doesUserExist;
