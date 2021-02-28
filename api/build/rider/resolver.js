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
exports.RiderResolver = void 0;
const notifications_1 = require("../utils/notifications");
const app_1 = require("../app");
const core_1 = require("@mikro-orm/core");
const QueueEntry_1 = require("../entities/QueueEntry");
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const rider_1 = __importDefault(require("../validators/rider"));
let RiderResolver = class RiderResolver {
    async chooseBeep(ctx, beeperId, input) {
        const beeper = await app_1.BeepORM.userRepository.findOne(beeperId);
        if (!beeper) {
            throw new Error("Beeper not found");
        }
        if (!beeper.isBeeping) {
            throw new Error("The user you have chosen is no longer beeping at this time.");
        }
        const entry = {
            timeEnteredQueue: Date.now(),
            isAccepted: false,
            groupSize: input.groupSize,
            origin: input.origin,
            destination: input.destination,
            state: 0,
            rider: ctx.user
        };
        const q = new QueueEntry_1.QueueEntry();
        core_1.wrap(q).assign(entry, { em: app_1.BeepORM.em });
        beeper.queue.add(q);
        await app_1.BeepORM.userRepository.persistAndFlush(beeper);
        notifications_1.sendNotification(beeper, `${ctx.user.name} has entered your queue`, "Please open your app to accept or deny this rider.", "enteredBeeperQueue");
        q.ridersQueuePosition = -1;
        return q;
    }
    async findBeep() {
        const beeper = await app_1.BeepORM.userRepository.findOne({ isBeeping: true });
        if (!beeper) {
            throw new Error("Nobody is beeping right now!");
        }
        return beeper;
    }
    async getRiderStatus(ctx) {
        const entry = await app_1.BeepORM.queueEntryRepository.findOne({ rider: ctx.user }, { populate: ['beeper'] });
        if (entry?.state == -1)
            await app_1.BeepORM.queueEntryRepository.nativeDelete(entry);
        if (!entry || entry.state == -1) {
            throw new Error("Currently, user is not getting a beep.");
        }
        const ridersQueuePosition = await app_1.BeepORM.queueEntryRepository.count({ beeper: entry.beeper, timeEnteredQueue: { $lt: entry.timeEnteredQueue }, state: { $ne: -1 } });
        entry.ridersQueuePosition = ridersQueuePosition;
        if (entry.state == 1) {
            const location = await app_1.BeepORM.locationRepository.findOne({ user: entry.beeper }, {}, { timestamp: core_1.QueryOrder.DESC });
            if (location) {
                entry.location = location;
            }
        }
        return entry;
    }
    async riderLeaveQueue(ctx) {
        const entry = await app_1.BeepORM.queueEntryRepository.findOne({ rider: ctx.user });
        if (!entry) {
            throw new Error("Unable to leave queue");
        }
        if (entry.isAccepted)
            entry.beeper.queueSize--;
        await app_1.BeepORM.userRepository.persistAndFlush(entry.beeper);
        entry.state = -1;
        await app_1.BeepORM.queueEntryRepository.persistAndFlush(entry);
        notifications_1.sendNotification(entry.beeper, `${ctx.user.name} left your queue`, "They decided they did not want a beep from you! :(");
        return true;
    }
    async getBeeperList() {
        return await app_1.BeepORM.userRepository.find({ isBeeping: true });
    }
};
__decorate([
    type_graphql_1.Mutation(() => QueueEntry_1.QueueEntry),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg('beeperId')), __param(2, type_graphql_1.Arg('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, rider_1.default]),
    __metadata("design:returntype", Promise)
], RiderResolver.prototype, "chooseBeep", null);
__decorate([
    type_graphql_1.Query(() => User_1.User),
    type_graphql_1.Authorized(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RiderResolver.prototype, "findBeep", null);
__decorate([
    type_graphql_1.Query(() => QueueEntry_1.QueueEntry),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RiderResolver.prototype, "getRiderStatus", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RiderResolver.prototype, "riderLeaveQueue", null);
__decorate([
    type_graphql_1.Query(returns => [User_1.User]),
    type_graphql_1.Authorized(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RiderResolver.prototype, "getBeeperList", null);
RiderResolver = __decorate([
    type_graphql_1.Resolver()
], RiderResolver);
exports.RiderResolver = RiderResolver;
