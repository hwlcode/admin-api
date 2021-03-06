var rp = require('request-promise');
var crypto = require('crypto');
var xmlreader = require('xmlreader');

const appid = 'wx5cd1cb352be7d983'; // 小程序appid
const mch_id = '1509738891'; // 商户号
const notify_url = '/api/wx_pay/notify';
const key = 'e23aeef053122aa7b2aa04d503c28681'; // 如果得到的MD5值相同，但签名失败，可能是商户key不对

class WxPay {
    /**
     * 支付签名
     * @param nonceStr 随机字符串
     * @param prepay_id  prepay_id
     * @param signType 签名类型
     * @param timeStamp 时间戳 必段为字符串型
     * @returns {string}
     */
    paysignjs(nonceStr, timeStamp, _package) {
        var ret = {
            appId: appid,  // 注意字段大小写
            // partnerid: mch_id, // 小程序不需要
            // prepayid: prepay_id, // 小程序不需要
            timeStamp: timeStamp,
            nonceStr: nonceStr,
            signType: 'MD5', // app 不需要
            package: _package  // app和小程序支付格式不一样
        };
        // console.log(ret);
        var string = this.raw(ret);
        string = string + '&key=' + key;
        // console.log(string);
        var sign = crypto.createHash('md5').update(string, 'utf8').digest('hex');
        return sign.toUpperCase();
    }

    /**
     * 预支付签名
     * @param attach: 名称
     * @param body: 购买信息
     * @param nonce_str: 随机字符串
     * @param out_trade_no: 订单号
     * @param spbill_create_ip: pv4客户端地址
     * @param total_fee： 订单总价
     * @param trade_type：交易类型
     * @returns {string}
     */
    paysignjsapi(attach, body, nonce_str, out_trade_no, spbill_create_ip, total_fee, trade_type, openid) {
        const ret = {
            appid: appid,
            attach: attach,
            body: body,
            mch_id: mch_id,
            nonce_str: nonce_str,
            notify_url: notify_url,
            out_trade_no: out_trade_no,
            spbill_create_ip: spbill_create_ip,
            total_fee: total_fee * 100,
            trade_type: trade_type,
            openid: openid
        };
        let string = this.raw(ret);
        string = string + '&key=' + key; //key为在微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置
        let sign = crypto.createHash('md5').update(string, 'utf8').digest('hex');
        return sign.toUpperCase();
    }

    // 此处的attach不能为空值 否则微信提示签名错误
    order(attach, body, out_trade_no, total_fee, openid) {
        const nonce_str = this.createNonceStr();
        const timeStamp = this.createTimeStamp();
        const url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
        const spbill_create_ip = '61.50.221.43';
        const trade_type = 'JSAPI';
        const preSign = this.paysignjsapi(attach, body, nonce_str, out_trade_no, spbill_create_ip, total_fee, trade_type, openid);
        const self = this;

        return new Promise((resolve, reject) => {
            let formData = "<xml>";
            formData += "<appid>" + appid + "</appid>"; // appid
            formData += "<attach>" + attach + "</attach>"; // 订单标题
            formData += "<body>" + body + "</body>"; // 订单描述
            formData += "<mch_id>" + mch_id + "</mch_id>"; // 商户号
            formData += "<nonce_str>" + nonce_str + "</nonce_str>"; // 随机字符串，不长于32位。
            formData += "<notify_url>" + notify_url + "</notify_url>"; // 回调地址
            formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>"; // 订单号
            formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"; // IP4地址：客户端地址
            formData += "<total_fee>" + total_fee * 100 + "</total_fee>"; // 订单总价 单位：分
            formData += "<trade_type>" + trade_type + "</trade_type>"; // 交易类型
            formData += "<openid>" + openid + "</openid>"; // 支付用户维一标识
            formData += "<sign>" + preSign + "</sign>"; // 签名：把上面所需的字段签名
            formData += "</xml>";

            rp({
                url: url,
                method: 'POST',
                body: formData
            }).then(
                parsedBody => {
                    xmlreader.read(parsedBody, (err, res) => {
                        if (err) return console.log(err);
                        //console.log(parsedBody); // 调试时打开

                        // 返回预支付信息（prepay_id）//这步很重要，一定要先生成预支付订单
                        let prepayid = res.xml.prepay_id.text();

                        let _package = 'prepay_id=' + prepayid;

                        //签名
                        let _paySignjs = self.paysignjs(nonce_str, timeStamp, _package);
                        // console.log(_paySignjs);

                        // 传给app
                        let args = {
                            appid: appid,
                            partnerid: mch_id,
                            prepayid: prepayid,
                            timestamp: timeStamp,
                            noncestr: nonce_str,
                            // package: "Sign=WXPay" // app支付
                            package: _package // 小程序支付
                        };
                        // console.log(args);
                        args['sign'] = _paySignjs;

                        resolve(args);
                    });
                }
            ).catch(
                err => {
                    reject(err);
                }
            )
        });
    }

    //支付回调通知
    notify(obj) {
        var output = "";
        if (obj.return_code == "SUCCESS") {
            var reply = {
                return_code: "SUCCESS",
                return_msg: "OK"
            };

        } else {
            var reply = {
                return_code: "FAIL",
                return_msg: "FAIL"
            };
        }
        return output;
    }

    // 时间戳产生函数
    createTimeStamp() {
        return parseInt((new Date().getTime() / 1000).toString(), 10) + '';
    }

    /**
     * 随机字符串产生函数
     * @returns {string}
     */
    createNonceStr() {
        return Math.random().toString(36).substr(2, 15);
    }

    /**
     * 拼接字符串
     */
    raw(args) {
        var keys = Object.keys(args);
        keys = keys.sort()
        var newArgs = {};
        keys.forEach(function (key) {
            newArgs[key] = args[key];
        });
        var string = '';
        for (var k in newArgs) {
            string += '&' + k + '=' + newArgs[k];
        }
        string = string.substr(1);
        return string;
    }
}

export { WxPay }
