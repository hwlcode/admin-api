import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

let ArticleTagsSchema = new Schema({
    name: {type: String, default: null, display: '文章标签'},
    desc: {type: String, default: null, display: '标签描述'},
    status: {type: Boolean, default: null, display: '是否启用'}
}, {
    timestamps: true
});

export const ArticleTagsModel = mongoose.model('ArticleTags', ArticleTagsSchema);
