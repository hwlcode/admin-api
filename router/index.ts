import user from './user';
import upload from './upload';
import articles from './articles';

export default function (app) {
    user(app);
    upload(app);
    articles(app);
}
