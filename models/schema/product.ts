import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

let ProductsSchema = new Schema({
    title: {type: String, default: null, display: '商品标题'},
    cate: {type: Schema.Types.ObjectId, default: null, ref: 'ProductCate', display: '商品标题'},
    banner: {type: String, default: null, display: '商品图片'},
    original_price: {type: String, default: null, display: '原价'},
    promotion_price: {type: String, default: null, display: '促销价'},
    unit: {type: String, default: null, display: '单位'},
    content: {type: String, default: null, display: '商品描述'}
}, {
    timestamps: true
});

export const ProudctsModel = mongoose.model('Products', ProductsSchema);
