"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./user");
var upload_1 = require("./upload");
function default_1(app) {
    user_1.default(app);
    upload_1.default(app);
}
exports.default = default_1;
