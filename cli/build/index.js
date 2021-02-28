"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const location_1 = __importDefault(require("./location"));
const queues_1 = __importDefault(require("./queues"));
const db_1 = __importDefault(require("./utils/db"));
const input = process.argv.slice(2);
function main() {
    if (input[0] == "location") {
        if (input[1] == "migrate") {
            const l = new location_1.default();
            l.migrate();
        }
    }
    if (input[0] == "queue") {
        if (input[1] == "clear") {
            const q = new queues_1.default();
            q.clear(input[2]);
        }
    }
}
db_1.default.connect(() => {
    main();
});
