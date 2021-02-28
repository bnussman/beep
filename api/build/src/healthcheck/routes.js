"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = require("../utils/Error");
function default_1(request, response) {
    response.send(new Error_1.APIResponse(Error_1.APIStatus.Success, "Ok"));
}
exports.default = default_1;
