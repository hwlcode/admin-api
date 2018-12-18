import {ArticleCateModel, ArticleTagsModel} from '../models';

const ObjectId = require('mongodb').ObjectID;

export default function (app) {
    // 保存文章分类
    app.post('/api/articles/post-cate', async (req, res) => {
        let body = req.body;
        const cate = await ArticleCateModel.findOne({name: body.name}).exec();
        if (cate == null) {
            await ArticleCateModel.create(body);
            res.json({
                status: 200,
                msg: '文章分类添加成功'
            });
        } else {
            res.json({
                status: 1000,
                msg: '添加失败，文章分类己存在'
            });
        }
    });
    // 查询分类
    app.get('/api/articles/search', async (req, res) => {
        let status = req.query.status;
        // let keywords = req.query.keyword;
        let articlesCates;

        if (status != undefined) {
            articlesCates = await ArticleCateModel.find({
                status: status
            }).exec();
        }
        // else if(keywords != undefined){
        //     articlesCates = await ArticleCateModel.find({
        //         name: new RegExp(keywords, 'gi')
        //     }).exec();
        // }
        else {
            articlesCates = await ArticleCateModel.find().exec();
        }

        res.json({
            status: 200,
            data: articlesCates
        });
    });
    // 删除文章分类
    app.get('/api/articles/cate', async (req, res) => {
        let id = new ObjectId(req.query.id);
        await ArticleCateModel.findOne({_id: id}).remove();
        let cates = await ArticleCateModel.find().exec();

        res.json({
            status: 200,
            msg: '请求成功',
            data: cates
        });
    });
    // 启用|禁用文章分类
    app.get('/api/articles/change-status', async (req, res) => {
        let id = new ObjectId(req.query.id);
        let cate = await ArticleCateModel.findOne({_id: id}).exec();
        await ArticleCateModel.updateOne({_id: id}, {
            status: !cate['status']
        }).exec();

        res.json({
            status: 200,
            msg: '更新成功'
        });
    });

    //保存文章标签
    app.post('/api/articles/post-tags', async (req, res) => {
        let body = req.body;
        const cate = await ArticleTagsModel.findOne({name: body.name}).exec();
        if (cate == null) {
            await ArticleTagsModel.create(body);
            res.json({
                status: 200,
                msg: '文章标签添加成功'
            });
        } else {
            res.json({
                status: 1000,
                msg: '添加失败，文章标签己存在'
            });
        }
    });
    // 查询标签
    app.get('/api/articles/search-tags', async (req, res) => {
        let status = req.query.status;
        let articlesTags;

        if (status != undefined) {
            articlesTags = await ArticleTagsModel.find({
                status: status
            }).exec();
        }
        else {
            articlesTags = await ArticleTagsModel.find().exec();
        }

        res.json({
            status: 200,
            data: articlesTags
        });
    });
    // 删除标签
    app.get('/api/articles/tags/del', async (req, res) => {
        let id = new ObjectId(req.query.id);
        await ArticleTagsModel.findOne({_id: id}).remove();
        let tags = await ArticleTagsModel.find().exec();

        res.json({
            status: 200,
            msg: '请求成功',
            data: tags
        });
    });
    // 启用|禁用文章标签
    app.get('/api/articles/tags/change-status', async (req, res) => {
        let id = new ObjectId(req.query.id);
        let tag = await ArticleTagsModel.findOne({_id: id}).exec();
        await ArticleTagsModel.updateOne({_id: id}, {
            status: !tag['status']
        }).exec();

        res.json({
            status: 200,
            msg: '更新成功'
        });
    });
}
