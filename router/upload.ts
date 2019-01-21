import * as multer from 'multer';
import * as qiniu from 'qiniu';
import config  from '../lib/config';

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
const cpUpload = upload.fields([{name: 'file', maxCount: 1}, {name: 'banner', maxCount: 8}]);
// 错误用法：获取不到file.path -> 注：这个是上传后的地址
// const upload = multer(storage);

// 七牛配置
qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;
const SDNURL = config.qiniu.SDNURL; // 七牛空间地址
//要上传的空间
const bucket = config.qiniu.BUCKKET;

//构建上传策略函数
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy({scope: bucket + ":" + key});
    return putPolicy.uploadToken();
}

// 改造成七牛上传
export default function (app) {
    app.post('/api/admin/file/upload', cpUpload, async (req, res) => {
        const files = req.files;
        let filesArr = [];
        // req.files['file'][0] -> File
        // req.files['banner'] -> Array
        if (files['file']) {
            filesArr = req.files['file'];
        } else if (files['banner']) {
            filesArr = req.files['banner'];
        }

        new Promise((resolve, reject) => {
            filesArr.map(async file => {
                //要上传文件的文件名
                const key = file.originalname;
                //要上传文件的本地路径
                const filePath = file.path;
                //生成上传 Token
                const token = uptoken(bucket, key);
                // 上传
                let extra = new qiniu.form_up.PutExtra();
                let formUploader = new qiniu.form_up.FormUploader();
                await formUploader.putFile(token, key, filePath, extra, function (err, ret) {
                    if (!err) {
                        // 上传成功
                        resolve(ret);
                    } else {
                        // 上传失败， 处理返回代码
                        reject(err);
                    }
                });
            });
        })
            .then(json => {
                // 上传成功， 处理返回值
                res.send({
                    status: 200,
                    data: SDNURL + json['key']+'?imageView2/1/w/750/q/65',
                    msg: 'success'
                });
            })
            .catch(err => {
                res.send({
                    status: 10001,
                    msg: '上传失败,图片服务器异常，请重新上传',
                    data: err
                });
                console.log(err);
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
