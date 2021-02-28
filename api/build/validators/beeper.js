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
exports.UpdateQueueEntryInput = exports.BeeperSettingsInput = void 0;
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
let BeeperSettingsInput = class BeeperSettingsInput {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsNumber(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], BeeperSettingsInput.prototype, "singlesRate", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsNumber(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], BeeperSettingsInput.prototype, "groupRate", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsNumber(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], BeeperSettingsInput.prototype, "capacity", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], BeeperSettingsInput.prototype, "isBeeping", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], BeeperSettingsInput.prototype, "masksRequired", void 0);
BeeperSettingsInput = __decorate([
    type_graphql_1.InputType()
], BeeperSettingsInput);
exports.BeeperSettingsInput = BeeperSettingsInput;
let UpdateQueueEntryInput = class UpdateQueueEntryInput {
};
__decorate([
    type_graphql_1.Field(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateQueueEntryInput.prototype, "value", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateQueueEntryInput.prototype, "riderId", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateQueueEntryInput.prototype, "queueId", void 0);
UpdateQueueEntryInput = __decorate([
    type_graphql_1.InputType()
], UpdateQueueEntryInput);
exports.UpdateQueueEntryInput = UpdateQueueEntryInput;
