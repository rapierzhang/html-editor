import utils from '../utils/index';
import { ComponentModule, ComponentListModule } from '../model';

// 模板信息获取
export const componentGet = async (ctx, next) => {
    let { pid } = ctx.request.body;
    const result = await ComponentModule.findOne({ pid }, { _id: 0, __v: 0 });
    if (result) {
        ctx.body = utils.res(200, 'ok', result);
    } else {
        pid = utils.uuid();
        ctx.body = utils.res(200, 'ok', { pid });
    }
};

// 模板信息保存
export const componentSave = async (ctx, next) => {
    let { pid, title, desc, htmlTree } = ctx.request.body;
    const time = new Date().getTime();
    let pageResult = false;
    let listResult = false;
    let msg = '';
    const result = await ComponentModule.findOne({ pid });
    if (result) {
        console.error('有数据 修改');
        try {
            pageResult = await ComponentModule.updateOne(
                { pid },
                {
                    $set: {
                        title,
                        desc,
                        htmlTree,
                        updateTime: time,
                    },
                },
            );
            listResult = await ComponentListModule.updateOne(
                { pid },
                {
                    $set: {
                        title,
                        desc,
                        updateTime: time,
                    },
                },
            );
        } catch (e) {
            msg = e;
        }
    } else {
        console.error('无数据 新建');
        const _page = new ComponentModule({
            pid,
            title,
            desc,
            htmlTree,
            createTime: time,
            updateTime: time,
        });
        const _list = new ComponentListModule({
            pid,
            title,
            desc,
            createTime: time,
            updateTime: time,
        });

        try {
            pageResult = await _page.save();
            listResult = await _list.save();
        } catch (e) {
            msg = e;
        }
    }

    if (!!pageResult && !!listResult) {
        ctx.body = utils.res(200, 'ok', { result: true });
    } else {
        ctx.body = utils.res(500, msg, {});
    }
};

// 模板列表获取
export const componentlist = async (ctx, next) => {
    let { pn = 1, ps = 1, text = '' } = ctx.query;
    if (typeof pn !== 'number') pn = parseInt(pn);
    if (typeof ps !== 'number') ps = parseInt(ps);
    pn = pn - 1;
    const regexp = new RegExp(text);
    const condition = text
        ? {
              $or: [{ title: { $regex: regexp } }, { desc: { $regex: regexp } }],
          }
        : {};
    const pageList = await ComponentListModule.find(condition, { _id: 0, __v: 0 })
        .limit(ps)
        .skip(pn * ps)
        .sort({ createTime: -1 });
    const totalCount = await ComponentListModule.find(condition).countDocuments();
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
