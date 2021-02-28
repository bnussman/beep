"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const server = new app_1.default();
const app = server.getApp();
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Beep API listening at http://0.0.0.0:${port}`);
});
