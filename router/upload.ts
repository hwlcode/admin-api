import * as multer from 'multer';
import {UploadModel} from '../models';
import * as qiniu from 'qiniu';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //目录要手动创建
        cb(null, './public/uploads')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + "." + file.originalname.split('.')[1]);
    }
});
// 用于获取客户端传过来的file数据 http://www.expressjs.com.cn/4x/api.html#req.body
const upload = multer({storage: storage});
// 错误用法：获取不到file.path -> 注：这个是上传后的地址
// const upload = multer(storage);

// 七牛配置
qiniu.conf.ACCESS_KEY = 'knHk6MSfcyIYaH-VDUvLLvNNi8lmK5LCLvfeKa7h';
qiniu.conf.SECRET_KEY = 'VH9zMDzg9wBZp4UBfZZRSLSPdRt6YBH4A2VrkPtA';
const SDNURL = 'http://pl02v1azy.bkt.clouddn.com/'; // 七牛空间地址
//要上传的空间
const bucket = 'webcdn';
//构建上传策略函数
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy({scope: bucket + ":" + key});
    return putPolicy.uploadToken();
}
// 改造成七牛上传
export default function (app) {
    app.post('/api/file/upload', upload.single('file'), async (req, res) => {
        const file = req.file;
        //要上传文件的文件名
        const key = file.originalname;
        //要上传文件的本地路径
        const filePath = file.path
        //生成上传 Token
        const token = uptoken(bucket, key);
        // 上传
        let extra = new qiniu.form_up.PutExtra();
        let formUploader = new qiniu.form_up.FormUploader();
        formUploader.putFile(token, key, filePath, extra, function (err, ret) {
            if (!err) {
                // 上传成功， 处理返回值
                res.send({
                    code: 200,
                    path: SDNURL + key,
                    msg: 'success'
                });
            } else {
                // 上传失败， 处理返回代码
                console.log(err);
            }
        });
    });
}


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
