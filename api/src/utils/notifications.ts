import { request } from "https";
import { User } from '../entities/User';

/**
 * Use Expo's API to send a push notification
 * @param user the resipiant's id
 * @param title for the notification
 * @param message is the body of the push notification
 */
export async function sendNotification(user: User, title: string, message: string, categoryIdentifier?: string): Promise<void> {

    if (!user.pushToken) return;

    console.log("Sending push notification to", user.name, message);

    const req = request({
        host: "exp.host",
        path: "/--/api/v2/push/send",
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    req.write(JSON.stringify({
        "to": user.pushToken,
        "title": title,
        "body": message,
        "_category": categoryIdentifier
    }));

    req.end();
}
