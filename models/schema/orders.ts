import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

let OrdersSchema = new Schema({
    sn: {type: String, default: null, display: '订单号: cc32424456698'},
    products:{type: String, default: null, display: '订单关联产品'},
    customer: {type: Schema.Types.ObjectId, default: null, ref: 'MinAppUser', display: '客户_id'},
    address:{type: Schema.Types.ObjectId, default: null, ref: 'Address', display: '客户收货地址ID'},
    sumPrice: {type: Number, default: 0, display: '订单总价'},
    type: {type: Number, default: 0, display: '订单类型: 0-> 普通订单，1-> 预售订单,预留字段'},
    status: {
        type: Number,
        default: 0,
        display: '订单状态: 0->创建，1->己支付，待发货 2-> 己发货，3->交易完成， 4->已评价，1000->买家取消, 2000->卖家取消, 3000->系统取消, 4000->交易失败'
    }
}, {
    timestamps: true
});

export const OrdersModel = mongoose.model('Order', OrdersSchema);
