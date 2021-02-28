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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectionsResolver = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const type_graphql_1 = require("type-graphql");
let DirectionsResolver = class DirectionsResolver {
    async getETA(start, end) {
        const result = await node_fetch_1.default('https://maps.googleapis.com/maps/api/directions/json?origin=' + start + '&destination=' + end + '&key=AIzaSyBgabJrpu7-ELWiUIKJlpBz2mL6GYjwCVI');
        const data = await result.json();
        return data.routes[0].legs[0].duration.text;
    }
};
__decorate([
    type_graphql_1.Query(() => String),
    __param(0, type_graphql_1.Arg('start')), __param(1, type_graphql_1.Arg('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DirectionsResolver.prototype, "getETA", null);
DirectionsResolver = __decorate([
    type_graphql_1.Resolver()
], DirectionsResolver);
exports.DirectionsResolver = DirectionsResolver;
