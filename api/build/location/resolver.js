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
exports.LocationResolver = void 0;
const resolver_1 = require("../users/resolver");
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const Pagination_1 = __importDefault(require("../args/Pagination"));
const app_1 = require("../app");
const Location_1 = require("../entities/Location");
let LocationsResponse = class LocationsResponse extends resolver_1.Paginated(Location_1.Location) {
};
LocationsResponse = __decorate([
    type_graphql_1.ObjectType()
], LocationsResponse);
let LocationResolver = class LocationResolver {
    async getLocations({ offset, show }, id) {
        const [locations, count] = await app_1.BeepORM.locationRepository.findAndCount(id ? { user: id } : {}, { limit: show, offset: offset });
        return {
            items: locations,
            count: count
        };
    }
};
__decorate([
    type_graphql_1.Query(() => LocationsResponse),
    type_graphql_1.Authorized(User_1.UserRole.ADMIN),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Arg('id', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_1.default, String]),
    __metadata("design:returntype", Promise)
], LocationResolver.prototype, "getLocations", null);
LocationResolver = __decorate([
    type_graphql_1.Resolver(Location_1.Location)
], LocationResolver);
exports.LocationResolver = LocationResolver;
