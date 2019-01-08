import user from './user';
import upload from './upload';
import articles from './articles';
import product from './product';

export default function (app) {
    user(app);
    upload(app);
    articles(app);
    product(app);
}
