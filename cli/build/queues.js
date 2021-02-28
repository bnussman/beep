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
const r = __importStar(require("rethinkdb"));
const db_1 = __importDefault(require("./utils/db"));
const notifications_1 = require("./utils/notifications");
class Queues {
    clear(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cursor = yield r.table(id).run((yield db_1.default.getConnQueues()));
            cursor.each((error, queueEntry) => __awaiter(this, void 0, void 0, function* () {
                if (error)
                    console.error(error);
                //set each user's inQueueOfUserID to null so they are no longer in a beep
                yield r.table('users').get(queueEntry.riderid).update({ inQueueOfUserID: null }).run((yield db_1.default.getConn()));
                notifications_1.sendNotification(queueEntry.riderid, "You have been removed from a queue", "You have been removed from your beepers queue beacause they were inactive");
            }));
            //Clear beeper's table
            yield r.table(id).delete().run((yield db_1.default.getConnQueues()));
            //Set beeper's queue size to zero
            yield r.table('users').get(id).update({ queueSize: 0, isBeeping: false }).run((yield db_1.default.getConn()));
        });
    }
}
exports.default = Queues;
