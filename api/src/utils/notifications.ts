import { request } from "https";

/**
 * Use Expo's API to send a push notification
 * @param user the resipiant's id
 * @param title for the notification
 * @param message is the body of the push notification
 */
export async function sendNotification(token: string | undefined, title: string, message: string, categoryIdentifier?: string): Promise<void> {

    if (!token) {
        console.warn("[Notification] No Token");
        return;
    }

    const req = request({
        host: "exp.host",
        path: "/--/api/v2/push/send",
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    req.write(JSON.stringify({
        "to": token,
        "title": title,
        "body": message,
        "_category": categoryIdentifier
    }));

    req.end();
}
