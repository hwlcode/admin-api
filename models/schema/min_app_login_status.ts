import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

let MinAppLoginStatusSchema = new Schema({
    openid: {type: String, default: null, display: '小程序用户唯一标识'},
    session_key: {type: String, default: null, display: '小程序会话密钥'},
    userInfo: {type: Object, default: {}, display: '用户信息'},
    access_token: {type: String, default: null, display: 'api密钥'},
}, {
    timestamps: true
});

export const MinAppLoginStatusModel = mongoose.model('MinAppUser', MinAppLoginStatusSchema);
