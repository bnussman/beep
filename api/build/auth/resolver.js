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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResolver = void 0;
const js_sha256_1 = require("js-sha256");
const helpers_1 = require("./helpers");
const core_1 = require("@mikro-orm/core");
const app_1 = require("../app");
const User_1 = require("../entities/User");
const ForgotPassword_1 = require("../entities/ForgotPassword");
const type_graphql_1 = require("type-graphql");
const auth_1 = require("../validators/auth");
const TokenEntry_1 = require("../entities/TokenEntry");
let Auth = class Auth {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", User_1.User)
], Auth.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => TokenEntry_1.TokenEntry),
    __metadata("design:type", TokenEntry_1.TokenEntry)
], Auth.prototype, "tokens", void 0);
Auth = __decorate([
    type_graphql_1.ObjectType()
], Auth);
let AuthResolver = class AuthResolver {
    async login(input) {
        const user = await app_1.BeepORM.userRepository.findOne({ username: input.username });
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.password) {
            await app_1.BeepORM.userRepository.populate(user, 'password');
        }
        if (user.password != js_sha256_1.sha256(input.password)) {
            throw new Error("Password is incorrect");
        }
        const tokenData = await helpers_1.getToken(user);
        if (input.pushToken) {
            helpers_1.setPushToken(user, input.pushToken);
        }
        return {
            user: user,
            tokens: tokenData
        };
    }
    async signup(input) {
        if (input.venmo.charAt(0) == '@') {
            input.venmo = input.venmo.substr(1, input.venmo.length);
        }
        if ((await helpers_1.doesUserExist(input.username))) {
            throw new Error("That username is already in use");
        }
        const user = new User_1.User();
        input.password = js_sha256_1.sha256(input.password);
        core_1.wrap(user).assign(input);
        await app_1.BeepORM.userRepository.persistAndFlush(user);
        const tokenData = await helpers_1.getToken(user);
        helpers_1.createVerifyEmailEntryAndSendEmail(user, input.email, input.first);
        return {
            user: user,
            tokens: tokenData
        };
    }
    async logout(ctx, isApp) {
        await app_1.BeepORM.tokenRepository.removeAndFlush(ctx.token);
        if (isApp) {
            helpers_1.setPushToken(ctx.user, null);
        }
        return true;
    }
    async removeToken(tokenid) {
        await app_1.BeepORM.tokenRepository.removeAndFlush({ tokenid: tokenid });
        return true;
    }
    async forgotPassword(email) {
        const user = await helpers_1.getUserFromEmail(email);
        if (!user) {
            throw new Error("User does not exist");
        }
        const existing = await app_1.BeepORM.forgotPasswordRepository.findOne({ user: user });
        if (existing) {
            helpers_1.sendResetEmail(email, existing.id, user.first);
            throw new Error("You have already requested to reset your password. We have re-sent your email. Check your email and follow the instructions.");
        }
        const entry = new ForgotPassword_1.ForgotPassword(user);
        await app_1.BeepORM.forgotPasswordRepository.persistAndFlush(entry);
        helpers_1.sendResetEmail(email, entry.id, user.first);
        return true;
    }
    async resetPassword(id, password) {
        const entry = await app_1.BeepORM.forgotPasswordRepository.findOne(id, { populate: true });
        if (!entry) {
            throw new Error("This reset password request does not exist");
        }
        if ((entry.time + (3600 * 1000)) < Date.now()) {
            throw new Error("Your verification token has expired. You must re-request to reset your password.");
        }
        entry.user.password = js_sha256_1.sha256(password);
        helpers_1.deactivateTokens(entry.user);
        await app_1.BeepORM.userRepository.persistAndFlush(entry.user);
        return true;
    }
};
__decorate([
    type_graphql_1.Mutation(() => Auth),
    __param(0, type_graphql_1.Arg('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_1.LoginInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Auth),
    __param(0, type_graphql_1.Arg('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_1.SignUpInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "signup", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg('isApp', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "logout", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "removeToken", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "forgotPassword", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('id')), __param(1, type_graphql_1.Arg('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "resetPassword", null);
AuthResolver = __decorate([
    type_graphql_1.Resolver()
], AuthResolver);
exports.AuthResolver = AuthResolver;
