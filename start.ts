import * as express from 'express';
import * as path from 'path'
import * as bodyParser from 'body-parser'
import {Jwt} from './lib/jwt';
import router from './router';

const app = express();

//middleware
app.use('/', express.static(path.join(__dirname, '..', 'public'))); //静态资源存放目录
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//router
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
// 验证token的合法性
app.use(function (req, res, next) {
    // 这里把登陆和注册请求去掉了，其他所有的api请求都需要进行token校验
    if (req.url != '/api/user/login' && req.url != '/api/user/register' && req.url != '/api/file/upload') {
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
    app.listen(8000, 'localhost', () => {
        console.log('app is running at pro http://localhost:8000');
    });
}else{
    app.listen(9527, 'localhost', () => {
        console.log('app is running at dev http://localhost:9527');
    });
}
