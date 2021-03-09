"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const https_1 = require("https");
/**
 * Use Expo's API to send a push notification
 * @param user the resipiant's id
 * @param title for the notification
 * @param message is the body of the push notification
 */
async function sendNotification(user, title, message, categoryIdentifier) {
    if (!user.pushToken)
        return;
    console.log("Sending push notification to", user.name, message);
    const req = https_1.request({
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
exports.sendNotification = sendNotification;
