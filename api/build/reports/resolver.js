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
exports.ReportsResolver = void 0;
const Report_1 = require("../entities/Report");
const app_1 = require("../app");
const core_1 = require("@mikro-orm/core");
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const report_1 = require("../validators/report");
const Pagination_1 = __importDefault(require("../args/Pagination"));
const paginated_1 = require("../utils/paginated");
let ReportsResponse = class ReportsResponse extends paginated_1.Paginated(Report_1.Report) {
};
ReportsResponse = __decorate([
    type_graphql_1.ObjectType()
], ReportsResponse);
let ReportsResolver = class ReportsResolver {
    async reportUser(ctx, input) {
        const user = app_1.BeepORM.em.getReference(User_1.User, input.userId);
        const report = new Report_1.Report(ctx.user, user, input.reason, input.beepId);
        await app_1.BeepORM.reportRepository.persistAndFlush(report);
        return true;
    }
    async getReports({ offset, show }) {
        const [reports, count] = await app_1.BeepORM.reportRepository.findAndCount({}, { orderBy: { timestamp: core_1.QueryOrder.DESC }, limit: show, offset: offset, populate: true });
        return {
            items: reports,
            count: count
        };
    }
    async updateReport(ctx, id, input) {
        const report = await app_1.BeepORM.reportRepository.findOne(id, { populate: true });
        if (!report)
            throw new Error("You are trying to update a report that does not exist");
        if (input.handled) {
            report.handledBy = ctx.user;
        }
        else {
            report.handledBy = null;
        }
        core_1.wrap(report).assign(input);
        await app_1.BeepORM.reportRepository.persistAndFlush(report);
        return report;
    }
    async getReport(id) {
        const report = await app_1.BeepORM.reportRepository.findOne(id, { populate: true, refresh: true });
        if (!report) {
            throw new Error("This report entry does not exist");
        }
        return report;
    }
    async deleteReport(id) {
        const report = app_1.BeepORM.reportRepository.getReference(id);
        await app_1.BeepORM.reportRepository.removeAndFlush(report);
        return true;
    }
};
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, report_1.ReportInput]),
    __metadata("design:returntype", Promise)
], ReportsResolver.prototype, "reportUser", null);
__decorate([
    type_graphql_1.Query(() => ReportsResponse),
    type_graphql_1.Authorized(User_1.UserRole.ADMIN),
    __param(0, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_1.default]),
    __metadata("design:returntype", Promise)
], ReportsResolver.prototype, "getReports", null);
__decorate([
    type_graphql_1.Mutation(() => Report_1.Report),
    type_graphql_1.Authorized(User_1.UserRole.ADMIN),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg("id")), __param(2, type_graphql_1.Arg('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, report_1.UpdateReportInput]),
    __metadata("design:returntype", Promise)
], ReportsResolver.prototype, "updateReport", null);
__decorate([
    type_graphql_1.Query(() => Report_1.Report),
    type_graphql_1.Authorized(User_1.UserRole.ADMIN),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsResolver.prototype, "getReport", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.Authorized(User_1.UserRole.ADMIN),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsResolver.prototype, "deleteReport", null);
ReportsResolver = __decorate([
    type_graphql_1.Resolver(Report_1.Report)
], ReportsResolver);
exports.ReportsResolver = ReportsResolver;
