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
exports.Report = void 0;
const core_1 = require("@mikro-orm/core");
const mongodb_1 = require("@mikro-orm/mongodb");
const type_graphql_1 = require("type-graphql");
const Beep_1 = require("./Beep");
const User_1 = require("./User");
let Report = class Report {
    constructor(reporter, reported, reason, beep) {
        this.timestamp = Date.now();
        this.handled = false;
        this.reporter = reporter;
        this.reported = reported;
        this.reason = reason;
        if (beep) {
            this.beep = new mongodb_1.ObjectId(beep);
        }
    }
};
__decorate([
    core_1.PrimaryKey(),
    __metadata("design:type", mongodb_1.ObjectId)
], Report.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.SerializedPrimaryKey(),
    __metadata("design:type", String)
], Report.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.ManyToOne(),
    __metadata("design:type", User_1.User)
], Report.prototype, "reporter", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.ManyToOne(),
    __metadata("design:type", User_1.User)
], Report.prototype, "reported", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    core_1.ManyToOne(() => User_1.User, { nullable: true }),
    __metadata("design:type", Object)
], Report.prototype, "handledBy", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.Property(),
    __metadata("design:type", String)
], Report.prototype, "reason", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "notes", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.Property(),
    __metadata("design:type", Number)
], Report.prototype, "timestamp", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.Property({ default: false }),
    __metadata("design:type", Boolean)
], Report.prototype, "handled", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    core_1.ManyToOne({ nullable: true }),
    __metadata("design:type", Beep_1.Beep)
], Report.prototype, "beep", void 0);
Report = __decorate([
    type_graphql_1.ObjectType(),
    core_1.Entity(),
    __metadata("design:paramtypes", [User_1.User, User_1.User, String, String])
], Report);
exports.Report = Report;
