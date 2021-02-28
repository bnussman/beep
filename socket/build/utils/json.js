"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeJSONSuccess = exports.makeJSONError = void 0;
/**
 * @param message the error message you wish to include in the API's responce
 * @return JSON error message
 */
function makeJSONError(message) {
    return ({ status: "error", message: message });
}
exports.makeJSONError = makeJSONError;
/**
 * @param message the success message you wish to include in the API's responce
 * @return JSON success message
 */
function makeJSONSuccess(message) {
    return ({ status: "success", message: message });
}
exports.makeJSONSuccess = makeJSONSuccess;
