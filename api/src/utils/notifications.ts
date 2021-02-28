import { request } from "https";
import * as Sentry from "@sentry/node";
import { User } from '../entities/User';
import {BeepORM} from "../app";

/**
 * Use Expo's API to send a push notification
 * @param userid the resipiant's id
 * @param title for the notification
 * @param message is the body of the push notification
 */
export async function sendNotification(user: User, title: string, message: string, categoryIdentifier?: string): Promise<void> {
    
    await BeepORM.em.populate(user, ['pushToken']); 

    const pushToken = user.pushToken;

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
        "to": pushToken,
        "title": title,
        "body": message,
        "_category": categoryIdentifier
    }));

    req.end();
}
