"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleTagsSchema = new Schema({
    name: { type: String, default: null, display: '文章标签' },
    desc: { type: String, default: null, display: '标签描述' },
    status: { type: Boolean, default: null, display: '是否启用' }
}, {
    timestamps: true
});
exports.ArticleTagsModel = mongoose.model('ArticleTags', ArticleTagsSchema);
