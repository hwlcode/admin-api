import user from './user';
import upload from './upload';

export default function (app) {
    user(app);
    upload(app);
}
