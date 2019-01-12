import {MinAppLoginStatusModel, ProductCateModel, ProudctsModel} from '../models';
import {Jwt} from '../lib/jwt';
var request = require('request');
const ObjectId = require('mongodb').ObjectID;

export default function (app) {
    // 小程序登录状态
    app.post('/api/min/onLogin', async (req, res) => {
        let code = req.body.code;
        let userInfo = req.body.userInfo;
        let appId = 'wx5cd1cb352be7d983';
        let secret = 'a00b8c0497396974c53699a506e42d15';

        request.get('https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',async function (err, resp, body) {
            if (resp && resp.statusCode == 200) {
                let _id = body.openid;
                let jwt = new Jwt(_id);
                let token = jwt.generateToken();
                body = JSON.parse(body);

                let user = await MinAppLoginStatusModel.findOne({openid: body.openid}).exec();

                if(user == null){
                    await MinAppLoginStatusModel.create({
                        openid: body.openid,
                        session_key: body.session_key,
                        token: token,
                        userInfo: userInfo
                    });
                }else{
                    await MinAppLoginStatusModel.findOneAndUpdate({openid: body.openid}, {
                        token: token,
                        userInfo: userInfo
                    });
                }

                res.json({
                    status: 200,
                    msg: 'success',
                    data: token
                });
            }
        });
    });
    // 产品类目
    app.get('/api/min/products/cate-list', async (req, res) => {
        let status = req.query.status;
        let productsCates;

        if (status != undefined) {
            productsCates = await ProductCateModel.find({
                status: status
            }).exec();
        }
        else {
            productsCates = await ProductCateModel.find().exec();
        }

        res.json({
            status: 200,
            data: productsCates
        });
    });
    // 搜索产品
    app.get('/api/min/products/list', async (req, res) => {
        let page = req.query.page || 1;
        let keywords = req.query.keywords || '';
        let cates = req.query.cates;
        let limit = 12; // 每页查询的数据
        let skip = (page - 1) * limit;

        let products = [];
        let countProduct = [];

        if (cates) {
            let cateArr = cates.split(',');
            // 转化为objectId形式
            let ObjectIdCateArrt = [];
            cateArr.map(cate => {
                ObjectIdCateArrt.push(new ObjectId(cate));
            });

            products = await ProudctsModel.find({
                title: new RegExp(keywords, 'gi'),
                cate: {$in: ObjectIdCateArrt}
            }).skip(skip).limit(limit).sort({createdAt: -1}).exec();

            countProduct = await ProudctsModel.find({
                title: new RegExp(keywords, 'gi'),
                cate: {$in: ObjectIdCateArrt}
            }).exec();
        } else {
            products = await ProudctsModel.find({
                title: new RegExp(keywords, 'gi')
            }).skip(skip).limit(limit).sort({createdAt: -1}).exec();
            countProduct = await ProudctsModel.find({
                title: new RegExp(keywords, 'gi')
            }).exec();
        }

        res.json({
            status: 200,
            msg: '成功',
            data: products,
            total: countProduct.length
        })
    });
    // 获取产品
    app.get('/api/min/products/get', async (req, res) => {
        let id = new ObjectId(req.query.id);
        let product = await ProudctsModel.findOne({
            _id: id
        }).exec();

        res.json({
            status: 200,
            msg: 'success',
            data: product
        })
    });
}
