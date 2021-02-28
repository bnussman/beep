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
exports.Location = void 0;
const core_1 = require("@mikro-orm/core");
const mongodb_1 = require("@mikro-orm/mongodb");
const User_1 = require("./User");
let Location = class Location {
    constructor() {
        this.timestamp = Date.now();
    }
};
__decorate([
    core_1.PrimaryKey(),
    __metadata("design:type", mongodb_1.ObjectId)
], Location.prototype, "_id", void 0);
__decorate([
    core_1.SerializedPrimaryKey(),
    __metadata("design:type", String)
], Location.prototype, "id", void 0);
__decorate([
    core_1.ManyToOne(),
    __metadata("design:type", User_1.User)
], Location.prototype, "user", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], Location.prototype, "latitude", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], Location.prototype, "longitude", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], Location.prototype, "altitude", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], Location.prototype, "accuracy", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], Location.prototype, "altitudeAccuracy", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], Location.prototype, "heading", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], Location.prototype, "speed", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], Location.prototype, "timestamp", void 0);
Location = __decorate([
    core_1.Entity()
], Location);
exports.Location = Location;
