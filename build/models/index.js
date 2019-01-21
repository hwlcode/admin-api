"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var config_1 = require("../lib/config");
//修复报错 https://mongoosejs.com/docs/deprecations.html
mongoose.set('useFindAndModify', false);
var user_1 = require("./schema/user");
exports.UserModel = user_1.UserModel;
var upload_1 = require("./schema/upload");
exports.UploadModel = upload_1.UploadModel;
var article_cate_1 = require("./schema/article_cate");
exports.ArticleCateModel = article_cate_1.ArticleCateModel;
var article_tags_1 = require("./schema/article_tags");
exports.ArticleTagsModel = article_tags_1.ArticleTagsModel;
var articles_1 = require("./schema/articles");
exports.ArticlesModel = articles_1.ArticlesModel;
var pro_cate_1 = require("./schema/pro_cate");
exports.ProductCateModel = pro_cate_1.ProductCateModel;
var product_1 = require("./schema/product");
exports.ProudctsModel = product_1.ProudctsModel;
var min_app_login_status_1 = require("./schema/min_app_login_status");
exports.MinAppLoginStatusModel = min_app_login_status_1.MinAppLoginStatusModel;
var address_1 = require("./schema/address");
exports.AddressModel = address_1.AddressModel;
var orders_1 = require("./schema/orders");
exports.OrdersModel = orders_1.OrdersModel;
var activies_1 = require("./schema/activies");
exports.ActivityModel = activies_1.ActivityModel;
var db = '';
if (process.env.NODE_ENV === 'production') {
    db = 'mongodb://' + config_1.default.mongodb.USERNAME + ':' + config_1.default.mongodb.PASSWORD + '@ip:' + config_1.default.mongodb.IP + ':' + config_1.default.mongodb.SERVERPORT + '/' + config_1.default.mongodb.DATABASE;
}
else {
    db = config_1.default.mongodb.DBURL + ':' + config_1.default.mongodb.PORT + '/' + config_1.default.mongodb.DATABASE;
}
mongoose.Promise = global.Promise;
mongoose.connect(db, { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log('connect to %s error: ', db, err.message);
        process.exit(1);
    }
});
