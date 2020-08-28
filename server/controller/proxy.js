import axios from 'axios';
import FormData from 'form-data';
import path from 'path';
import fs from 'fs';

export const getProxy = async (ctx, next) => {
    const { proxyUrl } = ctx.query;
    let data = {
        params: { ...ctx.query, proxyUrl: null },
    };
    await axios
        .get(proxyUrl, data)
        .then(res => {
            ctx.body = res.data;
        })
        .catch(err => {
            ctx.body = err.data;
        });
};

// TODO 图片转发有问题
export const postProxy = async (ctx, next) => {
    const { files, body, headers } = ctx.request;
    const { proxyUrl } = body;
    let data;
    let config = {
        headers,
    };
    console.log('-------------------------------------------------')

    if (files) {
        let formData = new FormData();
        for (let key in body) {
            formData.append(key, body[key]);
        }

        for (let key in files) {
            const item = files[key];
            const { path } = item;
            const file = fs.createReadStream(path);
            formData.append(key, file)
        }

        data = formData;
    } else {
        data = body;
        delete data.proxyUrl;
    }

    await axios
        .post(proxyUrl, data, config)
        .then(res => {
            ctx.body = res.data;
        })
        .catch(err => {
            ctx.body = err.data;
        });

};
