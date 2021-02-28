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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeepsController = void 0;
const Error_1 = require("../utils/Error");
const tsoa_1 = require("tsoa");
const app_1 = require("../app");
const core_1 = require("@mikro-orm/core");
let BeepsController = class BeepsController extends tsoa_1.Controller {
    /**
     * Allow admins to get beeps list
     *
     * You can specify and offset and show to get pagination. Ex: https://ridebeep.app/v1/beeps?offset=10&show=10
     *
     * If you do not specify an offset or a show ammount, the API will return EVERY beep event
     *
     * @param {number} [offset] where to start in the DB
     * @param {number} [show] how many to show from start
     * @returns {BeepsResponse | APIResponse} [result]
     */
    getBeeps(offset, show) {
        return __awaiter(this, void 0, void 0, function* () {
            const [beeps, count] = yield app_1.BeepORM.beepRepository.findAndCount({}, { orderBy: { doneTime: core_1.QueryOrder.DESC }, limit: show, offset: offset, populate: ['beeper', 'rider'] });
            return {
                status: Error_1.APIStatus.Success,
                total: count,
                beeps: beeps
            };
        });
    }
    /**
     * Get a beep entry
     *
     * An admin can get the details of a single beep
     *
     * @returns {BeepResponse | APIResponse}
     */
    getBeep(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield app_1.BeepORM.beepRepository.findOne(id);
            if (!result) {
                this.setStatus(404);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "This beep entry does not exist");
            }
            return {
                status: Error_1.APIStatus.Success,
                beep: result
            };
        });
    }
};
__decorate([
    tsoa_1.Security("token", ["admin"]),
    tsoa_1.Get(),
    __param(0, tsoa_1.Query()), __param(1, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], BeepsController.prototype, "getBeeps", null);
__decorate([
    tsoa_1.Security("token", ["admin"]),
    tsoa_1.Get("{id}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BeepsController.prototype, "getBeep", null);
BeepsController = __decorate([
    tsoa_1.Tags("Beeps"),
    tsoa_1.Route("beeps")
], BeepsController);
exports.BeepsController = BeepsController;
