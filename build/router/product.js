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
var ObjectId = require('mongodb').ObjectID;
function default_1(app) {
    var _this = this;
    app.post('/api/products/post-cate', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, cate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    return [4 /*yield*/, models_1.ProductCateModel.findOne({ name: body.name }).exec()];
                case 1:
                    cate = _a.sent();
                    if (!(cate == null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, models_1.ProductCateModel.create(body)];
                case 2:
                    _a.sent();
                    res.json({
                        status: 200,
                        msg: '添加成功'
                    });
                    return [3 /*break*/, 4];
                case 3:
                    res.json({
                        status: 1000,
                        msg: '添加失败，分类己存在'
                    });
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); });
    app.get('/api/products/cate-list', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var status, productsCates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    status = req.query.status;
                    if (!(status != undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, models_1.ProductCateModel.find({
                            status: status
                        }).exec()];
                case 1:
                    productsCates = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, models_1.ProductCateModel.find().exec()];
                case 3:
                    productsCates = _a.sent();
                    _a.label = 4;
                case 4:
                    res.json({
                        status: 200,
                        data: productsCates
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 启用|禁用分类
    app.get('/api/products/change-status', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, cate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new ObjectId(req.query.id);
                    return [4 /*yield*/, models_1.ProductCateModel.findOne({ _id: id }).exec()];
                case 1:
                    cate = _a.sent();
                    return [4 /*yield*/, models_1.ProductCateModel.updateOne({ _id: id }, {
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
    app.get('/api/products/cate/del', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, cates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new ObjectId(req.query.id);
                    return [4 /*yield*/, models_1.ProductCateModel.findOne({ _id: id }).remove()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, models_1.ProductCateModel.find().exec()];
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
    // 添加商品
    app.post('/api/products/post', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, cate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    return [4 /*yield*/, models_1.ProudctsModel.findOne({ title: body.title }).exec()];
                case 1:
                    cate = _a.sent();
                    if (!(cate == null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, models_1.ProudctsModel.create(body)];
                case 2:
                    _a.sent();
                    res.json({
                        status: 200,
                        msg: '添加成功'
                    });
                    return [3 /*break*/, 4];
                case 3:
                    res.json({
                        status: 1000,
                        msg: '添加失败, 请勿重复添加商品'
                    });
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); });
    //搜索商品
    app.get('/api/products/list', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var page, keywords, cates, limit, skip, products, countProduct, cateArr, ObjectIdCateArrt_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    page = req.query.page || 1;
                    keywords = req.query.keywords || '';
                    cates = req.query.cates;
                    limit = 12;
                    skip = (page - 1) * limit;
                    products = [];
                    countProduct = [];
                    if (!cates) return [3 /*break*/, 3];
                    cateArr = cates.split(',');
                    ObjectIdCateArrt_1 = [];
                    cateArr.map(function (cate) {
                        ObjectIdCateArrt_1.push(new ObjectId(cate));
                    });
                    return [4 /*yield*/, models_1.ProudctsModel.find({
                            title: new RegExp(keywords, 'gi'),
                            cate: { $in: ObjectIdCateArrt_1 }
                        }).skip(skip).limit(limit).sort({ createdAt: -1 }).exec()];
                case 1:
                    products = _a.sent();
                    return [4 /*yield*/, models_1.ProudctsModel.find({
                            title: new RegExp(keywords, 'gi'),
                            cate: { $in: ObjectIdCateArrt_1 }
                        }).exec()];
                case 2:
                    countProduct = _a.sent();
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, models_1.ProudctsModel.find({
                        title: new RegExp(keywords, 'gi')
                    }).skip(skip).limit(limit).sort({ createdAt: -1 }).exec()];
                case 4:
                    products = _a.sent();
                    return [4 /*yield*/, models_1.ProudctsModel.find({
                            title: new RegExp(keywords, 'gi')
                        }).exec()];
                case 5:
                    countProduct = _a.sent();
                    _a.label = 6;
                case 6:
                    res.json({
                        status: 200,
                        msg: '成功',
                        data: products,
                        total: countProduct.length
                    });
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.default = default_1;
