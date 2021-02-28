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
const User_1 = require("../../entities/User");
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
let EditUserValidator = class EditUserValidator {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], EditUserValidator.prototype, "first", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], EditUserValidator.prototype, "last", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsEmail(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], EditUserValidator.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsMobilePhone("en-US"),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], EditUserValidator.prototype, "phone", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], EditUserValidator.prototype, "venmo", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], EditUserValidator.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], EditUserValidator.prototype, "isBeeping", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], EditUserValidator.prototype, "isEmailVerified", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], EditUserValidator.prototype, "isStudent", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsNumber(),
    class_validator_1.Min(0),
    class_validator_1.Max(100),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], EditUserValidator.prototype, "groupRate", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsNumber(),
    class_validator_1.Min(0),
    class_validator_1.Max(100),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], EditUserValidator.prototype, "singlesRate", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsNumber(),
    class_validator_1.Min(0),
    class_validator_1.Max(20),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], EditUserValidator.prototype, "capacity", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], EditUserValidator.prototype, "masksRequired", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsNumber(),
    class_validator_1.Min(0),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], EditUserValidator.prototype, "queueSize", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], EditUserValidator.prototype, "role", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], EditUserValidator.prototype, "pushToken", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], EditUserValidator.prototype, "photoUrl", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], EditUserValidator.prototype, "username", void 0);
EditUserValidator = __decorate([
    type_graphql_1.InputType()
], EditUserValidator);
exports.default = EditUserValidator;
