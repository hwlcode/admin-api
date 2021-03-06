"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var jwt_1 = require("../lib/jwt");
var ObjectId = require('mongodb').ObjectID;
function default_1(app) {
    var _this = this;
    // 保存文章分类
    app.post('/api/admin/articles/post-cate', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, cate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    return [4 /*yield*/, models_1.ArticleCateModel.findOne({ name: body.name }).exec()];
                case 1:
                    cate = _a.sent();
                    if (!(cate == null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, models_1.ArticleCateModel.create(body)];
                case 2:
                    _a.sent();
                    res.json({
                        status: 200,
                        msg: '文章分类添加成功'
                    });
                    return [3 /*break*/, 4];
                case 3:
                    res.json({
                        status: 1000,
                        msg: '添加失败，文章分类己存在'
                    });
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // 查询分类
    app.get('/api/admin/articles/search', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var status, articlesCates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    status = req.query.status;
                    if (!(status != undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, models_1.ArticleCateModel.find({
                            status: status
                        }).exec()];
                case 1:
                    articlesCates = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, models_1.ArticleCateModel.find().exec()];
                case 3:
                    articlesCates = _a.sent();
                    _a.label = 4;
                case 4:
                    res.json({
                        status: 200,
                        data: articlesCates
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 删除文章分类
    app.get('/api/admin/articles/cate', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, cates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new ObjectId(req.query.id);
                    return [4 /*yield*/, models_1.ArticleCateModel.findOne({ _id: id }).remove()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, models_1.ArticleCateModel.find().exec()];
                case 2:
                    cates = _a.sent();
                    res.json({
                        status: 200,
                        msg: '请求成功',
                        data: cates
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 启用|禁用文章分类
    app.get('/api/admin/articles/change-status', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, cate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new ObjectId(req.query.id);
                    return [4 /*yield*/, models_1.ArticleCateModel.findOne({ _id: id }).exec()];
                case 1:
                    cate = _a.sent();
                    return [4 /*yield*/, models_1.ArticleCateModel.updateOne({ _id: id }, {
                            status: !cate['status']
                        }).exec()];
                case 2:
                    _a.sent();
                    res.json({
                        status: 200,
                        msg: '更新成功'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    //保存文章标签
    app.post('/api/admin/articles/post-tags', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, cate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    return [4 /*yield*/, models_1.ArticleTagsModel.findOne({ name: body.name }).exec()];
                case 1:
                    cate = _a.sent();
                    if (!(cate == null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, models_1.ArticleTagsModel.create(body)];
                case 2:
                    _a.sent();
                    res.json({
                        status: 200,
                        msg: '文章标签添加成功'
                    });
                    return [3 /*break*/, 4];
                case 3:
                    res.json({
                        status: 1000,
                        msg: '添加失败，文章标签己存在'
                    });
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // 查询标签
    app.get('/api/admin/articles/search-tags', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var status, articlesTags;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    status = req.query.status;
                    if (!(status != undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, models_1.ArticleTagsModel.find({
                            status: status
                        }).exec()];
                case 1:
                    articlesTags = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, models_1.ArticleTagsModel.find().exec()];
                case 3:
                    articlesTags = _a.sent();
                    _a.label = 4;
                case 4:
                    res.json({
                        status: 200,
                        data: articlesTags
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 删除标签
    app.get('/api/admin/articles/tags/del', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, tags;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new ObjectId(req.query.id);
                    return [4 /*yield*/, models_1.ArticleTagsModel.findOne({ _id: id }).remove()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, models_1.ArticleTagsModel.find().exec()];
                case 2:
                    tags = _a.sent();
                    res.json({
                        status: 200,
                        msg: '请求成功',
                        data: tags
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 启用|禁用文章标签
    app.get('/api/admin/articles/tags/change-status', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, tag;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new ObjectId(req.query.id);
                    return [4 /*yield*/, models_1.ArticleTagsModel.findOne({ _id: id }).exec()];
                case 1:
                    tag = _a.sent();
                    return [4 /*yield*/, models_1.ArticleTagsModel.updateOne({ _id: id }, {
                            status: !tag['status']
                        }).exec()];
                case 2:
                    _a.sent();
                    res.json({
                        status: 200,
                        msg: '更新成功'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 发布文章
    app.post('/api/admin/article/post', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, token, jwt, result, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    token = req.headers.token;
                    jwt = new jwt_1.Jwt(token);
                    result = jwt.verifyToken();
                    id = new ObjectId(result);
                    body.user = id;
                    if (!(body.id != undefined)) return [3 /*break*/, 2];
                    // 更新
                    return [4 /*yield*/, models_1.ArticlesModel.findOneAndUpdate({
                            _id: new ObjectId(body.id)
                        }, body)];
                case 1:
                    // 更新
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: 
                // 新增
                return [4 /*yield*/, models_1.ArticlesModel.create(body)];
                case 3:
                    // 新增
                    _a.sent();
                    _a.label = 4;
                case 4:
                    res.json({
                        status: 200,
                        msg: '发布成功'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 搜索文章
    app.get('/api/admin/article/search', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var page, limit, skip, keywords, cates, tags, articles, articlesCount, options, cateArr, ObjectIdCateAttr_1, tagsArr, ObjectIdtagsAttr_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    page = req.query.page || 1;
                    limit = 6;
                    skip = (page - 1) * limit;
                    keywords = req.query.keywords || '';
                    cates = req.query.cates;
                    tags = req.query.tags;
                    articles = [];
                    articlesCount = [];
                    options = {};
                    options['title'] = new RegExp(keywords, 'gi');
                    if (cates) {
                        cateArr = cates.split(',');
                        ObjectIdCateAttr_1 = [];
                        cateArr.map(function (cate) {
                            ObjectIdCateAttr_1.push(new ObjectId(cate));
                        });
                        options['cate'] = { $in: ObjectIdCateAttr_1 };
                    }
                    if (tags) {
                        tagsArr = tags.split(',');
                        ObjectIdtagsAttr_1 = [];
                        tagsArr.map(function (tag) {
                            ObjectIdtagsAttr_1.push(new ObjectId(tag));
                        });
                        options['tags'] = { $in: ObjectIdtagsAttr_1 };
                    }
                    return [4 /*yield*/, models_1.ArticlesModel.find(options).populate([
                            {
                                path: 'user',
                                select: '_id name avatar' //查询字段
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
                        }).exec()];
                case 1:
                    articles = _a.sent();
                    return [4 /*yield*/, models_1.ArticlesModel.find(options).exec()];
                case 2:
                    articlesCount = _a.sent();
                    res.json({
                        status: 200,
                        msg: '请求成功',
                        data: articles,
                        total: articlesCount.length
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 删除文章
    app.get('/api/admin/article/del', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new ObjectId(req.query.id);
                    return [4 /*yield*/, models_1.ArticlesModel.findOne({ _id: id }).remove()];
                case 1:
                    _a.sent();
                    res.json({
                        status: 200,
                        msg: 'success'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 获取文章信息
    app.get('/api/admin/article/get', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, article;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new ObjectId(req.query.id);
                    return [4 /*yield*/, models_1.ArticlesModel.findOne({
                            _id: id
                        }).exec()];
                case 1:
                    article = _a.sent();
                    res.json({
                        status: 200,
                        msg: 'success',
                        data: article
                    });
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.default = default_1;
