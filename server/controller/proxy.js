const axios = require('axios');

exports.getProxy = async (ctx, next) => {
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

exports.postProxy = async (ctx, next) => {
    const { proxyUrl } = ctx.request.body;
    let data = { ...ctx.request.body };
    delete data.proxyUrl;

    await axios
        .post(proxyUrl, data)
        .then(res => {
            ctx.body = res.data;
        })
        .catch(err => {
            ctx.body = err.data;
        });
};
