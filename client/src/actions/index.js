// 模板列表获取
import { fetch } from '../common';

// 模板列表
export const compListGet = params => {
    return fetch({
        url: '/api/component/list',
        method: 'GET',
        params,
    }).then(res => res.data);
};

// 脚本列表
export const scriptListGet = () =>
    fetch({
        url: '/api/script/list',
        method: 'GET',
    }).then(res => res.data);
