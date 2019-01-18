"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ActivitySchema = new Schema({
    indexBanner: { type: String, default: null, display: '活动入口图片' },
    ActivitiesBanner: { type: String, default: null, display: '活动图片' },
    title: { type: String, default: null, display: '活动名称' },
    proId: { type: String, default: null, display: '产品id' },
    startTime: { type: Date, default: null, display: '开始时间,方便查询' },
    endTime: { type: Date, default: null, display: '结束时间,方便查询' },
    activityDate: [{ type: Date, default: null, display: '活动时间范围，用于表单展示' }],
    indexShow: { type: Boolean, default: true, display: '首页推荐' }
}, {
    timestamps: true
});
exports.ActivityModel = mongoose.model('Activity', ActivitySchema);
