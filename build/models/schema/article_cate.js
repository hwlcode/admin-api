"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleCateSchema = new Schema({
    name: { type: String },
    desc: { type: String },
    status: { type: Boolean }
}, {
    timestamps: true
});
exports.ArticleCateModel = mongoose.model('ArticleCate', ArticleCateSchema);
