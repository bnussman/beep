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
exports.AccountController = void 0;
const express_1 = __importDefault(require("express"));
const js_sha256_1 = require("js-sha256");
const helpers_1 = require("../auth/helpers");
const helpers_2 = require("./helpers");
const node_input_validator_1 = require("node-input-validator");
const Error_1 = require("../utils/Error");
const tsoa_1 = require("tsoa");
const app_1 = require("../app");
const core_1 = require("@mikro-orm/core");
let AccountController = class AccountController extends tsoa_1.Controller {
    /**
     * Edit your user account
     * @param {EditAccountParams} requestBody - user should send full account data
     * @returns {APIResponse}
     */
    editAccount(request, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const v = new node_input_validator_1.Validator(requestBody, {
                first: "required|alpha",
                last: "required|alpha",
                email: "required|email",
                phone: "required|phoneNumber",
                venmo: "required",
            });
            const matched = yield v.check();
            if (!matched) {
                this.setStatus(422);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, v.errors);
            }
            if (requestBody.venmo.charAt(0) == '@') {
                requestBody.venmo = requestBody.venmo.substr(1, requestBody.venmo.length);
            }
            const oldEmail = request.user.user.email;
            core_1.wrap(request.user.user).assign(requestBody);
            yield app_1.BeepORM.userRepository.persistAndFlush(request.user.user);
            if (oldEmail !== requestBody.email) {
                yield app_1.BeepORM.verifyEmailRepository.nativeDelete({ user: request.user.user });
                core_1.wrap(request.user.user).assign({ isEmailVerified: false, isStudent: false });
                yield app_1.BeepORM.userRepository.persistAndFlush(request.user.user);
                helpers_1.createVerifyEmailEntryAndSendEmail(request.user.user, requestBody.email, requestBody.first);
            }
            return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully edited profile.");
        });
    }
    /**
     * Change your password when authenticated with this endpoint
     * @param {ChangePasswordParams} requestBody - user should send a new password
     * @returns {APIResponse}
     */
    changePassword(request, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const v = new node_input_validator_1.Validator(requestBody, {
                password: "required",
            });
            const matched = yield v.check();
            if (!matched) {
                this.setStatus(422);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, v.errors);
            }
            const encryptedPassword = js_sha256_1.sha256(requestBody.password);
            core_1.wrap(request.user.user).assign({ password: encryptedPassword });
            yield app_1.BeepORM.userRepository.persistAndFlush(request.user.user);
            return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully changed password.");
        });
    }
    /**
     * Update your Push Token to a new push token to ensure mobile device gets notified by Expo
     * @param {UpdatePushTokenParams} requestBody - user should send an Expo Push Token
     * @returns {APIResponse}
     */
    updatePushToken(request, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            core_1.wrap(request.user.user).assign({ pushToken: requestBody.expoPushToken });
            yield app_1.BeepORM.userRepository.persistAndFlush(request.user.user);
            return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully updated push token.");
        });
    }
    /**
     * Verify your account by using the token sent to your email.
     * @param {VerifyAccountParams} requestBody - user should send the token of the verify account entry
     * @returns {VerifyAccountResult | APIResponse}
     */
    verifyAccount(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = yield app_1.BeepORM.verifyEmailRepository.findOne(requestBody.id, { populate: true });
            if (!entry) {
                this.setStatus(404);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "Invalid verify email token");
            }
            if ((entry.time + (3600 * 1000)) < Date.now()) {
                this.setStatus(410);
                yield app_1.BeepORM.verifyEmailRepository.removeAndFlush(entry);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "Your verification token has expired");
            }
            const usersEmail = entry.user.email;
            if (!usersEmail) {
                this.setStatus(400);
                yield app_1.BeepORM.verifyEmailRepository.removeAndFlush(entry);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "Please ensure you have a valid email set in your profile. Visit your app or our website to re-send a varification email.");
            }
            //if the user's current email is not the same as the email they are trying to verify dont prcede with the request
            if (entry.email !== usersEmail) {
                this.setStatus(400);
                yield app_1.BeepORM.verifyEmailRepository.removeAndFlush(entry);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "You tried to verify an email address that is not the same as your current email.");
            }
            let update;
            if (helpers_2.isEduEmail(entry.email)) {
                update = { isEmailVerified: true, isStudent: true };
            }
            else {
                update = { isEmailVerified: true };
            }
            const user = yield app_1.BeepORM.userRepository.findOne(entry.user);
            if (!user)
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "You tried to verify an account that does not exist");
            core_1.wrap(user).assign(update);
            yield app_1.BeepORM.userRepository.persistAndFlush(user);
            yield app_1.BeepORM.verifyEmailRepository.removeAndFlush(entry);
            return {
                status: Error_1.APIStatus.Success,
                message: "Successfully verified email",
                data: Object.assign(Object.assign({}, update), { email: entry.email })
            };
        });
    }
    /**
     * Resend a verification email to a user
     * @returns {APIResponse}
     */
    resendEmailVarification(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield app_1.BeepORM.verifyEmailRepository.nativeDelete({ user: request.user.user });
            helpers_1.createVerifyEmailEntryAndSendEmail(request.user.user, request.user.user.email, request.user.user.first);
            return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully re-sent varification email to " + request.user.user.email);
        });
    }
    /**
     * Delete your own user account
     * @returns {APIResponse}
     */
    deleteAccount(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield helpers_2.deleteUser(request.user.user)) {
                return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully deleted user");
            }
            this.setStatus(500);
            return new Error_1.APIResponse(Error_1.APIStatus.Error, "Unable to delete user");
        });
    }
};
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Patch(),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "editAccount", null);
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Post("password"),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "changePassword", null);
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Put("pushtoken"),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "updatePushToken", null);
__decorate([
    tsoa_1.Post("verify"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "verifyAccount", null);
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Post("verify/resend"),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "resendEmailVarification", null);
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Delete(),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "deleteAccount", null);
AccountController = __decorate([
    tsoa_1.Tags("Account"),
    tsoa_1.Route("account")
], AccountController);
exports.AccountController = AccountController;
