"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UploadSchema = new Schema({
    originalName: { type: String },
    mimeType: { type: String },
    path: { type: String },
    size: { type: String }
}, {
    timestamps: true
});
exports.UploadModel = mongoose.model('Uploads', UploadSchema);
