"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleTagsSchema = new Schema({
    name: { type: String },
    desc: { type: String },
    status: { type: Boolean }
}, {
    timestamps: true
});
exports.ArticleTagsModel = mongoose.model('ArticleTags', ArticleTagsSchema);
