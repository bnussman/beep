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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const r = __importStar(require("rethinkdb"));
const https_1 = require("https");
const db_1 = __importDefault(require("../utils/db"));
/**
 * Use Expo's API to send a push notification
 * @param userid the resipiant's id
 * @param title for the notification
 * @param message is the body of the push notification
 */
function sendNotification(userid, title, message, categoryIdentifier, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const pushToken = yield getPushToken(userid);
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
            to: pushToken,
            title: title,
            body: message,
            data: data,
            sound: "default",
            _category: "@bnussman/Beep-" + categoryIdentifier
        }));
        req.end();
    });
}
exports.sendNotification = sendNotification;
/**
 * Given a user's id, query the db and return their Expo push token
 * @param userid a user's id
 * @return string of users Expo push token or null if error
 */
function getPushToken(userid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const output = yield r.table("users").get(userid).pluck('pushToken').run((yield db_1.default.getConn()));
            return output.pushToken;
        }
        catch (error) {
            console.log(error);
        }
        return null;
    });
}
