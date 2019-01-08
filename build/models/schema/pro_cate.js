"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ProductCateSchema = new Schema({
    name: { type: String, default: null, display: '产品分类' },
    desc: { type: String, default: null, display: '类目描述' },
    status: { type: Boolean, default: null, display: '是否启用' }
}, {
    timestamps: true
});
exports.ProductCateModel = mongoose.model('ProductCate', ProductCateSchema);
