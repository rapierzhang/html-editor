import { fetch } from '../../common';

// 页面初始化请求
export const listGet = params => {
    return fetch({
        url: '/api/list/get',
        method: 'post',
        params,
    }).then(res => res.data);
};
