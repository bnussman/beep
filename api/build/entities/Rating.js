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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rating = void 0;
const core_1 = require("@mikro-orm/core");
const mongodb_1 = require("@mikro-orm/mongodb");
const type_graphql_1 = require("type-graphql");
const Beep_1 = require("./Beep");
const User_1 = require("./User");
let Rating = class Rating {
    constructor(rater, rated, stars, message, beep) {
        this.timestamp = Date.now();
        this.rater = rater;
        this.rated = rated;
        this.stars = stars;
        this.message = message;
        this.beep = beep;
    }
};
__decorate([
    core_1.PrimaryKey(),
    __metadata("design:type", mongodb_1.ObjectId)
], Rating.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.SerializedPrimaryKey(),
    __metadata("design:type", String)
], Rating.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User),
    core_1.ManyToOne(() => User_1.User),
    __metadata("design:type", User_1.User)
], Rating.prototype, "rater", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User),
    core_1.ManyToOne(() => User_1.User),
    __metadata("design:type", User_1.User)
], Rating.prototype, "rated", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.Property(),
    __metadata("design:type", Number)
], Rating.prototype, "stars", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.Property(),
    __metadata("design:type", String)
], Rating.prototype, "message", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.Property(),
    __metadata("design:type", Number)
], Rating.prototype, "timestamp", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.ManyToOne(),
    __metadata("design:type", Beep_1.Beep)
], Rating.prototype, "beep", void 0);
Rating = __decorate([
    type_graphql_1.ObjectType(),
    core_1.Entity(),
    __metadata("design:paramtypes", [User_1.User, User_1.User, Number, String, Beep_1.Beep])
], Rating);
exports.Rating = Rating;
