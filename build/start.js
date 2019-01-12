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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var router_1 = require("./router");
var jwt_1 = require("./lib/jwt");
var models_1 = require("./models");
var app = express();
//middleware
app.use('/', express.static(path.join(__dirname, '..', 'public'))); //静态资源存放目录
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//router
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
// 小程序路由中间件/api/min/开头的都从这里验证一次
app.use('/api/min/', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var regExp, appUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                regExp = new RegExp('/onLogin', 'gi').test(req.url);
                if (!!regExp) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.MinAppLoginStatusModel.findOne({
                        token: req.headers.token
                    }).exec()];
            case 1:
                appUser = _a.sent();
                if (appUser == null) {
                    res.json({ status: 403, msg: '用户不存在或登录已过期,请重新登录' });
                }
                else {
                    next();
                }
                return [3 /*break*/, 3];
            case 2:
                next();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
// 后台的中间件/api/admin 开头的都从这里验证一下
app.use('/api/admin/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var regx, token, jwt, result;
        return __generator(this, function (_a) {
            regx = !new RegExp('/user/login', 'gi').test(req.url)
                && !new RegExp('/user/register', 'gi').test(req.url)
                && !new RegExp('/file/upload', 'gi').test(req.url);
            if (regx) {
                token = req.headers.token;
                jwt = new jwt_1.Jwt(token);
                result = jwt.verifyToken();
                // 如果验证通过就next，否则就返回登陆信息不正确
                if (result == 'err') {
                    res.json({ status: 403, msg: '登录已过期,请重新登录' });
                }
                else {
                    next();
                }
            }
            else {
                next();
            }
            return [2 /*return*/];
        });
    });
});
router_1.default(app);
if (process.env.NODE_ENV === 'production') {
    app.listen(8000, function () {
        console.log('http is running at pro http://localhost:8000');
    });
}
else {
    app.listen(9527, function () {
        console.log('app is running at pro http://localhost:9527');
    });
}
