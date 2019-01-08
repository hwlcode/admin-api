"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleCateSchema = new Schema({
    name: { type: String, default: null, display: '文章类目' },
    desc: { type: String, default: null, display: '类目描述' },
    status: { type: Boolean, default: null, display: '是否启用' }
}, {
    timestamps: true
});
exports.ArticleCateModel = mongoose.model('ArticleCate', ArticleCateSchema);
