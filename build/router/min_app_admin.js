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
function default_1(app) {
    var _this = this;
    // 小程序用户
    app.get('/api/admin/min-app/get-wechat-user', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var page, limit, skip, users, sumUsers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    page = req.query.page || 1;
                    limit = 21;
                    skip = (page - 1) * limit;
                    return [4 /*yield*/, models_1.MinAppLoginStatusModel.find().skip(skip).limit(limit).sort({
                            createdAt: -1
                        }).exec()];
                case 1:
                    users = _a.sent();
                    return [4 /*yield*/, models_1.MinAppLoginStatusModel.find().exec()];
                case 2:
                    sumUsers = _a.sent();
                    res.json({
                        status: 200,
                        msg: 'success',
                        data: users,
                        total: sumUsers.length
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // 查询订单
    app.get('/api/admin/order-list', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var page, limit, skip, query, status, isLast, orderList, sumOrderList, total;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    page = req.query.page || 1;
                    limit = req.query.limit || 12;
                    skip = (page - 1) * limit;
                    query = {};
                    status = req.query.status;
                    isLast = false;
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
                    total = sumOrderList.length;
                    if (limit * page >= total) {
                        isLast = true;
                    }
                    res.json({
                        status: 200,
                        msg: 'success',
                        data: orderList,
                        total: total,
                        isLast: isLast
                    });
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.default = default_1;
