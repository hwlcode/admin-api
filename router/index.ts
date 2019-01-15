import user from './user';
import upload from './upload';
import articles from './articles';
import product from './product';
import minApp from './min_app';
import minAppAdmin  from './min_app_admin';

export default function (app) {
    user(app);
    upload(app);
    articles(app);
    product(app);
    minApp(app);
    minAppAdmin(app);
}
