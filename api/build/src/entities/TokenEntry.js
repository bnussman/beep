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
exports.TokenEntry = void 0;
const core_1 = require("@mikro-orm/core");
const mongodb_1 = require("@mikro-orm/mongodb");
const User_1 = require("./User");
let TokenEntry = class TokenEntry {
    constructor(u) {
        this.tokenid = new mongodb_1.ObjectId();
        this.user = u;
    }
};
__decorate([
    core_1.PrimaryKey(),
    __metadata("design:type", mongodb_1.ObjectId)
], TokenEntry.prototype, "_id", void 0);
__decorate([
    core_1.SerializedPrimaryKey(),
    __metadata("design:type", String)
], TokenEntry.prototype, "id", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], TokenEntry.prototype, "tokenid", void 0);
__decorate([
    core_1.ManyToOne(),
    __metadata("design:type", User_1.User)
], TokenEntry.prototype, "user", void 0);
TokenEntry = __decorate([
    core_1.Entity(),
    __metadata("design:paramtypes", [User_1.User])
], TokenEntry);
exports.TokenEntry = TokenEntry;
