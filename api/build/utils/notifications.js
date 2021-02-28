"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const https_1 = require("https");
const app_1 = require("../app");
/**
 * Use Expo's API to send a push notification
 * @param userid the resipiant's id
 * @param title for the notification
 * @param message is the body of the push notification
 */
async function sendNotification(user, title, message, categoryIdentifier) {
    await app_1.BeepORM.em.populate(user, ['pushToken']);
    const pushToken = user.pushToken;
    if (!pushToken)
        return;
    const req = https_1.request({
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
exports.sendNotification = sendNotification;
