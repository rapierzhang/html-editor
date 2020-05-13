const utils = require('../utils/index');
const ListModule = require('../module/list');

exports.listGet = async (ctx, next) => {
    let { pn = 0, ps = 1, text = '' } = ctx.request.body;
    pn = pn - 1;
    const regexp = new RegExp(text);
    const condition = text
        ? {
              $or: [{ title: { $regex: regexp } }, { desc: { $regex: regexp } }],
          }
        : {};
    const pageList = await ListModule.find(condition, { _id: 0, __v: 0 })
        .limit(ps)
        .skip(pn * ps)
        .sort({ createTime: -1 });
    const totalCount = await ListModule.find(condition).count();
    const totalPage = Math.ceil(totalCount / ps);

    const result = {
        pageList,
        pageNo: pn + 1,
        pageSize: ps,
        totalCount,
        totalPage,
    };
    ctx.body = utils.res(200, 'ok', result);
};
