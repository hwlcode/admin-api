import {MinAppLoginStatusModel} from '../models';

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
}
