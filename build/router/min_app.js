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
var wechat_pay_1 = require("../lib/wechat_pay");
var request = require('request');
var ObjectId = require('mongodb').ObjectID;
var wxPay = new wechat_pay_1.WxPay();
function default_1(app) {
    var _this = this;
    // 小程序登录状态
    app.post('/api/min/onLogin', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var code, userInfo, appId, secret;
        return __generator(this, function (_a) {
            code = req.body.code;
            userInfo = req.body.userInfo;
            appId = 'wx5cd1cb352be7d983';
            secret = 'a00b8c0497396974c53699a506e42d15';
            request.get('https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code', function (err, resp, body) {
                return __awaiter(this, void 0, void 0, function () {
                    var _id, jwt, token, user;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(resp && resp.statusCode == 200)) return [3 /*break*/, 6];
                                body = JSON.parse(body);
                                _id = body.openid;
                                jwt = new jwt_1.Jwt(_id);
                                token = jwt.generateToken();
                                return [4 /*yield*/, models_1.MinAppLoginStatusModel.findOne({ openid: body.openid }).exec()];
                            case 1:
                                user = _a.sent();
                                if (!(user == null)) return [3 /*break*/, 3];
                                return [4 /*yield*/, models_1.MinAppLoginStatusModel.create({
                                        openid: body.openid,
                                        session_key: body.session_key,
                                        token: token,
                                        userInfo: userInfo
                                    })];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 5];
                            case 3: return [4 /*yield*/, models_1.MinAppLoginStatusModel.findOneAndUpdate({ openid: body.openid }, {
                                    token: token,
                                    userInfo: userInfo
                                })];
                            case 4:
                                _a.sent();
                                _a.label = 5;
                            case 5:
                                res.json({
                                    status: 200,
                                    msg: 'success',
                                    data: body.openid
                                });
                                _a.label = 6;
                            case 6: return [2 /*return*/];
                        }
                    });
                });
            });
            return [2 /*return*/];
        });
    }); });
    // 产品类目
    app.get('/api/min/products/cate-list', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
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
    // 搜索产品
    app.get('/api/min/products/list', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
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
    // 获取产品
    app.get('/api/min/products/get', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, product;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new ObjectId(req.query.id);
                    return [4 /*yield*/, models_1.ProudctsModel.findOne({
                            _id: id
                        }).exec()];
                case 1:
                    product = _a.sent();
                    res.json({
                        status: 200,
                        msg: 'success',
                        data: product
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 保存收货地址
    app.post('/api/min/user/save-address', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, id, address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    id = req.headers.token;
                    body.userId = id;
                    return [4 /*yield*/, models_1.AddressModel.findOne({
                            userId: id
                        }).exec()];
                case 1:
                    address = _a.sent();
                    if (address == null) {
                        body.isDefault = true;
                    }
                    else {
                        body.isDefault = false;
                    }
                    if (!(body.id != undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, models_1.AddressModel.findOneAndUpdate({
                            _id: new ObjectId(body.id)
                        }, {
                            user: body.user,
                            phone: body.phone,
                            region: body.region,
                            address: body.address
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, models_1.AddressModel.create(body)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    res.json({
                        status: 200,
                        msg: 'success'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 获取用户的收货地址
    app.get('/api/min/user/get-address', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, addresses;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.headers.token;
                    return [4 /*yield*/, models_1.AddressModel.find({
                            userId: id
                        }).sort({}).exec()];
                case 1:
                    addresses = _a.sent();
                    res.json({
                        status: 200,
                        msg: 'success',
                        data: addresses
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 修改默认收货地址
    app.get('/api/min/user/set-default-address', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new ObjectId(req.query.id);
                    return [4 /*yield*/, models_1.AddressModel.findOneAndUpdate({ isDefault: true }, {
                            isDefault: false
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, models_1.AddressModel.findOneAndUpdate({ _id: id }, {
                            isDefault: true
                        })];
                case 2:
                    _a.sent();
                    res.json({
                        status: 200,
                        msg: 'success'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 获取收货地址信息
    app.get('/api/min/user/get-address-by-id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new ObjectId(req.query.id);
                    return [4 /*yield*/, models_1.AddressModel.findOne({ _id: id }).exec()];
                case 1:
                    address = _a.sent();
                    res.json({
                        status: 200,
                        msg: 'success',
                        data: address
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 获取用户默认收货地址
    app.get('/api/min/user/get-address-by-default', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.headers.token;
                    return [4 /*yield*/, models_1.AddressModel.findOne({
                            userId: id,
                            isDefault: true
                        }).exec()];
                case 1:
                    address = _a.sent();
                    res.json({
                        status: 200,
                        msg: 'success',
                        data: address
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 删除收货地址
    app.get('/api/min/user/del-address', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new ObjectId(req.query.id);
                    return [4 /*yield*/, models_1.AddressModel.findOneAndDelete(id)];
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
    // 创建订单
    app.post('/api/min/order/create', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, body, order;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = req.headers.token;
                    body = req.body;
                    body['sn'] = 'CC' + new Date().getTime();
                    body['customer'] = userId;
                    return [4 /*yield*/, models_1.OrdersModel.create(body)];
                case 1:
                    order = _a.sent();
                    res.json({
                        status: 200,
                        msg: 'success',
                        data: order['_id']
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 根据订单_id获取订单
    app.get('/api/min/order/get', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, order;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new ObjectId(req.query.id);
                    return [4 /*yield*/, models_1.OrdersModel.findOne({
                            _id: id
                        }).exec()];
                case 1:
                    order = _a.sent();
                    res.json({
                        status: 200,
                        msg: 'success',
                        data: order
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 更新订单
    app.post('/api/min/order/update', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    id = new ObjectId(body.id);
                    return [4 /*yield*/, models_1.OrdersModel.findOneAndUpdate({
                            _id: id
                        }, body)];
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
    // 微信支付
    app.post('/api/min/wx_pay/order', function (req, res) {
        var openid = req.headers.token;
        var attach = req.body.attach; // 订单标题
        var body = req.body.body; // 订单描述
        var out_trade_no = req.body.out_trade_no; // 订单号
        var total_fee = req.body.total_fee; // 订单总价 单位：分
        wxPay.order(attach, body, out_trade_no, total_fee, openid).then(function (json) {
            res.json({
                status: 200,
                data: json
            });
        });
    });
    // 查询用户订单列表
    app.get('/api/min/order-list', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var openid, page, limit, skip, status, query, orderList, sumOrderList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    openid = req.headers.token;
                    page = req.query.page || 1;
                    limit = req.query.limit || 5;
                    skip = (page - 1) * limit;
                    status = req.query.status;
                    query = {};
                    query['customer'] = openid;
                    if (status) {
                        query['status'] = status;
                    }
                    return [4 /*yield*/, models_1.OrdersModel.find(query).skip(skip).limit(limit).sort({
                            createdAt: -1
                        }).exec()];
                case 1:
                    orderList = _a.sent();
                    return [4 /*yield*/, models_1.OrdersModel.find(query).exec()];
                case 2:
                    sumOrderList = _a.sent();
                    res.json({
                        status: 200,
                        msg: 'success',
                        data: orderList,
                        total: sumOrderList.length
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    //删除订单
    app.get('/api/min/del-order', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new ObjectId(req.query.id);
                    return [4 /*yield*/, models_1.OrdersModel.findByIdAndRemove(id)];
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
}
exports.default = default_1;
