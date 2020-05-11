const utils = require('../utils/index');
const ListModule = require('../module/list');

exports.listGet = async (ctx, next) => {
    const { pn = '0', ps = '1' } = ctx.query;
    const pageNum = parseInt(pn) - 1;
    const pageSize = parseInt(ps);
    const result = await ListModule.find({}, { _id: 0, __v: 0 })
        .limit(pageNum)
        .skip(pageNum * pageSize);
    console.log(result);
    ctx.body = utils.res(200, 'ok', result);
};
