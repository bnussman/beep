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
exports.AccountResolver = void 0;
const js_sha256_1 = require("js-sha256");
const helpers_1 = require("../auth/helpers");
const helpers_2 = require("./helpers");
const app_1 = require("../app");
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const account_1 = require("../validators/account");
const User_1 = require("../entities/User");
const apollo_server_1 = require("apollo-server");
let AccountResolver = class AccountResolver {
    async editAccount(ctx, input) {
        if (input.venmo && input.venmo.charAt(0) == '@') {
            input.venmo = input.venmo.substr(1, input.venmo.length);
        }
        const oldEmail = ctx.user.email;
        core_1.wrap(ctx.user).assign(input);
        await app_1.BeepORM.userRepository.persistAndFlush(ctx.user);
        if (oldEmail !== input.email) {
            await app_1.BeepORM.verifyEmailRepository.nativeDelete({ user: ctx.user });
            core_1.wrap(ctx.user).assign({ isEmailVerified: false, isStudent: false });
            await app_1.BeepORM.userRepository.persistAndFlush(ctx.user);
            helpers_1.createVerifyEmailEntryAndSendEmail(ctx.user, input.email, input.first);
        }
        return ctx.user;
    }
    async changePassword(ctx, password) {
        const encryptedPassword = js_sha256_1.sha256(password);
        core_1.wrap(ctx.user).assign({ password: encryptedPassword });
        await app_1.BeepORM.userRepository.persistAndFlush(ctx.user);
        return true;
    }
    async updatePushToken(ctx, pushToken) {
        core_1.wrap(ctx.user).assign({ pushToken: pushToken });
        await app_1.BeepORM.userRepository.persistAndFlush(ctx.user);
        return true;
    }
    async verifyAccount(id) {
        const entry = await app_1.BeepORM.verifyEmailRepository.findOne(id, { populate: true });
        if (!entry) {
            throw new Error("Invalid verify email token");
        }
        if ((entry.time + (3600 * 1000)) < Date.now()) {
            await app_1.BeepORM.verifyEmailRepository.removeAndFlush(entry);
            throw new Error("Your verification token has expired");
        }
        const usersEmail = entry.user.email;
        if (!usersEmail) {
            await app_1.BeepORM.verifyEmailRepository.removeAndFlush(entry);
            throw new Error("Please ensure you have a valid email set in your profile. Visit your app or our website to re-send a varification email.");
        }
        //if the user's current email is not the same as the email they are trying to verify dont prcede with the request
        if (entry.email !== usersEmail) {
            await app_1.BeepORM.verifyEmailRepository.removeAndFlush(entry);
            throw new Error("You tried to verify an email address that is not the same as your current email.");
        }
        let update;
        if (helpers_2.isEduEmail(entry.email)) {
            update = { isEmailVerified: true, isStudent: true };
        }
        else {
            update = { isEmailVerified: true };
        }
        const user = await app_1.BeepORM.userRepository.findOne(entry.user);
        if (!user)
            throw new Error("You tried to verify an account that does not exist");
        core_1.wrap(user).assign(update);
        await app_1.BeepORM.userRepository.persistAndFlush(user);
        await app_1.BeepORM.verifyEmailRepository.removeAndFlush(entry);
        return true;
    }
    async resendEmailVarification(ctx) {
        await app_1.BeepORM.verifyEmailRepository.nativeDelete({ user: ctx.user });
        helpers_1.createVerifyEmailEntryAndSendEmail(ctx.user, ctx.user.email, ctx.user.first);
        return true;
    }
    async deleteAccount(ctx) {
        return await helpers_2.deleteUser(ctx.user);
    }
    async uploadPhoto(photo) {
        console.log(photo);
        return true;
    }
};
__decorate([
    type_graphql_1.Mutation(() => User_1.User),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, account_1.EditAccountInput]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "editAccount", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "changePassword", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg('pushToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "updatePushToken", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "verifyAccount", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "resendEmailVarification", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "deleteAccount", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('photo', () => apollo_server_1.GraphQLUpload)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "uploadPhoto", null);
AccountResolver = __decorate([
    type_graphql_1.Resolver()
], AccountResolver);
exports.AccountResolver = AccountResolver;
