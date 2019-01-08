import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

let ArticleCateSchema = new Schema({
    name: {type: String, default: null, display: '文章类目'},
    desc: {type: String, default: null, display: '类目描述'},
    status: {type: Boolean, default: null, display: '是否启用'}
}, {
    timestamps: true
});

export const ArticleCateModel = mongoose.model('ArticleCate', ArticleCateSchema);
