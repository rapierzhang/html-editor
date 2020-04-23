import axios from 'axios';
import CONFIG from '../config'

const fetch = (opts = {}) => {
    let url = CONFIG.domain + (typeof opts === 'string' ? opts : opts.url || '');
    let method = (opts.method || 'GET').toLowerCase();
    let params = opts.params || {};
    let config = opts.config || {};
    console.error(params)

    if (url.length === 0) {
        console.warn('utils.request: url未指定');
        return;
    }

    return new Promise((resolve, reject) => {
        axios[method](url, params, config)
            .then(res => {
                if (res.status === 200) {
                    resolve(res.data);
                } else {
                    reject({
                        code: res.status,
                        data: res.data,
                        msg: res.errMsg || '系统错误，请稍后重试！',
                    });
                }
            })
            .catch(res => {
                reject({
                    code: 500,
                    data: res,
                    msg: 'network error',
                });
            });
    })
}

export default fetch;
