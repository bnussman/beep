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
exports.Beep = void 0;
const core_1 = require("@mikro-orm/core");
const mongodb_1 = require("@mikro-orm/mongodb");
const User_1 = require("./User");
let Beep = class Beep {
    constructor() {
        this.timeEnteredQueue = Date.now();
    }
};
__decorate([
    core_1.PrimaryKey(),
    __metadata("design:type", mongodb_1.ObjectId)
], Beep.prototype, "_id", void 0);
__decorate([
    core_1.SerializedPrimaryKey(),
    __metadata("design:type", String)
], Beep.prototype, "id", void 0);
__decorate([
    core_1.ManyToOne(),
    __metadata("design:type", User_1.User)
], Beep.prototype, "beeper", void 0);
__decorate([
    core_1.ManyToOne(),
    __metadata("design:type", User_1.User)
], Beep.prototype, "rider", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], Beep.prototype, "origin", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], Beep.prototype, "destination", void 0);
__decorate([
    core_1.Property({ default: 0 }),
    __metadata("design:type", Number)
], Beep.prototype, "state", void 0);
__decorate([
    core_1.Property({ default: false }),
    __metadata("design:type", Boolean)
], Beep.prototype, "isAccepted", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], Beep.prototype, "groupSize", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], Beep.prototype, "timeEnteredQueue", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], Beep.prototype, "doneTime", void 0);
Beep = __decorate([
    core_1.Entity()
], Beep);
exports.Beep = Beep;
