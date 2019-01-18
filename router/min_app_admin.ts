import {MinAppLoginStatusModel, OrdersModel, ActivityModel} from '../models';

const ObjectId = require('mongodb').ObjectID;

export default function (app) {
    // 小程序用户
    app.get('/api/admin/min-app/get-wechat-user', async (req, res) => {
        let page = req.query.page || 1;
        let limit = 21;
        let skip = (page - 1) * limit;

        let users = await MinAppLoginStatusModel.find().skip(skip).limit(limit).sort({
            createdAt: -1
        }).exec();

        let sumUsers = await MinAppLoginStatusModel.find().exec();

        res.json({
            status: 200,
            msg: 'success',
            data: users,
            total: sumUsers.length
        });
    });
    // 查询订单列表
    app.get('/api/admin/order-list', async (req, res) => {
        let page = req.query.page || 1;
        let limit = req.query.limit || 12;
        let skip = (page - 1) * limit;

        let query = {};
        let status = req.query.status;
        let keywords = req.query.keywords;
        let isLast = false;

        if (status) {
            query['status'] = status;
        }

        if (keywords) {
            // 搜索订单号
            query['sn'] = new RegExp(keywords, 'gi');
        }


        let orderList = await OrdersModel.find(query).populate([{
            path: 'customer',
            select: 'userInfo'
        }, {
            path: 'address'
        }]).skip(skip).limit(limit).sort({
            createdAt: -1
        }).exec();
        let sumOrderList = await OrdersModel.find(query).exec();
        let total = sumOrderList.length;
        if (limit * page >= total) {
            isLast = true;
        }

        res.json({
            status: 200,
            msg: 'success',
            data: orderList,
            total: total,
            isLast: isLast
        })
    });
    // 查询订单by _id
    app.get('/api/admin/get-order', async (req, res) => {
        let id = new ObjectId(req.query.id);
        let order = await OrdersModel.findOne({_id: id}).populate([
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
    app.post('/api/admin/order/update', async (req, res) => {
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

    // 发布活动
    app.post('/api/admin/activity/post', async (req, res) => {
        let body = req.body;
        if (body.id) {
            await ActivityModel.findByIdAndUpdate(new ObjectId(body.id), body);
        } else {
            await ActivityModel.create(body);
        }

        res.json({
            status: 200,
            msg: '发布成功'
        })
    });
    // 活动列表
    app.get('/api/admin/activity/list', async (req, res) => {
        let page = req.query.page || 1;
        let limit = 12;
        let skip = (page - 1) * limit;

        let list = await ActivityModel.find().skip(skip).limit(limit).sort({
            createdAt: -1
        }).exec();
        let sumList = await ActivityModel.find().exec();

        res.json({
            status: 200,
            msg: 'success',
            data: list,
            total: sumList.length
        })
    });
    // 获取活动信息
    app.get('/api/admin/activity/get', async (req, res) => {
        let id = new ObjectId(req.query.id);
        let activity = await ActivityModel.findOne({_id: id}).exec();
        res.json({
            status: 200,
            msg: 'success',
            data: activity
        });
    });
}
