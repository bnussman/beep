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
exports.UsersController = void 0;
const express_1 = __importDefault(require("express"));
const tsoa_1 = require("tsoa");
const Error_1 = require("../utils/Error");
const helpers_1 = require("../account/helpers");
const app_1 = require("../app");
const mongodb_1 = require("@mikro-orm/mongodb");
const core_1 = require("@mikro-orm/core");
const User_1 = require("../entities/User");
let UsersController = class UsersController extends tsoa_1.Controller {
    /**
     * Get public information about any user by providing their user id,
     * if user has admin permission (auth is OPTIONAL), they will get more personal information about the user
     * @returns {UserResult | APIResponse}
     */
    getUser(request, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield app_1.BeepORM.userRepository.findOne(id);
            if (!user) {
                this.setStatus(404);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "User not found");
            }
            return {
                status: Error_1.APIStatus.Success,
                user: user
            };
        });
    }
    /**
     * Delete an account by user id
     * @returns {APIResponse}
     */
    removeUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = app_1.BeepORM.em.getReference(User_1.User, new mongodb_1.ObjectId(id));
            if (!user) {
                this.setStatus(404);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "User not found");
            }
            if (yield helpers_1.deleteUser(user)) {
                return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully deleted user");
            }
            this.setStatus(500);
            return new Error_1.APIResponse(Error_1.APIStatus.Error, "Unable to delete user");
        });
    }
    /**
     * Edit a user account
     * @param {EditUserParams} requestBody - user can send any or all account params
     * @returns {APIResponse}
     */
    editUser(id, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield app_1.BeepORM.userRepository.findOne(id);
            if (!user) {
                this.setStatus(404);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "User not found");
            }
            core_1.wrap(user).assign(requestBody);
            yield app_1.BeepORM.userRepository.persistAndFlush(user);
            return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully edited user");
        });
    }
    /**
     * Get a list of every Beep App User for admins.
     *
     * You can specify and offset and show to get pagination. Ex: https://ridebeep.app/v1/users?offset=10&show=10
     *
     * If you do not specify an offset or a show ammount, the API will return EVERY user
     *
     * @param {number} [offset] where to start in the DB
     * @param {number} [show] how many to show from start
     * @returns {UsersResponse | APIResponse} [result]
     */
    getUsers(offset, show) {
        return __awaiter(this, void 0, void 0, function* () {
            const [users, count] = yield app_1.BeepORM.em.findAndCount(User_1.User, {}, { limit: show, offset: offset });
            return {
                status: Error_1.APIStatus.Success,
                total: count,
                users: users
            };
        });
    }
    /**
     * Get all of the rides of this user in the history table
     * @returns {RiderHistoryResult | APIResponse}
     */
    getRideHistory(request, id) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            if (request.user.user._id != id) {
                const isAdmin = await hasUserLevel(request.user.user, 1);
                console.log(isAdmin);
    
                if (!isAdmin) return new APIResponse(APIStatus.Error, "You must be an admin to view other peoples history");
            }
            */
            const r = yield app_1.BeepORM.beepRepository.find({ rider: new mongodb_1.ObjectId(id) }, { populate: true });
            return {
                status: Error_1.APIStatus.Success,
                data: r
            };
        });
    }
    /**
     * Get all of the beeps of this user in the history table
     * @returns {BeeperHistoryResult | APIResponse}
     */
    getBeepHistory(request, id) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            if (request.user.user._id != new ObjectId(id)) {
                const isAdmin = await hasUserLevel(request.user.user, 1);
    
                if (!isAdmin) return new APIResponse(APIStatus.Error, "You must be an admin to view other peoples history");
            }
            */
            const r = yield app_1.BeepORM.beepRepository.find({ beeper: new mongodb_1.ObjectId(id) }, { populate: true });
            return {
                status: Error_1.APIStatus.Success,
                data: r
            };
        });
    }
    /**
     * User calls this to get there queue when beeping.
     * Our Socket server is responcible for telling a client a change occoured, it will prompt
     * a call to this endpoint to get the queue and data
     * @returns {GetBeeperQueueResult}
     */
    getQueue(request, id) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO: figure this out
            /*
            if (request.user.user._id != id) {
                const isAdmin = await hasUserLevel(request.user.user._id, 1);
    
                if (!isAdmin) return new APIResponse(APIStatus.Error, "You must be an admin to view other peoples queue");
            }
            */
            const r = yield app_1.BeepORM.queueEntryRepository.find({ beeper: id }, { populate: true });
            for (let i = 0; i < r.length; i++) {
                if (r[i].state == -1) {
                    //await BeepORM.queueEntryRepository.nativeDelete(r[i]);
                    app_1.BeepORM.queueEntryRepository.nativeDelete(r[i]);
                }
            }
            return {
                status: Error_1.APIStatus.Success,
                queue: r.filter(entry => entry.state != -1)
            };
        });
    }
};
__decorate([
    tsoa_1.Security("optionalAdmin"),
    tsoa_1.Get("{id}"),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUser", null);
__decorate([
    tsoa_1.Security("token", ["admin"]),
    tsoa_1.Delete("{id}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeUser", null);
__decorate([
    tsoa_1.Security("token", ["admin"]),
    tsoa_1.Patch("{id}"),
    __param(0, tsoa_1.Path()), __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "editUser", null);
__decorate([
    tsoa_1.Security("token", ["admin"]),
    tsoa_1.Get(),
    __param(0, tsoa_1.Query()), __param(1, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Get("{id}/history/rider"),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRideHistory", null);
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Get("{id}/history/beeper"),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getBeepHistory", null);
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Get("{id}/queue"),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getQueue", null);
UsersController = __decorate([
    tsoa_1.Tags("Users"),
    tsoa_1.Route("users")
], UsersController);
exports.UsersController = UsersController;
