import {
    MinAppLoginStatusModel,
    ProductCateModel,
    ProudctsModel,
    AddressModel,
    OrdersModel,
    ActivityModel
} from '../models';
import {WxPay} from '../lib/wechat_pay';
import config from '../lib/config';
import * as moment from 'moment';

var request = require('request-promise');
const ObjectId = require('mongodb').ObjectID;
let wxPay = new WxPay();

export default function (app) {
    // 小程序登录状态
    app.post('/api/min/onLogin', async (req, res) => {
        let code = req.body.code;
        let userInfo = req.body.userInfo;
        let appId = config.wechat.APPID;
        let secret = config.wechat.SECRET;
        request.get('https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code')
            .then(json => {
                let body = JSON.parse(json);
                return body;
            }).then(body => {
            let openid = body.openid;
            let session_key = body.session_key;
            // 获取access_token
            request.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appId + '&secret=' + secret)
                .then(async resp => {
                    let user = await MinAppLoginStatusModel.findOne({openid: body.openid}).exec();
                    if (user == null) {
                        await MinAppLoginStatusModel.create({
                            openid: openid,
                            session_key: session_key,
                            userInfo: userInfo,
                            access_token: JSON.parse(resp).access_token
                        });
                    } else {
                        await MinAppLoginStatusModel.findOneAndUpdate({openid: body.openid}, {
                            userInfo: userInfo,
                            session_key: session_key,
                            access_token: JSON.parse(resp).access_token
                        });
                    }

                    res.json({
                        status: 200,
                        msg: 'success',
                        data: body.openid
                    });
                });
        });
    });
    // 获取accessToken
    app.get('/api/min/get-access-token', async(req, res) => {
        let openid = req.query.openid;
        let user = await MinAppLoginStatusModel.findOne({openid: openid}).exec();
        res.json({
            status: 200,
            msg: 'msg',
            data: user['access_token']
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

    // 保存收货地址
    app.post('/api/min/user/save-address', async (req, res) => {
        let body = req.body;

        let id = req.headers.token;
        body.userId = id;

        let address = await AddressModel.findOne({
            userId: id
        }).exec();

        if (address == null) {
            body.isDefault = true
        } else {
            body.isDefault = false
        }

        if (body.id != undefined) {
            await AddressModel.findOneAndUpdate({
                _id: new ObjectId(body.id)
            }, {
                user: body.user,
                phone: body.phone,
                region: body.region,
                address: body.address
            });
        } else {
            await AddressModel.create(body);
        }

        res.json({
            status: 200,
            msg: 'success'
        })
    });
    // 获取用户的收货地址
    app.get('/api/min/user/get-address', async (req, res) => {
        let id = req.headers.token;

        let addresses = await AddressModel.find({
            userId: id
        }).sort({
            // isDefault: -1
        }).exec();

        res.json({
            status: 200,
            msg: 'success',
            data: addresses
        })
    });
    // 修改默认收货地址
    app.get('/api/min/user/set-default-address', async (req, res) => {
        let id = req.query.id; // address _id
        let userId = req.headers.token;
        // 把用户的把有收货地址先设为false
        await AddressModel.updateMany({
            userId: userId
        }, {
            isDefault: false
        });
        // 再更新当前传进来的收货地址设为true
        await AddressModel.findOneAndUpdate({_id: id}, {
            isDefault: true
        });

        res.json({
            status: 200,
            msg: 'success'
        })
    });
    // 获取收货地址信息
    app.get('/api/min/user/get-address-by-id', async (req, res) => {
        let id = new ObjectId(req.query.id);
        let address = await AddressModel.findOne({_id: id}).exec();
        res.json({
            status: 200,
            msg: 'success',
            data: address
        });
    });
    // 获取用户默认收货地址
    app.get('/api/min/user/get-address-by-default', async (req, res) => {
        let id = req.headers.token;

        let address = await AddressModel.findOne({
            userId: id,
            isDefault: true
        }).exec();

        res.json({
            status: 200,
            msg: 'success',
            data: address
        });
    });
    // 删除收货地址
    app.get('/api/min/user/del-address', async (req, res) => {
        let id = new ObjectId(req.query.id);
        await AddressModel.findOneAndDelete(id);
        res.json({
            status: 200,
            msg: 'success'
        });
    });

    // 创建订单
    app.post('/api/min/order/create', async (req, res) => {
        let openid = req.headers.token;
        let body = req.body;
        body['sn'] = 'CC' + new Date().getTime();
        let user = await MinAppLoginStatusModel.findOne({openid: openid}).exec();
        body['customer'] = user._id;

        let order = await OrdersModel.create(body);

        res.json({
            status: 200,
            msg: 'success',
            data: order['_id']
        })
    });
    // 根据订单_id获取订单
    app.get('/api/min/order/get', async (req, res) => {
        let id = new ObjectId(req.query.id);
        let order = await OrdersModel.findOne({
            _id: id
        }).populate([
            {
                path: 'customer',
                select: 'userInfo'
            },
            {
                path: 'address'
            }
        ]).exec();

        res.json({
            status: 200,
            msg: 'success',
            data: order
        });

    });
    // 更新订单
    app.post('/api/min/order/update', async (req, res) => {
        let body = req.body;
        let id = new ObjectId(body.id);
        await OrdersModel.findOneAndUpdate({
            _id: id
        }, body);
        res.json({
            status: 200,
            msg: 'success'
        })
    });
    // 微信支付
    app.post('/api/min/wx_pay/order', (req, res) => {
        let openid = req.headers.token;

        let attach = req.body.attach; // 订单标题
        let body = req.body.body; // 订单描述
        let out_trade_no = req.body.out_trade_no; // 订单号
        let total_fee = req.body.total_fee; // 订单总价 单位：分

        wxPay.order(attach, body, out_trade_no, total_fee, openid).then(
            json => {
                res.json({
                    status: 200,
                    data: json
                })
            }
        );
    });
    // 查询用户订单列表
    app.get('/api/min/order-list', async (req, res) => {
        let openid = req.headers.token;

        let page = req.query.page || 1;
        let limit = req.query.limit || 5;
        let skip = (page - 1) * limit;

        let status = req.query.status;
        let query = {};
        let user = await MinAppLoginStatusModel.findOne({openid: openid}).exec();
        query['customer'] = user._id;
        if (status) {
            query['status'] = status;
        }
        let orderList = await OrdersModel.find(query).skip(skip).limit(limit).sort({
            createdAt: -1
        }).exec();
        let sumOrderList = await OrdersModel.find(query).exec();

        res.json({
            status: 200,
            msg: 'success',
            data: orderList,
            total: sumOrderList.length
        })
    });
    //删除订单
    app.get('/api/min/del-order', async (req, res) => {
        let id = new ObjectId(req.query.id);
        await OrdersModel.findByIdAndRemove(id);
        res.json({
            status: 200,
            msg: 'success'
        });
    });

    // 首页活动
    app.get('/api/min/activities/list', async (req, res) => {
        let limit = req.query.limit || 5;
        let now = moment().toISOString();
        let activities = await ActivityModel.find({
            indexShow: true,
            startTime: {$lte: now},
            endTime: {$gt: now}
        }).limit(limit).sort({
            createdAt: -1
        }).exec();

        res.json({
            status: 200,
            msg: 'success',
            data: activities
        });
    });
    // 活动信息
    app.get('/api/min/activities/get',async(req, res) => {
        let id = new ObjectId(req.query.id);
        let activity = await ActivityModel.findOne({_id: id}).exec();

        res.json({
            status: 200,
            msg: 'success',
            data: activity
        });
    });
}
