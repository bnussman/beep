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
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.APIAuthResponse = exports.APIResponse = exports.APIStatus = void 0;
const tsoa_1 = require("tsoa");
const Sentry = __importStar(require("@sentry/node"));
var APIStatus;
(function (APIStatus) {
    APIStatus["Success"] = "success";
    APIStatus["Warning"] = "warning";
    APIStatus["Error"] = "error";
})(APIStatus = exports.APIStatus || (exports.APIStatus = {}));
class APIResponse {
    constructor(status, message) {
        this.status = status;
        this.message = message;
    }
}
exports.APIResponse = APIResponse;
class APIAuthResponse extends APIResponse {
    constructor(status, message) {
        super(status, message);
    }
}
exports.APIAuthResponse = APIAuthResponse;
function errorHandler(error, request, response, next) {
    if (error instanceof tsoa_1.ValidateError) {
        /*
        return response.status(422).json({
            status: "error",
            message: "You did not provide the correct paramaters to use this api endpoint",
        });
        */
        return response.status(422).json({
            status: "error",
            message: "You did not provide the correct paramaters to use this api endpoint",
            details: error === null || error === void 0 ? void 0 : error.fields,
        });
    }
    if (error instanceof APIAuthResponse) {
        return response.status(401).json(error);
    }
    if (error instanceof Error) {
        console.error(error);
        return response.status(500).json(new APIResponse(APIStatus.Error, error.message));
    }
    Sentry.captureException(error);
    next();
}
exports.errorHandler = errorHandler;
