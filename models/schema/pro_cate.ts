import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

let ProductCateSchema = new Schema({
    name: {type: String, default: null, display: '产品分类'},
    desc: {type: String, default: null, display: '类目描述'},
    status: {type: Boolean, default: null, display: '是否启用'}
}, {
    timestamps: true
});

export const ProductCateModel = mongoose.model('ProductCate', ProductCateSchema);
