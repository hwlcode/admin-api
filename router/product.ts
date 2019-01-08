import {ProductCateModel, ProudctsModel} from "../models";

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

    // 添加商品
    app.post('/api/products/post', async (req, res) => {
        let body = req.body;
        const cate = await ProudctsModel.findOne({title: body.title}).exec();
        if (cate == null) {
            await ProudctsModel.create(body);
            res.json({
                status: 200,
                msg: '添加成功'
            });
        } else {
            res.json({
                status: 1000,
                msg: '添加失败, 请勿重复添加商品'
            });
        }
    });

    //搜索商品
    app.get('/api/products/list', async (req, res) => {
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
            cateArr.map( cate => {
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
        }else{
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
}
