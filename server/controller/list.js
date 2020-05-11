const utils = require('../utils/index');
const ListModule = require('../module/list');

exports.listGet = async (ctx, next) => {
    let { pn = 0, ps = 1 } = ctx.request.body;
    pn = pn - 1;
    const result = await ListModule.find({}, { _id: 0, __v: 0 })
        .limit(ps)
        .skip(pn * ps);
    ctx.body = utils.res(200, 'ok', result);
};
