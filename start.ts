import * as express from 'express';
import * as path from 'path'
import * as bodyParser from 'body-parser'
import router from './router';
import {Jwt} from './lib/jwt';
import {MinAppLoginStatusModel} from './models';

const app = express();

//middleware
app.use('/', express.static(path.join(__dirname, '..', 'public'))); //静态资源存放目录
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//router
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
// 小程序路由中间件/api/min/开头的都从这里验证一次
app.use('/api/min/', async (req, res, next) => {
    let regExp = !new RegExp('/onLogin', 'gi').test(req.url)
        && !new RegExp('/products/cate-list', 'gi').test(req.url)
        && !new RegExp('/products/list', 'gi').test(req.url)
        && !new RegExp('/products/get', 'gi').test(req.url)
        && !new RegExp('/activities/list', 'gi').test(req.url)
        && !new RegExp('/activities/get', 'gi').test(req.url);
    if (regExp) {
        // 除登录外
        let appUser = await MinAppLoginStatusModel.findOne({
            openid: req.headers.token
        }).exec();

        if (appUser == null) {
            res.json({status: 403, msg: '用户不存在或登录已过期,请重新登录'});
        } else {
            next();
        }
    } else {
        next();
    }
});

// 后台的中间件/api/admin 开头的都从这里验证一下
app.use('/api/admin/', async function (req, res, next) {
    // 这里把登陆和注册请求去掉了，其他所有的api请求都需要进行token校验
    let regx = !new RegExp('/user/login', 'gi').test(req.url)
        && !new RegExp('/user/register', 'gi').test(req.url);
        // && !new RegExp('/file/upload', 'gi').test(req.url);
    if (regx) {
        let token = req.headers.token;
        let jwt = new Jwt(token);
        let result = jwt.verifyToken();
        // 如果验证通过就next，否则就返回登陆信息不正确
        if (result == 'err') {
            res.json({status: 403, msg: '登录已过期,请重新登录'});
        } else {
            next();
        }
    } else {
        next();
    }
});
router(app);

if (process.env.NODE_ENV === 'production') {
    app.listen(8000, () => {
        console.log('http is running at pro http://localhost:8000');
    });
} else {
    app.listen(9527, () => {
        console.log('app is running at pro http://localhost:9527');
    });
}
