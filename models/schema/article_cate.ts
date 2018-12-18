import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

let ArticleCateSchema = new Schema({
    name: {type: String},
    desc: {type: String},
    status: {type: Boolean}
}, {
    timestamps: true
});

export const ArticleCateModel = mongoose.model('ArticleCate', ArticleCateSchema);
