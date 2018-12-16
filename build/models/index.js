"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var user_1 = require("./schema/user");
exports.UserModel = user_1.UserModel;
var upload_1 = require("./schema/upload");
exports.UploadModel = upload_1.UploadModel;
var db = '';
if (process.env.NODE_ENV === 'production') {
    db = 'mongodb://127.0.0.1:27027/chadao';
}
else {
    db = 'mongodb://127.0.0.1:27017/chadao';
}
mongoose.Promise = global.Promise;
mongoose.connect(db, { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log('connect to %s error: ', db, err.message);
        process.exit(1);
    }
});
