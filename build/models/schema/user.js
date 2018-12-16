"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var findOrCreate = require("mongoose-findorcreate");
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    name: { type: String, default: null, display: '姓名' },
    nickname: { type: String, default: null, display: '别名' },
    email: { type: String, default: null, display: '邮箱' },
    profile: { type: String, default: null, display: '个人简介' },
    avatar: { type: String, default: null, display: '头像' },
    address: { type: String, default: null, display: '详细地址' },
    phone: { type: String, default: null, display: '手机号码' },
    password: { type: String, default: null, display: '登录密码' }
}, {
    timestamps: true
});
UserSchema.plugin(findOrCreate);
UserSchema.methods.setAdmin = function (cb) {
    return this.model('User').update({ phone: '15868823605' }, { role: 1 }, cb);
};
//扩展实例的内置方法，就可以如doc.find()一样使用了, 比如可以用于查或改某一字段的value
// UserSchema.methods.findSimilarTypes = function (cb) {
//     console.log(this.model);
//     return this.model('Animal').find({ type: this.type }, cb);
// };
// 调用方法
//var Animal = mongoose.model('Animal', animalSchema);
// var user  = new UserSchema({ phone: '15868823605' });
// user.findSimilarTypes(function(err, dogs) {
//     console.log(dogs); // woof
// });
//添加静态方法，statics对象添加一个方法。
// animalSchema.statics.findByName = function(name, cb) {
//     return this.find({ name: new RegExp(name, 'i') }, cb);
// };
// 调用方法
// var Animal = mongoose.model('Animal', animalSchema);
// Animal.findByName('fido', function(err, animals) {
//     console.log(animals);
// });
// 查询方法
// animalSchema.query.byName = function(name) {
//     return this.where({ name: new RegExp(name, 'i') });
// };
//
// var Animal = mongoose.model('Animal', animalSchema);
//
// Animal.find().byName('fido').exec(function(err, animals) {
//     console.log(animals);
// });
//
// Animal.findOne().byName('fido').exec(function(err, animal) {
//     console.log(animal);
// });
exports.UserModel = mongoose.model('User', UserSchema); // 指定表名User
