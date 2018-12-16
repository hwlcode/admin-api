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
var ts_md5_1 = require("ts-md5");
var jwt_1 = require("../lib/jwt");
var ObjectId = require('mongodb').ObjectID;
function default_1(app) {
    var _this = this;
    // 用户登录
    app.post('/api/user/login', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    return [4 /*yield*/, models_1.UserModel.findOne({
                            phone: body.userName
                        }).then(function (data) {
                            if (data === null) {
                                res.send({ status: 404, msg: '账号不存在' });
                            }
                            else {
                                if (body.password == data['password']) {
                                    var _id = data['_id'];
                                    var jwt = new jwt_1.Jwt(_id);
                                    var token = jwt.generateToken();
                                    res.json({ status: 200, msg: '登陆成功', token: token });
                                }
                                else {
                                    res.json({ status: 404, msg: '账号密码错误' });
                                }
                            }
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // 获取用户基本信息
    app.get('/api/user/user-profile', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var token, jwt, result, id, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = req.headers.token;
                    jwt = new jwt_1.Jwt(token);
                    result = jwt.verifyToken();
                    id = new ObjectId(result);
                    if (!(result != 'err')) return [3 /*break*/, 2];
                    return [4 /*yield*/, models_1.UserModel.findOne({ _id: id }).exec()];
                case 1:
                    user = _a.sent();
                    res.json({
                        status: 200,
                        msg: '数据获取成功',
                        data: user
                    });
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    // 保存用户
    app.post('/api/user/save-user', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    return [4 /*yield*/, models_1.UserModel.findOne({
                            phone: body.phone
                        }).exec()];
                case 1:
                    user = _a.sent();
                    if (!(user === null)) return [3 /*break*/, 3];
                    body.password = ts_md5_1.Md5.hashStr('123456').toString();
                    return [4 /*yield*/, models_1.UserModel.create(body)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, models_1.UserModel.updateOne({
                        phone: body.phone
                    }, body).exec()];
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
    // 修改密码
    app.post('/api/user/password', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, token, jwt, result, id, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    token = req.headers.token;
                    jwt = new jwt_1.Jwt(token);
                    result = jwt.verifyToken();
                    id = new ObjectId(result);
                    return [4 /*yield*/, models_1.UserModel.findOne({
                            _id: id
                        }).exec()];
                case 1:
                    user = _a.sent();
                    if (!(body.oldPassword != user['password'])) return [3 /*break*/, 2];
                    res.json({
                        status: 1000,
                        msg: '原始密码输入不正确'
                    });
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, models_1.UserModel.updateOne({
                        _id: id
                    }, {
                        password: body.password
                    })];
                case 3:
                    _a.sent();
                    res.json({
                        status: 200,
                        msg: '密码修改成功'
                    });
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
exports.default = default_1;
