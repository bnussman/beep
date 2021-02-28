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
exports.RiderController = void 0;
const express_1 = __importDefault(require("express"));
const notifications_1 = require("../utils/notifications");
const node_input_validator_1 = require("node-input-validator");
const tsoa_1 = require("tsoa");
const Error_1 = require("../utils/Error");
const app_1 = require("../app");
const core_1 = require("@mikro-orm/core");
const QueueEntry_1 = require("../entities/QueueEntry");
let RiderController = class RiderController extends tsoa_1.Controller {
    /**
     * A user can use this 'rider' endpoint to to choose a beep to join their queue
     * This endpoint handles inserting into the queue table and updating user fields
     * @param {ChooseBeepParams} requestBody - The client must send their groupSize, origin and destination, and the beepersid
     * @returns {ChooseBeepResponse | APIResponse}
     */
    chooseBeep(request, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const v = new node_input_validator_1.Validator(requestBody, {
                groupSize: "required|numeric",
                origin: "required",
                destination: "required",
            });
            const matched = yield v.check();
            if (!matched) {
                this.setStatus(422);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, v.errors);
            }
            const beeper = yield app_1.BeepORM.userRepository.findOne(requestBody.beepersID);
            if (!beeper) {
                this.setStatus(500);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "Beeper not found");
            }
            if (!beeper.isBeeping) {
                this.setStatus(410);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "The user you have chosen is no longer beeping at this time.");
            }
            const entry = {
                timeEnteredQueue: Date.now(),
                isAccepted: false,
                groupSize: requestBody.groupSize,
                origin: requestBody.origin,
                destination: requestBody.destination,
                state: 0,
                rider: request.user.user
            };
            const q = new QueueEntry_1.QueueEntry();
            core_1.wrap(q).assign(entry, { em: app_1.BeepORM.em });
            beeper.queue.add(q);
            yield app_1.BeepORM.userRepository.persistAndFlush(beeper);
            notifications_1.sendNotification(beeper, `${request.user.user.name} has entered your queue`, "Please open your app to accept or deny this rider.", "enteredBeeperQueue");
            this.setStatus(200);
            return {
                status: Error_1.APIStatus.Success,
                beeper: beeper
            };
        });
    }
    /**
     * The endpoint will serve the user with data of the most avalible beeper
     * This will NOT initiate a beep, but will simplily give the client data of an avalible beeper
     * @returns {ChooseBeepResponse | APIResponse}
     */
    findBeep() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield app_1.BeepORM.userRepository.findOne({ isBeeping: true });
            if (!r) {
                this.setStatus(404);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "Nobody is beeping right now!");
            }
            return {
                status: Error_1.APIStatus.Success,
                beeper: r
            };
        });
    }
    /**
     * Gets the current status as a rider at any given time. This is how they know anything about their current beep
     * Our socket currently will tell clients a change happend, and this endpoint will be called to get the data
     * @returns {RiderStatusResult | APIResponse}
     */
    getRiderStatus(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = yield app_1.BeepORM.queueEntryRepository.findOne({ rider: request.user.user }, { populate: ['beeper'] });
            if (!entry) {
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "Currently, user is not getting a beep.");
            }
            if (entry.state == -1) {
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "Currently, user is not getting a beep.");
            }
            const ridersQueuePosition = yield app_1.BeepORM.queueEntryRepository.count({ beeper: entry.beeper, timeEnteredQueue: { $lt: entry.timeEnteredQueue } });
            const output = Object.assign({ status: Error_1.APIStatus.Success, ridersQueuePosition: ridersQueuePosition }, entry);
            if (entry.state == 1) {
                const location = yield app_1.BeepORM.locationRepository.findOne({ user: entry.beeper }, {}, { timestamp: core_1.QueryOrder.DESC });
                if (location) {
                    //@ts-ignore
                    output['beeper']['location'] = location;
                }
            }
            return output;
        });
    }
    /**
     * A user can remove themselves from a queue.
     * We send beepersID so we can perfrom one less query to find that value
     * @param {LeaveQueueParams} requestBody - user sends the beepersID so we can skip the step of finding beeperID from users table
     * @returns {APIResponse}
     */
    riderLeaveQueue(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = yield app_1.BeepORM.queueEntryRepository.findOne({ rider: request.user.user });
            if (!entry) {
                this.setStatus(500);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "Unable to leave queue");
            }
            if (entry.isAccepted)
                entry.beeper.queueSize--;
            yield app_1.BeepORM.userRepository.persistAndFlush(entry.beeper);
            entry.state = -1;
            yield app_1.BeepORM.queueEntryRepository.persistAndFlush(entry);
            notifications_1.sendNotification(entry.beeper, `${request.user.user.name} left your queue`, "They decided they did not want a beep from you! :(");
            this.setStatus(200);
            return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully removed user from queue");
        });
    }
    /**
     * Provides client with a list of all people currently beeping
     * @returns {BeeperListResult | APIResponse}
     */
    getBeeperList() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                status: Error_1.APIStatus.Success,
                beepers: yield app_1.BeepORM.userRepository.find({ isBeeping: true })
            };
        });
    }
};
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Patch("choose"),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "chooseBeep", null);
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Get("find"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "findBeep", null);
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Get("status"),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "getRiderStatus", null);
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Delete("leave"),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "riderLeaveQueue", null);
__decorate([
    tsoa_1.Get("list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "getBeeperList", null);
RiderController = __decorate([
    tsoa_1.Tags("Rider"),
    tsoa_1.Route("rider")
], RiderController);
exports.RiderController = RiderController;
