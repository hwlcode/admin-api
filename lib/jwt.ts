import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

export class Jwt {
    data: any;

    constructor(data) {
        this.data = data;
    }

    //生成token
    generateToken() {
        let data = this.data;
        let token = jwt.sign({
            exp: moment().add(7, 'days').valueOf(), // 7天后到期
            data: data
        }, 'lovechadao');

        return token;
    }

    verifyToken() {
        let token = this.data;
        let res;
        try {
            let result = jwt.verify(token, 'lovechadao') || {};
            let {exp = 0} = result, current = moment().valueOf();
            if (current <= exp) {
                res = result.data || {};
            }
        } catch (e) {
            res = 'err';
        }
        return res;
    }
}
