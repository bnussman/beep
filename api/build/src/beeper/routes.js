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
exports.BeeperController = void 0;
const express = __importStar(require("express"));
const notifications_1 = require("../utils/notifications");
const node_input_validator_1 = require("node-input-validator");
const Sentry = __importStar(require("@sentry/node"));
const tsoa_1 = require("tsoa");
const Error_1 = require("../utils/Error");
const core_1 = require("@mikro-orm/core");
const app_1 = require("../app");
const Beep_1 = require("../entities/Beep");
let BeeperController = class BeeperController extends tsoa_1.Controller {
    /**
     * Users use this to set if they are beeping or not
     * It also allows them to update their rates and mask settings
     * @param {SetBeeperStatusParams} requestBody - client sends rates, isBeeping status, mask setting, and capacity
     * @returns {APIResponse}
     */
    setBeeperStatus(request, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const v = new node_input_validator_1.Validator(requestBody, {
                singlesRate: "required|numeric",
                groupRate: "required|numeric",
                capacity: "required|numeric",
                isBeeping: "boolean",
                masksRequired: "boolean"
            });
            const matched = yield v.check();
            if (!matched) {
                this.setStatus(422);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, v.errors);
            }
            if ((requestBody.isBeeping == false) && (request.user.user.queueSize > 0)) {
                this.setStatus(400);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "You can't stop beeping when you still have beeps to complete or riders in your queue");
            }
            core_1.wrap(request.user.user).assign(requestBody);
            yield app_1.BeepORM.userRepository.persistAndFlush(request.user.user);
            return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully updated beeping status");
        });
    }
    /**
     * User calls this to get there queue when beeping.
     * Our Socket server is responcible for telling a client a change occoured, it will prompt
     * a call to this endpoint to get the queue and data
     * @returns {GetBeeperQueueResult | APIResponse}
     */
    getBeeperQueue(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                status: Error_1.APIStatus.Success,
                queue: yield app_1.BeepORM.queueEntryRepository.find({ beeper: request.user.user })
            };
        });
    }
    /**
     * A beeper calls this to set the status of one entry in their queue
     * @param {SetBeeperQueueParams} requestBody - beeper sends the status they want to set, the rider's id, and the queue entry id
     * @returns {APIResponse}
     */
    setBeeperQueue(request, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const queueEntry = yield app_1.BeepORM.queueEntryRepository.findOneOrFail(requestBody.queueID, { populate: true });
            if (requestBody.value == 'accept' || requestBody.value == 'deny') {
                const numRidersBefore = yield app_1.BeepORM.queueEntryRepository.count({ timeEnteredQueue: { $lt: queueEntry.timeEnteredQueue }, isAccepted: false });
                if (numRidersBefore != 0) {
                    this.setStatus(400);
                    return new Error_1.APIResponse(Error_1.APIStatus.Error, "You must respond to the rider who first joined your queue.");
                }
            }
            else {
                const numRidersBefore = yield app_1.BeepORM.queueEntryRepository.count({ timeEnteredQueue: { $lt: queueEntry.timeEnteredQueue }, isAccepted: true });
                if (numRidersBefore != 0) {
                    this.setStatus(400);
                    return new Error_1.APIResponse(Error_1.APIStatus.Error, "You must respond to the rider who first joined your queue.");
                }
            }
            if (requestBody.value == 'accept') {
                queueEntry.isAccepted = true;
                request.user.user.queueSize++;
                notifications_1.sendNotification(queueEntry.rider, `${request.user.user.name} has accepted your beep request`, "You will recieve another notification when they are on their way to pick you up.");
                app_1.BeepORM.queueEntryRepository.persist(queueEntry);
                app_1.BeepORM.userRepository.persist(request.user.user);
                yield app_1.BeepORM.em.flush();
                return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully accepted rider in queue.");
            }
            else if (requestBody.value == 'deny' || requestBody.value == 'complete') {
                const finishedBeep = new Beep_1.Beep();
                core_1.wrap(finishedBeep).assign(queueEntry, { em: app_1.BeepORM.em });
                finishedBeep.doneTime = Date.now();
                finishedBeep._id = queueEntry._id;
                finishedBeep.id = queueEntry.id;
                app_1.BeepORM.beepRepository.persist(finishedBeep);
                if (queueEntry.isAccepted)
                    request.user.user.queueSize--;
                app_1.BeepORM.userRepository.persist(request.user.user);
                queueEntry.state = -1;
                app_1.BeepORM.queueEntryRepository.persist(queueEntry);
                yield app_1.BeepORM.em.flush();
                if (requestBody.value == "deny") {
                    notifications_1.sendNotification(queueEntry.rider, `${request.user.user.name} has denied your beep request`, "Open your app to find a diffrent beeper.");
                }
                return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully removed user from queue.");
            }
            else {
                queueEntry.state++;
                switch (queueEntry.state) {
                    case 1:
                        notifications_1.sendNotification(queueEntry.rider, `${request.user.user.name} is on their way!`, "Your beeper is on their way to pick you up.");
                        break;
                    case 2:
                        notifications_1.sendNotification(queueEntry.rider, `${request.user.user.name} is here!`, "Your beeper is here to pick you up.");
                        break;
                    case 3:
                        break;
                    default:
                        Sentry.captureException("Our beeper's state notification switch statement reached a point that is should not have");
                }
                yield app_1.BeepORM.queueEntryRepository.persistAndFlush(queueEntry);
                return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully changed ride state.");
            }
        });
    }
};
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Patch("status"),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BeeperController.prototype, "setBeeperStatus", null);
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Get("queue"),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BeeperController.prototype, "getBeeperQueue", null);
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Patch("queue/status"),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BeeperController.prototype, "setBeeperQueue", null);
BeeperController = __decorate([
    tsoa_1.Tags("Beeper"),
    tsoa_1.Route("beeper")
], BeeperController);
exports.BeeperController = BeeperController;
