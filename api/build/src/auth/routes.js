"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.AuthController = void 0;
const tsoa_1 = require("tsoa");
const express_1 = __importDefault(require("express"));
const js_sha256_1 = require("js-sha256");
const helpers_1 = require("./helpers");
const node_input_validator_1 = require("node-input-validator");
const Error_1 = require("../utils/Error");
const core_1 = require("@mikro-orm/core");
const app_1 = require("../app");
const User_1 = require("../entities/User");
const ForgotPassword_1 = require("../entities/ForgotPassword");
let AuthController = class AuthController extends tsoa_1.Controller {
    /**
     * Checks provided credentials and provides a responce with user data and authentication tokens.
     * Provide a username and password to login successfully
     * @param {LoginParams} requestBody - Conatins a username and password and optional Expo push token
     */
    login(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const v = new node_input_validator_1.Validator(requestBody, {
                username: "required",
                password: "required"
            });
            const matched = yield v.check();
            if (!matched) {
                this.setStatus(422);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, v.errors);
            }
            const user = yield app_1.BeepORM.userRepository.findOne({ username: requestBody.username }, ['password']);
            if (!user) {
                this.setStatus(401);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "User not found");
            }
            if (user.password == js_sha256_1.sha256(requestBody.password)) {
                const tokenData = yield helpers_1.getToken(user);
                if (requestBody.expoPushToken) {
                    helpers_1.setPushToken(user, requestBody.expoPushToken);
                }
                return {
                    status: Error_1.APIStatus.Success,
                    user: user,
                    tokens: Object.assign({}, tokenData)
                };
            }
            else {
                this.setStatus(401);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "Password is incorrect");
            }
        });
    }
    /**
     * Signs Up a user with the provided data.
     * Provide all required signup paramaters to get a new account.
     * This endpoint will return the same thing login would asuming signup was successful.
     * @param {SignUpParams} requestBody - Conatins a signup params and optional Expo push token
     */
    signup(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const v = new node_input_validator_1.Validator(requestBody, {
                first: "required|alpha",
                last: "required|alpha",
                email: "required|email",
                phone: "required|phoneNumber",
                venmo: "required",
                username: "required|alphaNumeric",
                password: "required",
            });
            const matched = yield v.check();
            if (!matched) {
                this.setStatus(422);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, v.errors);
            }
            if (requestBody.venmo.charAt(0) == '@') {
                requestBody.venmo = requestBody.venmo.substr(1, requestBody.venmo.length);
            }
            if ((yield helpers_1.doesUserExist(requestBody.username))) {
                this.setStatus(409);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "That username is already in use");
            }
            const user = new User_1.User();
            requestBody.password = js_sha256_1.sha256(requestBody.password);
            core_1.wrap(user).assign(requestBody);
            yield app_1.BeepORM.userRepository.persistAndFlush(user);
            const tokenData = yield helpers_1.getToken(user);
            helpers_1.createVerifyEmailEntryAndSendEmail(user, requestBody.email, requestBody.first);
            return {
                status: Error_1.APIStatus.Success,
                user: user,
                tokens: Object.assign({}, tokenData)
            };
        });
    }
    /**
     * Logs out a user.
     * This allows us to invalidate a user's authentication token upon logout
     * @param {LogoutParams} requestBody - Param of isApp allows us to remove current pushToken if user is in the app, otheriwse don't remove it because it was a logout on the website
     */
    logout(request, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            yield app_1.BeepORM.tokenRepository.removeAndFlush(request.user.token);
            if (requestBody.isApp) {
                helpers_1.setPushToken(request.user.user, null);
            }
            return new Error_1.APIResponse(Error_1.APIStatus.Success, "Token was revoked");
        });
    }
    /**
     * Removes any tokenid
     * If user's device was offline upon logout, a tokenid was kept in storage. This endpoint handles the removal of the tokenData upon the device's next login
     * @param {RemoveTokenParams} requestBody - Includes the tokenid for the token we need to remove
     */
    removeToken(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            yield app_1.BeepORM.tokenRepository.removeAndFlush({ tokenid: requestBody.tokenid });
            return new Error_1.APIResponse(Error_1.APIStatus.Success, "Token was revoked");
        });
    }
    /**
     * Allows user to initiate a Forgot Password event.
     * This will send them an email that will allow them to reset their password.
     * @param {ForgotPasswordParams} requestBody - The user only enters their email, we use that to send email and identify them
     */
    forgotPassword(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const v = new node_input_validator_1.Validator(requestBody, {
                email: "required|email",
            });
            const matched = yield v.check();
            if (!matched) {
                this.setStatus(422);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, v.errors);
            }
            const user = yield helpers_1.getUserFromEmail(requestBody.email);
            if (!user) {
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "That user account does not exist");
            }
            const existing = yield app_1.BeepORM.forgotPasswordRepository.findOne({ user: user });
            if (existing) {
                helpers_1.sendResetEmail(requestBody.email, existing.id, user.first);
                this.setStatus(409);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "You have already requested to reset your password. We have re-sent your email. Check your email and follow the instructions.");
            }
            const entry = new ForgotPassword_1.ForgotPassword(user);
            yield app_1.BeepORM.forgotPasswordRepository.persistAndFlush(entry);
            helpers_1.sendResetEmail(requestBody.email, entry.id, user.first);
            return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully sent email");
        });
    }
    /**
     * Allows unauthenticated user to reset their password based on a id value sent to them via email and the /password/forgot route
     * If a reset password token is no longer valid, this endpoint is responcible for removing it
     * @param {ResetPasswordParams} requestBody - Request should include the passwordReset token and the new password
     */
    resetPassword(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const v = new node_input_validator_1.Validator(requestBody, {
                password: "required",
            });
            const matched = yield v.check();
            if (!matched) {
                this.setStatus(422);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, v.errors);
            }
            const entry = yield app_1.BeepORM.forgotPasswordRepository.findOne(requestBody.id, { populate: true });
            if (!entry) {
                this.setStatus(404);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "This reset password request does not exist");
            }
            if ((entry.time + (3600 * 1000)) < Date.now()) {
                this.setStatus(410);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "Your verification token has expired. You must re-request to reset your password.");
            }
            entry.user.password = js_sha256_1.sha256(requestBody.password);
            helpers_1.deactivateTokens(entry.user);
            yield app_1.BeepORM.userRepository.persistAndFlush(entry.user);
            return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully reset your password!");
        });
    }
};
__decorate([
    tsoa_1.Post("login"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    tsoa_1.Post("signup"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Post("logout"),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    tsoa_1.Post("token"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "removeToken", null);
__decorate([
    tsoa_1.Post("password/forgot"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    tsoa_1.Post("password/reset"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
AuthController = __decorate([
    tsoa_1.Tags("Auth"),
    tsoa_1.Route("auth")
], AuthController);
exports.AuthController = AuthController;
