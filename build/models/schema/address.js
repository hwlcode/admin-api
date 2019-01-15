"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AddressSchema = new Schema({
    userId: { type: String, default: null, display: '微信用户ID' },
    user: { type: String, default: null, display: '收件人' },
    phone: { type: String, default: null, display: '手机号码' },
    region: { type: Array, default: [], display: '省市区' },
    address: { type: String, default: null, display: '详细地址' },
    isDefault: { type: Boolean, default: false, display: '是否为默认地址' }
}, {
    timestamps: true
});
exports.AddressModel = mongoose.model('Address', AddressSchema);
