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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeeperResolver = void 0;
const notifications_1 = require("../utils/notifications");
const core_1 = require("@mikro-orm/core");
const app_1 = require("../app");
const Beep_1 = require("../entities/Beep");
const type_graphql_1 = require("type-graphql");
const beeper_1 = require("../validators/beeper");
const Sentry = __importStar(require("@sentry/node"));
let BeeperResolver = class BeeperResolver {
    async setBeeperStatus(ctx, input) {
        if ((input.isBeeping == false) && (ctx.user.queueSize > 0)) {
            throw new Error("You can't stop beeping when you still have beeps to complete or riders in your queue");
        }
        core_1.wrap(ctx.user).assign(input);
        await app_1.BeepORM.userRepository.persistAndFlush(ctx.user);
        await app_1.BeepORM.em.populate(ctx.user, ['queue']);
        return true;
    }
    async setBeeperQueue(ctx, input) {
        const queueEntry = await app_1.BeepORM.queueEntryRepository.findOneOrFail(input.queueId, { populate: true });
        if (input.value == 'accept' || input.value == 'deny') {
            const numRidersBefore = await app_1.BeepORM.queueEntryRepository.count({ timeEnteredQueue: { $lt: queueEntry.timeEnteredQueue }, isAccepted: false });
            if (numRidersBefore != 0) {
                throw new Error("You must respond to the rider who first joined your queue.");
            }
        }
        else {
            const numRidersBefore = await app_1.BeepORM.queueEntryRepository.count({ timeEnteredQueue: { $lt: queueEntry.timeEnteredQueue }, isAccepted: true });
            if (numRidersBefore != 0) {
                throw new Error("You must respond to the rider who first joined your queue.");
            }
        }
        if (input.value == 'accept') {
            queueEntry.isAccepted = true;
            ctx.user.queueSize++;
            notifications_1.sendNotification(queueEntry.rider, `${ctx.user.name} has accepted your beep request`, "You will recieve another notification when they are on their way to pick you up.");
            app_1.BeepORM.queueEntryRepository.persist(queueEntry);
            app_1.BeepORM.userRepository.persist(ctx.user);
            await app_1.BeepORM.em.flush();
            return true;
        }
        else if (input.value == 'deny' || input.value == 'complete') {
            const finishedBeep = new Beep_1.Beep();
            core_1.wrap(finishedBeep).assign(queueEntry, { em: app_1.BeepORM.em });
            finishedBeep.doneTime = Date.now();
            finishedBeep._id = queueEntry._id;
            finishedBeep.id = queueEntry.id;
            app_1.BeepORM.beepRepository.persist(finishedBeep);
            if (queueEntry.isAccepted)
                ctx.user.queueSize--;
            app_1.BeepORM.userRepository.persist(ctx.user);
            queueEntry.state = -1;
            app_1.BeepORM.queueEntryRepository.persist(queueEntry);
            await app_1.BeepORM.em.flush();
            if (input.value == "deny") {
                notifications_1.sendNotification(queueEntry.rider, `${ctx.user.name} has denied your beep request`, "Open your app to find a diffrent beeper.");
            }
            return true;
        }
        else {
            queueEntry.state++;
            switch (queueEntry.state) {
                case 1:
                    notifications_1.sendNotification(queueEntry.rider, `${ctx.user.name} is on their way!`, "Your beeper is on their way to pick you up.");
                    break;
                case 2:
                    notifications_1.sendNotification(queueEntry.rider, `${ctx.user.name} is here!`, "Your beeper is here to pick you up.");
                    break;
                case 3:
                    break;
                default:
                    Sentry.captureException("Our beeper's state notification switch statement reached a point that is should not have");
            }
            await app_1.BeepORM.queueEntryRepository.persistAndFlush(queueEntry);
            return true;
        }
    }
};
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, beeper_1.BeeperSettingsInput]),
    __metadata("design:returntype", Promise)
], BeeperResolver.prototype, "setBeeperStatus", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, beeper_1.UpdateQueueEntryInput]),
    __metadata("design:returntype", Promise)
], BeeperResolver.prototype, "setBeeperQueue", null);
BeeperResolver = __decorate([
    type_graphql_1.Resolver(Beep_1.Beep)
], BeeperResolver);
exports.BeeperResolver = BeeperResolver;
