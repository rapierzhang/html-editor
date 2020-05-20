import axios from 'axios';
import CONFIG from '../config'

const fetch = (opts = {}) => {
    let url = CONFIG.serverDomain + (typeof opts === 'string' ? opts : opts.url || '');
    let method = (opts.method || 'GET').toLowerCase();
    let params = opts.params || {};
    let config = opts.config || {};

    if (url.length === 0) {
        console.warn('utils.request: url未指定');
        return;
    }

    return new Promise((resolve, reject) => {
        axios[method](url, params, config)
            .then(res => {
                if (res.status === 200 && res.data.code === 200) {
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
            })
            .catch(res => {
                reject({
                    code: 500,
                    data: res.data,
                    msg: 'network error',
                });
            });
    })
}

export default fetch;
