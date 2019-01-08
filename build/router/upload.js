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
var multer = require("multer");
var qiniu = require("qiniu");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //目录要手动创建
        cb(null, './public/uploads');
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + "." + file.originalname.split('.')[1]);
    }
});
// 用于获取客户端传过来的file数据 http://www.expressjs.com.cn/4x/api.html#req.body
var upload = multer({ storage: storage });
// 错误用法：获取不到file.path -> 注：这个是上传后的地址
// const upload = multer(storage);
// 七牛配置
qiniu.conf.ACCESS_KEY = 'knHk6MSfcyIYaH-VDUvLLvNNi8lmK5LCLvfeKa7h';
qiniu.conf.SECRET_KEY = 'VH9zMDzg9wBZp4UBfZZRSLSPdRt6YBH4A2VrkPtA';
var SDNURL = 'http://pl02v1azy.bkt.clouddn.com/'; // 七牛空间地址
//要上传的空间
var bucket = 'webcdn';
//构建上传策略函数
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy({ scope: bucket + ":" + key });
    return putPolicy.uploadToken();
}
// 改造成七牛上传
function default_1(app) {
    var _this = this;
    app.post('/api/file/upload', upload.single('file'), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var file, key, filePath, token, extra, formUploader;
        return __generator(this, function (_a) {
            file = req.file;
            key = file.originalname;
            filePath = file.path;
            token = uptoken(bucket, key);
            extra = new qiniu.form_up.PutExtra();
            formUploader = new qiniu.form_up.FormUploader();
            formUploader.putFile(token, key, filePath, extra, function (err, ret) {
                if (!err) {
                    // 上传成功， 处理返回值
                    res.send({
                        code: 200,
                        path: SDNURL + key,
                        msg: 'success'
                    });
                }
                else {
                    // 上传失败， 处理返回代码
                    console.log(err);
                }
            });
            return [2 /*return*/];
        });
    }); });
}
exports.default = default_1;
// 本地上传
// export default function (app) {
//     app.post('/api/file/upload', upload.single('file'), async (req, res) => {
//         const file = req.file;
//
//         var img = await UploadModel.create({
//             mimeType: file.mimetype,
//             originalName: file.originalname,
//             path: file.path.split('public')[1],
//             size: file.size
//         });
//
//         res.send({
//             ret_code: '0',
//             id: img._id,
//             path: img['path'],
//             msg: 'success'
//         });
//     });
// }
