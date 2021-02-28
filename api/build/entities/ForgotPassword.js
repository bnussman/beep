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
exports.ForgotPassword = void 0;
const core_1 = require("@mikro-orm/core");
const mongodb_1 = require("@mikro-orm/mongodb");
const type_graphql_1 = require("type-graphql");
const User_1 = require("./User");
let ForgotPassword = class ForgotPassword {
    constructor(u) {
        this.time = Date.now();
        this.user = u;
    }
};
__decorate([
    core_1.PrimaryKey(),
    __metadata("design:type", mongodb_1.ObjectId)
], ForgotPassword.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.SerializedPrimaryKey(),
    __metadata("design:type", String)
], ForgotPassword.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.ManyToOne(),
    __metadata("design:type", User_1.User)
], ForgotPassword.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.Property(),
    __metadata("design:type", Number)
], ForgotPassword.prototype, "time", void 0);
ForgotPassword = __decorate([
    type_graphql_1.ObjectType(),
    core_1.Entity(),
    __metadata("design:paramtypes", [User_1.User])
], ForgotPassword);
exports.ForgotPassword = ForgotPassword;
