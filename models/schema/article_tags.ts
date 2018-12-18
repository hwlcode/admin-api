import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

let ArticleTagsSchema = new Schema({
    name: {type: String},
    desc: {type: String},
    status: {type: Boolean}
}, {
    timestamps: true
});

export const ArticleTagsModel = mongoose.model('ArticleTags', ArticleTagsSchema);
