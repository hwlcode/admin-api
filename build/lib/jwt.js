"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var moment = require("moment");
var Jwt = (function () {
    function Jwt(data) {
        this.data = data;
    }
    //生成token
    Jwt.prototype.generateToken = function () {
        var data = this.data;
        var token = jwt.sign({
            exp: moment().add(7, 'days').valueOf(),
            data: data
        }, 'lovechadao');
        return token;
    };
    Jwt.prototype.verifyToken = function () {
        var token = this.data;
        var res;
        try {
            var result = jwt.verify(token, 'lovechadao') || {};
            var _a = result.exp, exp = _a === void 0 ? 0 : _a, current = moment().valueOf();
            if (current <= exp) {
                res = result.data || {};
            }
        }
        catch (e) {
            res = 'err';
        }
        return res;
    };
    return Jwt;
}());
exports.Jwt = Jwt;
