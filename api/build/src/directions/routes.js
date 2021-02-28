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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectionsController = void 0;
const tsoa_1 = require("tsoa");
const Error_1 = require("../utils/Error");
const node_fetch_1 = __importDefault(require("node-fetch"));
let DirectionsController = class DirectionsController extends tsoa_1.Controller {
    getDirections(start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield node_fetch_1.default('https://maps.googleapis.com/maps/api/directions/json?origin=' + start + '&destination=' + end + '&key=AIzaSyBgabJrpu7-ELWiUIKJlpBz2mL6GYjwCVI');
                const data = yield result.json();
                return {
                    status: Error_1.APIStatus.Success,
                    eta: data.routes[0].legs[0].duration.text
                };
            }
            catch (error) {
                return {
                    status: Error_1.APIStatus.Error,
                    message: error
                };
            }
        });
    }
};
__decorate([
    tsoa_1.Security("token"),
    tsoa_1.Get("{start}/{end}"),
    __param(0, tsoa_1.Path()), __param(1, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DirectionsController.prototype, "getDirections", null);
DirectionsController = __decorate([
    tsoa_1.Tags("Directions"),
    tsoa_1.Route("directions")
], DirectionsController);
exports.DirectionsController = DirectionsController;
