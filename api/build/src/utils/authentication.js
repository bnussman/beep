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
exports.expressAuthentication = void 0;
const Error_1 = require("./Error");
const app_1 = require("../app");
const User_1 = require("../entities/User");
function expressAuthentication(request, securityName, scopes) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (securityName === "token") {
            const token = (_a = request.get("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                return Promise.reject(new Error_1.APIAuthResponse(Error_1.APIStatus.Error, "You must provide an authentication token"));
            }
            const tokenEntryResult = yield app_1.BeepORM.tokenRepository.findOne(token, { populate: true });
            if (!tokenEntryResult) {
                return Promise.reject(new Error_1.APIAuthResponse(Error_1.APIStatus.Error, "Your token is not valid"));
            }
            if (scopes && (scopes[0] == "admin")) {
                if (tokenEntryResult.user.role != User_1.UserRole.ADMIN) {
                    return Promise.reject(new Error_1.APIAuthResponse(Error_1.APIStatus.Error, "You must be an admin to use this endpoint"));
                }
            }
            return Promise.resolve({ token: tokenEntryResult, user: tokenEntryResult.user });
        }
        else if (securityName == "optionalAdmin") {
            const token = (_b = request.get("Authorization")) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
            if (!token) {
                return Promise.resolve();
            }
            const tokenEntryResult = yield app_1.BeepORM.tokenRepository.findOne(token, { populate: true });
            if (tokenEntryResult) {
                if (tokenEntryResult.user.role == User_1.UserRole.ADMIN) {
                    return Promise.resolve({ token: token, user: tokenEntryResult.user });
                }
                return Promise.resolve();
            }
            else {
                return Promise.resolve();
            }
        }
    });
}
exports.expressAuthentication = expressAuthentication;
