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
const paginated_1 = require("../utils/paginated");
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const Pagination_1 = __importDefault(require("../args/Pagination"));
const app_1 = require("../app");
const Location_1 = require("../entities/Location");
const location_1 = require("../validators/location");
let LocationsResponse = class LocationsResponse extends paginated_1.Paginated(Location_1.Location) {
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
    async insertLocation(ctx, location, pubSub) {
        const l = new Location_1.Location(location);
        pubSub.publish("Location" + ctx.user.id, l);
        l.user = ctx.user;
        app_1.BeepORM.locationRepository.persist(l);
        return true;
    }
    getLocationUpdates(topic, entry) {
        return entry;
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
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg('location')), __param(2, type_graphql_1.PubSub()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, location_1.LocationInput, type_graphql_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], LocationResolver.prototype, "insertLocation", null);
__decorate([
    type_graphql_1.Subscription(() => Location_1.Location, {
        nullable: true,
        topics: ({ args }) => "Location" + args.topic,
    }),
    __param(0, type_graphql_1.Arg("topic")), __param(1, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Location_1.Location]),
    __metadata("design:returntype", Location_1.Location)
], LocationResolver.prototype, "getLocationUpdates", null);
LocationResolver = __decorate([
    type_graphql_1.Resolver(Location_1.Location)
], LocationResolver);
exports.LocationResolver = LocationResolver;
