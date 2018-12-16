import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

let UploadSchema = new Schema({
    originalName: {type: String},
    mimeType: {type: String},
    path: {type: String},
    size: {type: String}
}, {
    timestamps: true
});

export const UploadModel = mongoose.model('Uploads', UploadSchema);
