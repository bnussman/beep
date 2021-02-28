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
exports.ReportsController = void 0;
const express = __importStar(require("express"));
const node_input_validator_1 = require("node-input-validator");
const tsoa_1 = require("tsoa");
const Error_1 = require("../utils/Error");
const Report_1 = require("../entities/Report");
const mongodb_1 = require("@mikro-orm/mongodb");
const app_1 = require("../app");
const core_1 = require("@mikro-orm/core");
const User_1 = require("../entities/User");
let ReportsController = class ReportsController extends tsoa_1.Controller {
    /**
     * Report a user
     * @returns {APIResponse}
     */
    reportUser(request, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const v = new node_input_validator_1.Validator(requestBody, {
                id: "required",
                reason: "required"
            });
            const matched = yield v.check();
            if (!matched) {
                this.setStatus(422);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, v.errors);
            }
            const user = app_1.BeepORM.em.getReference(User_1.User, requestBody.id);
            let report;
            if (requestBody.beep) {
                report = new Report_1.Report(request.user.user, user, requestBody.reason, new mongodb_1.ObjectId(requestBody.beep));
            }
            else {
                report = new Report_1.Report(request.user.user, user, requestBody.reason);
            }
            yield app_1.BeepORM.reportRepository.persistAndFlush(report);
            return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully reported user");
        });
    }
    /**
     * Allow admins to get reports made by users
     *
     * You can specify and offset and show to get pagination. Ex: https://ridebeep.app/v1/reports?offset=10&show=10
     *
     * If you do not specify an offset or a show ammount, the API will return EVERY report
     *
     * @param {number} [offset] where to start in the DB
     * @param {number} [show] how many to show from start
     * @returns {ReportsResponse | APIResponse} [result]
     */
    getReports(offset, show) {
        return __awaiter(this, void 0, void 0, function* () {
            const [reports, count] = yield app_1.BeepORM.reportRepository.findAndCount({}, { orderBy: { timestamp: core_1.QueryOrder.DESC }, limit: show, offset: offset, populate: ['reporter', 'reported'] });
            return {
                status: Error_1.APIStatus.Success,
                total: count,
                reports: reports
            };
        });
    }
    /**
     * Edit a report entry
     *
     * An admin can mark the report as handled and add notes
     *
     * @param {UpdateReportParams} requestBody - user can send any or all update report params
     * @returns {APIResponse}
     */
    updateReport(request, id, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            let update = requestBody;
            if (requestBody.handled) {
                update = Object.assign(Object.assign({}, requestBody), { handledBy: request.user.user });
            }
            else {
                update = Object.assign(Object.assign({}, requestBody), { handledBy: null });
            }
            const report = app_1.BeepORM.reportRepository.getReference(id);
            core_1.wrap(report).assign(update);
            yield app_1.BeepORM.reportRepository.persistAndFlush(report);
            return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully updated report");
        });
    }
    /**
     * Get a report entry
     *
     * An admin can get the details of a single report
     *
     * @returns {ReportResponse | APIResponse}
     */
    getReport(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield app_1.BeepORM.reportRepository.findOne(id, { populate: true, refresh: true });
            if (!report) {
                this.setStatus(404);
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "This report entry does not exist");
            }
            return {
                status: Error_1.APIStatus.Success,
                report: report
            };
        });
    }
    /**
     * Delete a report entry by id
     * @returns {APIResponse}
     */
    deleteReport(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = app_1.BeepORM.reportRepository.getReference(id);
            yield app_1.BeepORM.reportRepository.removeAndFlush(report);
            return new Error_1.APIResponse(Error_1.APIStatus.Success, "Successfully deleted report");
        });
    }
};
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Post(),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "reportUser", null);
__decorate([
    tsoa_1.Security("token", ["admin"]),
    tsoa_1.Get(),
    __param(0, tsoa_1.Query()), __param(1, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReports", null);
__decorate([
    tsoa_1.Security("token", ["admin"]),
    tsoa_1.Patch("{id}"),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Path()), __param(2, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "updateReport", null);
__decorate([
    tsoa_1.Security("token", ["admin"]),
    tsoa_1.Get("{id}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReport", null);
__decorate([
    tsoa_1.Security("token", ["admin"]),
    tsoa_1.Delete("{id}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "deleteReport", null);
ReportsController = __decorate([
    tsoa_1.Tags("Reports"),
    tsoa_1.Route("reports")
], ReportsController);
exports.ReportsController = ReportsController;
