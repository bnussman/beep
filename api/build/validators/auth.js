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
exports.SignUpInput = exports.LoginInput = void 0;
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
let LoginInput = class LoginInput {
};
__decorate([
    type_graphql_1.Field(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], LoginInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], LoginInput.prototype, "pushToken", void 0);
LoginInput = __decorate([
    type_graphql_1.InputType()
], LoginInput);
exports.LoginInput = LoginInput;
let SignUpInput = class SignUpInput {
};
__decorate([
    type_graphql_1.Field(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SignUpInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SignUpInput.prototype, "first", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SignUpInput.prototype, "last", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.IsMobilePhone("en-US"),
    __metadata("design:type", String)
], SignUpInput.prototype, "phone", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], SignUpInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SignUpInput.prototype, "venmo", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SignUpInput.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SignUpInput.prototype, "pushToken", void 0);
SignUpInput = __decorate([
    type_graphql_1.InputType()
], SignUpInput);
exports.SignUpInput = SignUpInput;
