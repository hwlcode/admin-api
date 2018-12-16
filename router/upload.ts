import * as multer from 'multer';
import {UploadModel} from '../models';

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
const upload = multer({
    storage: storage
});

export default function (app) {
    app.post('/api/file/upload', upload.single('file'), async (req, res) => {
        const file = req.file;

        var img = await UploadModel.create({
            mimeType: file.mimetype,
            originalName: file.originalname,
            path: file.path.split('public')[1],
            size: file.size
        });

        res.send({
            ret_code: '0',
            id: img._id,
            path: img['path'],
            msg: 'success'
        });
    });
}
