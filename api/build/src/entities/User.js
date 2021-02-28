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
exports.UserRole = exports.User = void 0;
const core_1 = require("@mikro-orm/core");
const mongodb_1 = require("@mikro-orm/mongodb");
const QueueEntry_1 = require("./QueueEntry");
let User = class User {
    constructor() {
        this.isBeeping = false;
        this.isEmailVerified = false;
        this.isStudent = false;
        this.groupRate = 4.0;
        this.singlesRate = 3.0;
        this.capacity = 4;
        this.masksRequired = false;
        this.queueSize = 0;
        this.role = UserRole.USER;
        this.queue = new core_1.Collection(this);
    }
    get name() {
        return `${this.first} ${this.last}`;
    }
};
__decorate([
    core_1.PrimaryKey(),
    __metadata("design:type", mongodb_1.ObjectId)
], User.prototype, "_id", void 0);
__decorate([
    core_1.SerializedPrimaryKey(),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], User.prototype, "first", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], User.prototype, "last", void 0);
__decorate([
    core_1.Property(),
    core_1.Unique(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    core_1.Property(),
    core_1.Unique(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], User.prototype, "venmo", void 0);
__decorate([
    core_1.Property({ lazy: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], User.prototype, "isBeeping", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], User.prototype, "isStudent", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], User.prototype, "groupRate", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], User.prototype, "singlesRate", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], User.prototype, "capacity", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], User.prototype, "masksRequired", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], User.prototype, "queueSize", void 0);
__decorate([
    core_1.Enum(),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    core_1.Property({ nullable: true, lazy: true }),
    __metadata("design:type", String)
], User.prototype, "pushToken", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "photoUrl", void 0);
__decorate([
    core_1.Property({ persist: false }),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], User.prototype, "name", null);
__decorate([
    core_1.OneToMany(() => QueueEntry_1.QueueEntry, q => q.beeper, { lazy: true, eager: false }),
    __metadata("design:type", Object)
], User.prototype, "queue", void 0);
User = __decorate([
    core_1.Entity()
], User);
exports.User = User;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
