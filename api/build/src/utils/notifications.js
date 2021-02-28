"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function sendNotification(user, title, message, categoryIdentifier) {
    return __awaiter(this, void 0, void 0, function* () {
        yield app_1.BeepORM.em.populate(user, ['pushToken']);
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
    });
}
exports.sendNotification = sendNotification;
