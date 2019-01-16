import {UserModel} from '../models';
import {Md5} from "ts-md5";
import {Jwt} from '../lib/jwt';

const ObjectId = require('mongodb').ObjectID;

export default function (app) {
    // 用户登录
    app.post('/api/admin/user/login', async (req, res) => {
        let body = req.body;

        await UserModel.findOne({
            phone: body.userName
        }).then(async data => {
            if (data === null) {
                res.send({status: 404, msg: '账号不存在'});
            } else {
                if (body.password == data['password']) {
                    let _id = data['_id'];
                    let jwt = new Jwt(_id);
                    let token = jwt.generateToken();
                    await UserModel.findOneAndUpdate({_id: _id}, { token: token});
                    res.json({status: 200, msg: '登陆成功', token: token});
                } else {
                    res.json({status: 404, msg: '账号密码错误'});
                }
            }
        });
    });
    // 获取用户基本信息
    app.get('/api/admin/user/user-profile', async (req, res) => {
        let token = req.headers.token;
        let jwt = new Jwt(token);
        let result = jwt.verifyToken();
        let id = new ObjectId(result);
        if (result != 'err') {
            let user = await UserModel.findOne({_id: id}).exec();
            res.json({
                status: 200,
                msg: '数据获取成功',
                data: user
            })
        }
    });
    // 保存用户
    app.post('/api/admin/user/save-user', async (req, res) => {
        let body = req.body;

        let user = await UserModel.findOne({
            phone: body.phone
        }).exec();

        if (user === null) {
            body.password = Md5.hashStr('123456').toString();
            await UserModel.create(body);
        } else {
            await UserModel.updateOne({
                phone: body.phone
            }, body).exec();
        }

        res.json({
            status: 200,
            msg: 'success'
        })
    });
    // 修改密码
    app.post('/api/admin/user/password', async (req, res) => {
        let body = req.body;
        let token = req.headers.token;
        let jwt = new Jwt(token);
        let result = jwt.verifyToken();
        let id = new ObjectId(result);

        let user = await UserModel.findOne({
            _id: id
        }).exec();

        if (body.oldPassword != user['password']) {
            res.json({
                status: 1000,
                msg: '原始密码输入不正确'
            });
        } else {
            await UserModel.updateOne({
                _id: id
            }, {
                password: body.password
            });

            res.json({
                status: 200,
                msg: '密码修改成功'
            });
        }
    });
}
