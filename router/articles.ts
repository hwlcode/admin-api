import {ArticleCateModel, ArticleTagsModel, ArticlesModel} from '../models';
import {Jwt} from '../lib/jwt';

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

    // 发布文章
    app.post('/api/article/post', async (req, res) => {
        let body = req.body;

        let token = req.headers.token;
        let jwt = new Jwt(token);
        let result = jwt.verifyToken();
        let id = new ObjectId(result);
        body.user = id;
        await ArticlesModel.create(body);
        res.json({
            status: 200,
            msg: '发布成功'
        });
    });
    // 搜索文章
    app.get('/api/article/search', async (req, res) => {
        let keywords = req.query.keywords || '';
        let cate = req.query.cate || [];
        let tags = req.query.tags || [];
        let page = req.query.q || 1;

        let articles = await getArticles({
            keywords: keywords,
            cate: cate,
            tags: tags,
            page: page
        });

        res.json({
            status: 200,
            msg: '请求成功',
            data: articles
        })
    });
    // 删除文章
    app.get('/api/article/del', async (req, res) => {
        let id = new ObjectId(req.query.id);
        await ArticlesModel.findOne({_id: id}).remove();

        let keywords = req.query.keywords || '';
        let cate = req.query.cate || [];
        let tags = req.query.tags || [];
        let page = req.query.q || 1;

        let articles = getArticles({
            keywords: keywords,
            cate: cate,
            tags: tags,
            page: page
        });

        res.json({
            status: 200,
            msg: '请求成功',
            data: articles
        });
    });
}

 function getArticles(...options) {
    let obj = {};
    let limit = 10;
    let page = 1;
    let skip = 0;
    // 关键词
    if (options['keywords'] != 'undefined') {
        obj['title'] = new RegExp(options[0]['keywords'], 'gi');
    }
    // 类目，可以单一也可以多个类目并合
    if (options['cate'] != 'undefined') {
        obj['cate'] = new RegExp(options['cate'], 'gi');
    }
    // 标签
    // if (options['tags'] != 'undefined') {
    //     obj['tags'] = new RegExp(options['tags'], 'gi');
    // }
    // 分页
    if(options['page'] != 'undefined'){
        skip = (page - 1) * limit;
    }
    console.log(obj);

    let articles = ArticlesModel.find(obj).populate([
        {
            path: 'user', // 关联表
            select: '_id name avatar'   //查询字段
        },
        {
            path: 'tags',
            select: 'name _id'
        },
        {
            path: 'cate',
            select: 'name _id'
        }
    ]).skip(skip).limit(limit).sort({
        createdAt: -1
    }).exec();

    return articles;
}
