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
exports.QueueEntry = void 0;
const core_1 = require("@mikro-orm/core");
const mongodb_1 = require("@mikro-orm/mongodb");
const User_1 = require("./User");
let QueueEntry = class QueueEntry {
    constructor() {
        this.state = 0;
    }
};
__decorate([
    core_1.PrimaryKey(),
    __metadata("design:type", mongodb_1.ObjectId)
], QueueEntry.prototype, "_id", void 0);
__decorate([
    core_1.SerializedPrimaryKey(),
    __metadata("design:type", String)
], QueueEntry.prototype, "id", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], QueueEntry.prototype, "origin", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], QueueEntry.prototype, "destination", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], QueueEntry.prototype, "state", void 0);
__decorate([
    core_1.Property({ default: false }),
    __metadata("design:type", Boolean)
], QueueEntry.prototype, "isAccepted", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], QueueEntry.prototype, "groupSize", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], QueueEntry.prototype, "timeEnteredQueue", void 0);
__decorate([
    core_1.ManyToOne(() => User_1.User),
    __metadata("design:type", User_1.User)
], QueueEntry.prototype, "beeper", void 0);
__decorate([
    core_1.ManyToOne(() => User_1.User),
    __metadata("design:type", User_1.User)
], QueueEntry.prototype, "rider", void 0);
QueueEntry = __decorate([
    core_1.Entity()
], QueueEntry);
exports.QueueEntry = QueueEntry;
