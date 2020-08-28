import { fetch } from '../../../common';

// 获取脚本
export const scriptGet = params =>
    fetch({
        url: '/api/script/get',
        method: 'GET',
        params,
    }).then(res => res.data);

// 脚本保存
export const scriptSave = params =>
    fetch({
        url: '/api/script/save',
        method: 'POST',
        params,
    }).then(res => res.data);

export const scriptDelete = params =>
    fetch({
        url: '/api/script/delete',
        method: 'POST',
        params,
    }).then(res => res.data);

// 一键打通ssh
export const scriptOpenSSH = params =>
    fetch({
        url: '/api/script/open-ssh',
        method: 'post',
        params,
    }).then(res => res.data);

// 初始化目录
export const initDir = params =>
    fetch({
        url: '/api/script/init-dir',
        method: 'post',
        params,
    }).then(res => res.data);
