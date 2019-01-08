import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

let ArticlesSchema = new Schema({
    title: {type: String, default: null, display: '标题'},
    banner: {type: String, default: null, display: '主图'},
    showBanner: {type: Boolean, default: false, display: '是否显示'},
    content: {type: String, default: null, display: '内容'},
    cate: {type: Schema.Types.ObjectId, default: null, ref: 'ArticleCate', display: '文章类目'},
    tags: [{type: Schema.Types.ObjectId, default: null, ref: 'ArticleTags', display: '文章标签'}],
    user: {type: Schema.Types.ObjectId, default: null, ref: 'User', display: '作者'},
    collections: [{type: Schema.Types.ObjectId, default: null, ref: 'User', display: '收藏'}],
    likes: [{type: Schema.Types.ObjectId, default: null, ref: 'User', display: '点赞'}],
    comments: [{type: Schema.Types.ObjectId, default: null, ref: 'User', display: '评论'}]
}, {
    timestamps: true
});

export const ArticlesModel = mongoose.model('Articles', ArticlesSchema);
