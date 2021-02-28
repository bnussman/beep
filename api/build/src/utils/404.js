"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNotFound = void 0;
const Error_1 = require("./Error");
/*
 *  happy birthday jesus
 */
function handleNotFound(req, res, next) {
    res.status(404).send(new Error_1.APIResponse(Error_1.APIStatus.Error, "Not found"));
}
exports.handleNotFound = handleNotFound;
