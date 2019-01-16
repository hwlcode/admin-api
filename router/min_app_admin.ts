import {MinAppLoginStatusModel, OrdersModel} from '../models';

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
    // 查询订单
    app.get('/api/admin/order-list', async (req, res) => {
        let page = req.query.page || 1;
        let limit = req.query.limit || 12;
        let skip = (page - 1) * limit;
        let query = {};
        let status = req.query.status;
        let isLast = false;

        if (status) {
            query['status'] = status;
        }

        let orderList = await OrdersModel.find(query).skip(skip).limit(limit).sort({
            createdAt: -1
        }).exec();
        let sumOrderList = await OrdersModel.find(query).exec();
        let total = sumOrderList.length;
        if(limit *  page >= total){
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
}
