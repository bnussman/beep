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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const helpers_1 = require("../account/helpers");
const app_1 = require("../app");
const core_1 = require("@mikro-orm/core");
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const Pagination_1 = __importDefault(require("../args/Pagination"));
const Beep_1 = require("../entities/Beep");
const QueueEntry_1 = require("../entities/QueueEntry");
const EditUser_1 = __importDefault(require("../validators/user/EditUser"));
const graphql_fields_to_relations_1 = __importDefault(require("graphql-fields-to-relations"));
const paginated_1 = require("../utils/paginated");
let UsersResponse = class UsersResponse extends paginated_1.Paginated(User_1.User) {
};
UsersResponse = __decorate([
    type_graphql_1.ObjectType()
], UsersResponse);
let UserResolver = class UserResolver {
    async getUser(id, info) {
        const relationPaths = graphql_fields_to_relations_1.default(info);
        const user = await app_1.BeepORM.userRepository.findOne(id, relationPaths);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    async removeUser(id) {
        const user = app_1.BeepORM.em.getReference(User_1.User, id);
        if (!user) {
            throw new Error("User not found");
        }
        if (await helpers_1.deleteUser(user)) {
            return true;
        }
        return false;
    }
    async editUser(id, data, pubSub) {
        const user = await app_1.BeepORM.userRepository.findOne(id);
        if (!user) {
            throw new Error("User not found");
        }
        core_1.wrap(user).assign(data);
        pubSub.publish("User" + id, data);
        await app_1.BeepORM.userRepository.persistAndFlush(user);
        return user;
    }
    async getUsers({ offset, show }) {
        const [users, count] = await app_1.BeepORM.em.findAndCount(User_1.User, {}, { limit: show, offset: offset });
        return {
            items: users,
            count: count
        };
    }
    async getRideHistory(ctx, id) {
        return await app_1.BeepORM.beepRepository.find({ rider: id || ctx.user }, { populate: true });
    }
    async getBeepHistory(ctx, id) {
        return await app_1.BeepORM.beepRepository.find({ beeper: id || ctx.user }, { populate: true });
    }
    async getQueue(ctx, info, id) {
        const relationPaths = graphql_fields_to_relations_1.default(info);
        const r = await app_1.BeepORM.queueEntryRepository.find({ beeper: id || ctx.user.id }, relationPaths);
        return r;
    }
    getUserUpdates(topic, user) {
        return user;
    }
};
__decorate([
    type_graphql_1.Query(() => User_1.User),
    __param(0, type_graphql_1.Arg("id")), __param(1, type_graphql_1.Info()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUser", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.Authorized(User_1.UserRole.ADMIN),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "removeUser", null);
__decorate([
    type_graphql_1.Mutation(() => User_1.User),
    type_graphql_1.Authorized(User_1.UserRole.ADMIN),
    __param(0, type_graphql_1.Arg("id")), __param(1, type_graphql_1.Arg('data')), __param(2, type_graphql_1.PubSub()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, EditUser_1.default, type_graphql_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "editUser", null);
__decorate([
    type_graphql_1.Query(() => UsersResponse),
    type_graphql_1.Authorized(User_1.UserRole.ADMIN),
    __param(0, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_1.default]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUsers", null);
__decorate([
    type_graphql_1.Query(() => [Beep_1.Beep]),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg("id", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getRideHistory", null);
__decorate([
    type_graphql_1.Query(() => [Beep_1.Beep]),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg("id", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getBeepHistory", null);
__decorate([
    type_graphql_1.Query(() => [QueueEntry_1.QueueEntry]),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Info()), __param(2, type_graphql_1.Arg("id", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getQueue", null);
__decorate([
    type_graphql_1.Subscription(() => User_1.PartialUser, {
        topics: ({ args }) => "User" + args.topic,
    }),
    __param(0, type_graphql_1.Arg("topic")), __param(1, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, User_1.User]),
    __metadata("design:returntype", Object)
], UserResolver.prototype, "getUserUpdates", null);
UserResolver = __decorate([
    type_graphql_1.Resolver(User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
