const fs = require('fs');
const path = require('path');
const utils = require('../utils/index');
const PageModule = require('../module/page');
const ListModule = require('../module/list');
const process = require('child_process');
const io = require('./io-handle');
const axios = require('axios');
// 页面信息获取
exports.pageGet = async (ctx, next) => {
    let { pid } = ctx.request.body;
    const result = await PageModule.findOne({ pid }, { _id: 0, __v: 0 });
    if (result) {
        ctx.body = utils.res(200, 'ok', result);
    } else {
        pid = utils.uuid();
        ctx.body = utils.res(200, 'ok', { pid });
    }
};
// 页面信息保存
exports.pageSave = async (ctx, next) => {
    let { pid, index, title, desc, htmlTree, preview } = ctx.request.body;
    const time = new Date().getTime();
    let pageResult = false;
    let listResult = false;
    let msg = '';
    const result = await PageModule.findOne({ pid });
    if (result) {
        console.error('有数据 修改');
        try {
            pageResult = await PageModule.updateOne(
                { pid },
                {
                    $set: {
                        index,
                        title,
                        desc,
                        htmlTree,
                        updateTime: time,
                    },
                },
            );
            listResult = await ListModule.updateOne(
                { pid },
                {
                    $set: {
                        title,
                        desc,
                        preview,
                        updateTime: time,
                    },
                },
            );
        } catch (e) {
            msg = e;
        }
    } else {
        console.error('无数据 新建');
        const _page = new PageModule({
            pid,
            index,
            title,
            desc,
            htmlTree,
            createTime: time,
            updateTime: time,
        });
        const _list = new ListModule({
            pid,
            title,
            desc,
            preview,
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
// 页面构建
exports.pageBuild = async (ctx, next) => {
    const { pid } = ctx.request.body;
    const result = await PageModule.findOne({ pid });
    if (!result) {
        ctx.body = utils.res(3001, 'no data', {});
        return;
    }
    const { htmlTree } = result;
    const dirPath = `${path.resolve('./')}/public/html/${pid}`;
    // 判断目录存在
    const dirExists = fs.existsSync(dirPath);
    // 创建新目录
    if (!dirExists) fs.mkdirSync(dirPath);

    io.writeHtml(dirPath, result);
    io.writeCss(dirPath, htmlTree);
    io.writeJs(dirPath, htmlTree);
    io.mkdirImage(dirPath);
    // 执行格式化命令
    process.execFileSync(`${path.resolve('./')}/shell/format.sh`, [dirPath]);

    ctx.body = utils.res(200, 'ok', {
        result: true,
    });
};
// 打开构建好的页面
exports.pageOpen = async (ctx, next) => {
    const { pid } = ctx.request.body;
    const result = await PageModule.findOne({ pid });
    if (result) {
        ctx.body = utils.res(200, 'ok', {
            url: `http://localhost:3000/html/${pid}`, // ^^^^^^
        });
    } else {
        ctx.body = utils.res(500, '无此页面', {});
    }
};
// 页面删除
exports.pageDelete = async (ctx, next) => {
    const { pid } = ctx.request.body;
    const resultPage = await PageModule.deleteOne({ pid });
    const resultList = await ListModule.deleteOne({ pid });

    const dirPath = `${path.resolve('./')}/public/html/${pid}`;
    // 删除生成目录
    utils.delFile(dirPath);
    // 删除生成文件
    fs.unlinkSync(`${path.resolve('./')}/public/preview/${pid}.jpg`);

    if (resultPage.ok === 1 && resultList.ok === 1) {
        ctx.body = utils.res(200, 'ok', { result: true });
    } else {
        ctx.body = utils.res(500, '删除失败', { result: false });
    }
};
// 页面发布
exports.pageRelease = async (ctx, next) => {
    const { pid } = ctx.request.body;
    const dirPath = `${path.resolve('./')}/public/html/${pid}`;
    // 判断目录存在
    const dirExists = fs.existsSync(dirPath);
    if (dirExists) {
        process.execFileSync(`${path.resolve('./')}/shell/release.sh`, [dirPath]);
        ctx.body = utils.res(200, 'ok', { result: true });
    } else {
        ctx.body = utils.res(500, '无此页面，请先生成后再发布', {});
    }
};
// 处理iconfont
exports.iconSave = async (ctx, next) => {
    let { pid, iconfontUrl } = ctx.request.body;
    iconfontUrl = iconfontUrl.replace(/.*\/\//, 'https://');
    let iconList = [];

    await axios
        .get(iconfontUrl)
        .then(async res => {
            const str = res.data;
            let cssMap = [...(str.match(/icon(.*)\:before/g) || [])];
            cssMap.forEach(item => iconList.push(item.replace(':before', '')));

            const pageResult = await PageModule.updateOne({ pid }, { $set: { iconfontUrl, iconList } });

            if (pageResult) {
                ctx.body = utils.res(200, 'ok', { pid, iconfontUrl, iconList });
            } else {
                ctx.body = utils.res(500, 'update err', {});
            }
        })
        .catch(err => {
            ctx.body = utils.res(500, 'fetch err', err);
        });
};
