import * as mongoose from 'mongoose';
import {UserModel} from './schema/user';
import {UploadModel} from './schema/upload';
import {ArticleCateModel} from './schema/article_cate';
import {ArticleTagsModel} from './schema/article_tags';
import {ArticlesModel} from './schema/articles';
import {ProductCateModel} from "./schema/pro_cate";
import {ProudctsModel} from './schema/product';
import {MinAppLoginStatusModel} from './schema/min_app_login_status';
import {AddressModel} from './schema/address';
import {OrdersModel} from './schema/orders';

let db = '';
if (process.env.NODE_ENV === 'production') {
    db = 'mongodb://127.0.0.1:27027/chadao';
} else {
    db = 'mongodb://127.0.0.1:27017/chadao';
}

(mongoose as any).Promise = global.Promise;
mongoose.connect(db, {useNewUrlParser: true}, err => {
    if (err) {
        console.log('connect to %s error: ', db, err.message);
        process.exit(1);
    }
});

export {
    UserModel, UploadModel, ArticleCateModel, ArticleTagsModel, ArticlesModel,
    ProductCateModel, ProudctsModel, MinAppLoginStatusModel,AddressModel,OrdersModel
}

