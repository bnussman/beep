import * as r from 'rethinkdb';
import { request } from "https";
import database from"../utils/db";

/**
 * Use Expo's API to send a push notification
 * @param userid the resipiant's id
 * @param title for the notification
 * @param message is the body of the push notification
 */
export async function sendNotification(userid: string, title: string, message: string, categoryIdentifier?: string, data?: unknown): Promise<void> {
    const pushToken = await getPushToken(userid);

    if (!pushToken) return;

    const req = request({
        host: "exp.host",
        path: "/--/api/v2/push/send",
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    req.write(JSON.stringify({
        to: pushToken,
        title: title,
        body: message,
        data: data,
        sound: "default",
        _category: "@bnussman/Beep-" + categoryIdentifier
    }));

    req.end();
}

/**
 * Given a user's id, query the db and return their Expo push token
 * @param userid a user's id
 * @return string of users Expo push token or null if error
 */
async function getPushToken(userid: string): Promise<string | null> {
    try {
        const output = await r.table("users").get(userid).pluck('pushToken').run((await database.getConn()));

        return output.pushToken;
    }
    catch(error) {
        console.log(error);
    }
    return null;
}
