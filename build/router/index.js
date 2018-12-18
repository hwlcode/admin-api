"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./user");
var upload_1 = require("./upload");
var articles_1 = require("./articles");
function default_1(app) {
    user_1.default(app);
    upload_1.default(app);
    articles_1.default(app);
}
exports.default = default_1;
