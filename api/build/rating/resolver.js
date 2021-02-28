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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingResolver = void 0;
const app_1 = require("../app");
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const Rating_1 = require("../entities/Rating");
const rating_1 = require("../validators/rating");
const Beep_1 = require("../entities/Beep");
let RatingResolver = class RatingResolver {
    async rateUser(ctx, input) {
        const user = app_1.BeepORM.em.getReference(User_1.User, input.userId);
        const beep = input.beepId ? app_1.BeepORM.em.getReference(Beep_1.Beep, input.beepId) : undefined;
        const rating = new Rating_1.Rating(ctx.user, user, input.stars, input.message, beep);
        await app_1.BeepORM.reportRepository.persistAndFlush(rating);
        return true;
    }
    async getUserRating(id) {
        return await app_1.BeepORM.ratingRepository.find({ rated: id });
    }
};
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rating_1.RatingInput]),
    __metadata("design:returntype", Promise)
], RatingResolver.prototype, "rateUser", null);
__decorate([
    type_graphql_1.Query(() => [Rating_1.Rating]),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RatingResolver.prototype, "getUserRating", null);
RatingResolver = __decorate([
    type_graphql_1.Resolver(Rating_1.Rating)
], RatingResolver);
exports.RatingResolver = RatingResolver;
