const utils = require('../utils/index');
const axios = require('axios');

exports.getProxy = async (ctx, next) => {
    const { proxyUrl } = ctx.query;
    let data = { ...ctx.query };
    delete data.proxyUrl;
    await axios
        .get(proxyUrl, data)
        .then(res => {
            ctx.body = res.data;
        })
        .catch(err => {
            console.log(222, err);
            ctx.body = err.data;
        });
};

exports.postProxy = async (ctx, next) => {};
