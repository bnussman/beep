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
exports.RatingInput = void 0;
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
let RatingInput = class RatingInput {
};
__decorate([
    type_graphql_1.Field(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], RatingInput.prototype, "userId", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.IsNumber(),
    class_validator_1.Max(5),
    class_validator_1.Min(1),
    __metadata("design:type", Number)
], RatingInput.prototype, "stars", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], RatingInput.prototype, "message", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], RatingInput.prototype, "beepId", void 0);
RatingInput = __decorate([
    type_graphql_1.InputType()
], RatingInput);
exports.RatingInput = RatingInput;
