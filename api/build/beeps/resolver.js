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
exports.BeepResolver = void 0;
const app_1 = require("../app");
const Beep_1 = require("../entities/Beep");
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const Pagination_1 = __importDefault(require("../args/Pagination"));
const paginated_1 = require("../utils/paginated");
const User_1 = require("../entities/User");
let BeepsResponse = class BeepsResponse extends paginated_1.Paginated(Beep_1.Beep) {
};
BeepsResponse = __decorate([
    type_graphql_1.ObjectType()
], BeepsResponse);
let BeepResolver = class BeepResolver {
    async getBeeps({ offset, show }) {
        const [beeps, count] = await app_1.BeepORM.beepRepository.findAndCount({}, { orderBy: { doneTime: core_1.QueryOrder.DESC }, limit: show, offset: offset, populate: ['beeper', 'rider'] });
        return {
            items: beeps,
            count: count
        };
    }
    async getBeep(id) {
        const beep = await app_1.BeepORM.beepRepository.findOne(id);
        if (!beep) {
            throw new Error("This beep entry does not exist");
        }
        return beep;
    }
    async deleteBeep(id) {
        const beep = app_1.BeepORM.beepRepository.getReference(id);
        await app_1.BeepORM.beepRepository.removeAndFlush(beep);
        return true;
    }
};
__decorate([
    type_graphql_1.Query(() => BeepsResponse),
    type_graphql_1.Authorized(User_1.UserRole.ADMIN),
    __param(0, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_1.default]),
    __metadata("design:returntype", Promise)
], BeepResolver.prototype, "getBeeps", null);
__decorate([
    type_graphql_1.Query(() => Beep_1.Beep),
    type_graphql_1.Authorized(User_1.UserRole.ADMIN),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BeepResolver.prototype, "getBeep", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.Authorized(User_1.UserRole.ADMIN),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BeepResolver.prototype, "deleteBeep", null);
BeepResolver = __decorate([
    type_graphql_1.Resolver(Beep_1.Beep)
], BeepResolver);
exports.BeepResolver = BeepResolver;
