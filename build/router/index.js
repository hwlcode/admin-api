"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./user");
var upload_1 = require("./upload");
var articles_1 = require("./articles");
var product_1 = require("./product");
var min_app_1 = require("./min_app");
var min_app_admin_1 = require("./min_app_admin");
function default_1(app) {
    user_1.default(app);
    upload_1.default(app);
    articles_1.default(app);
    product_1.default(app);
    min_app_1.default(app);
    min_app_admin_1.default(app);
}
exports.default = default_1;
