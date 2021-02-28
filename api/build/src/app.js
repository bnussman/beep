"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.BeepORM = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./healthcheck/routes"));
const routes_2 = require("../build/routes");
const Error_1 = require("./utils/Error");
const _404_1 = require("./utils/404");
const Sentry = __importStar(require("@sentry/node"));
const sentry_1 = require("./utils/sentry");
const cors_1 = __importDefault(require("cors"));
const core_1 = require("@mikro-orm/core");
const TokenEntry_1 = require("./entities/TokenEntry");
const User_1 = require("./entities/User");
const VerifyEmail_1 = require("./entities/VerifyEmail");
const QueueEntry_1 = require("./entities/QueueEntry");
const Beep_1 = require("./entities/Beep");
const ForgotPassword_1 = require("./entities/ForgotPassword");
const Report_1 = require("./entities/Report");
const Location_1 = require("./entities/Location");
const url = `mongodb+srv://banks:${process.env.MONGODB_PASSWORD}@beep.5zzlx.mongodb.net/test?retryWrites=true&w=majority`;
exports.BeepORM = {};
class BeepAPIServer {
    constructor() {
        this.app = express_1.default();
        this.server = null;
        this.setup();
    }
    getApp() {
        return this.app;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const port = process.env.PORT || 3001;
            this.server = this.app.listen(port, () => {
                console.log(`Beep API listening at http://0.0.0.0:${port}`);
            });
        });
    }
    close() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.server) === null || _a === void 0 ? void 0 : _a.close();
        });
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            exports.BeepORM.orm = yield core_1.MikroORM.init({
                entities: ['./build/src/entities/*.js'],
                entitiesTs: ['./src/entities/*.ts'],
                dbName: 'beep',
                type: 'mongo',
                clientUrl: url,
                debug: true
            });
            exports.BeepORM.em = exports.BeepORM.orm.em;
            exports.BeepORM.userRepository = exports.BeepORM.orm.em.getRepository(User_1.User);
            exports.BeepORM.tokenRepository = exports.BeepORM.orm.em.getRepository(TokenEntry_1.TokenEntry);
            exports.BeepORM.verifyEmailRepository = exports.BeepORM.orm.em.getRepository(VerifyEmail_1.VerifyEmail);
            exports.BeepORM.queueEntryRepository = exports.BeepORM.orm.em.getRepository(QueueEntry_1.QueueEntry);
            exports.BeepORM.beepRepository = exports.BeepORM.orm.em.getRepository(Beep_1.Beep);
            exports.BeepORM.forgotPasswordRepository = exports.BeepORM.orm.em.getRepository(ForgotPassword_1.ForgotPassword);
            exports.BeepORM.reportRepository = exports.BeepORM.orm.em.getRepository(Report_1.Report);
            exports.BeepORM.locationRepository = exports.BeepORM.orm.em.getRepository(Location_1.Location);
            this.app.use(cors_1.default());
            this.app.use(express_1.default.json());
            this.app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
            this.app.disable('x-powered-by');
            this.app.use("/healthcheck", routes_1.default);
            this.app.use("/.well-known/acme-challenge/:id", routes_1.default);
            sentry_1.initializeSentry(this.app);
            this.app.use(Sentry.Handlers.requestHandler({
                user: ["id"]
            }));
            this.app.use(Sentry.Handlers.tracingHandler());
            routes_2.RegisterRoutes(this.app);
            this.app.use(Sentry.Handlers.errorHandler());
            this.app.use(_404_1.handleNotFound);
            this.app.use(Error_1.errorHandler);
        });
    }
}
exports.default = BeepAPIServer;
