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
Object.defineProperty(exports, "__esModule", { value: true });
const r = __importStar(require("rethinkdb"));
class Database {
    constructor() {
        this.host = "192.168.1.116";
        this.port = 28015;
        this.conn = null;
        this.connQueues = null;
        this.connLocations = null;
    }
    connect(run) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Connecting to database...");
                this.conn = yield r.connect(this.getConnectionOptions("beep"));
                this.connQueues = yield r.connect(this.getConnectionOptions("beepQueues"));
                this.connLocations = yield r.connect(this.getConnectionOptions("beepLocations"));
                if (run)
                    run();
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    close() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.conn) === null || _a === void 0 ? void 0 : _a.close());
            yield ((_b = this.connQueues) === null || _b === void 0 ? void 0 : _b.close());
            yield ((_c = this.connLocations) === null || _c === void 0 ? void 0 : _c.close());
        });
    }
    getConnectionOptions(databaseName) {
        return {
            host: this.host,
            port: this.port,
            db: databaseName
        };
    }
    getConn() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.conn == null) {
                this.conn = yield r.connect(this.getConnectionOptions("beep"));
            }
            if (!this.conn.open) {
                this.conn = yield r.connect(this.getConnectionOptions("beep"));
            }
            if (this.conn == null || !this.conn.open) {
                throw new Error("Unable to establish connection to RethinkDB");
            }
            return this.conn;
        });
    }
    getConnQueues() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connQueues == null) {
                this.connQueues = yield r.connect(this.getConnectionOptions("beepQueues"));
            }
            if (!this.connQueues.open) {
                this.connQueues = yield r.connect(this.getConnectionOptions("beepQueues"));
            }
            if (this.connQueues == null || !this.connQueues.open) {
                throw new Error("Unable to establish connection to RethinkDB");
            }
            return this.connQueues;
        });
    }
    getConnLocations() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connLocations == null) {
                this.connLocations = yield r.connect(this.getConnectionOptions("beepLocations"));
            }
            if (!this.connLocations.open) {
                this.connLocations = yield r.connect(this.getConnectionOptions("beepLocations"));
            }
            if (this.connLocations == null || !this.connLocations.open) {
                throw new Error("Unable to establish connection to RethinkDB");
            }
            return this.connLocations;
        });
    }
}
const database = new Database();
exports.default = database;
