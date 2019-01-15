"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var MinAppLoginStatusSchema = new Schema({
    openid: { type: String, default: null, display: '小程序用户唯一标识' },
    session_key: { type: String, default: null, display: '小程序会话密钥' },
    userInfo: { type: Object, default: {}, display: '用户信息' },
    access_token: { type: String, default: null, display: 'api密钥' },
}, {
    timestamps: true
});
exports.MinAppLoginStatusModel = mongoose.model('MinAppUser', MinAppLoginStatusSchema);
