import {ProductCateModel} from "../models/schema/pro_cate";
const ObjectId = require('mongodb').ObjectID;

export default function (app) {
    app.post('/api/products/post-cate', async (req, res) => {
        let body = req.body;
        const cate = await ProductCateModel.findOne({name: body.name}).exec();
        if (cate == null) {
            await ProductCateModel.create(body);
            res.json({
                status: 200,
                msg: '添加成功'
            });
        } else {
            res.json({
                status: 1000,
                msg: '添加失败，分类己存在'
            });
        }
    });

    app.get('/api/products/cate-list', async (req, res) => {
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

    // 启用|禁用分类
    app.get('/api/products/change-status', async (req, res) => {
        let id = new ObjectId(req.query.id);
        let cate = await ProductCateModel.findOne({_id: id}).exec();
        await ProductCateModel.updateOne({_id: id}, {
            status: !cate['status']
        }).exec();

        res.json({
            status: 200,
            msg: '更新成功'
        });
    });

    app.get('/api/products/cate/del', async (req, res) => {
        let id = new ObjectId(req.query.id);
        await ProductCateModel.findOne({_id: id}).remove();
        let cates = await ProductCateModel.find().exec();

        res.json({
            status: 200,
            msg: '请求成功',
            data: cates
        });
    });
}
