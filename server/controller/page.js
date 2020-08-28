import fs from 'fs';
import path from 'path';
import process from 'child_process';
import compressing from 'compressing';
import axios from 'axios';
import utils from '../utils/index';
import { PageModule, ListModule, ScriptModel } from '../model';
import { writeHtml, writeCss, writeJs, mkdirImage } from './io-handle';
import { domain } from '../config/domain.config';

const name = (pid, direName) => direName ? direName : pid;

// 页面信息获取
export const pageGet = async (ctx, next) => {
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
export const pageSave = async (ctx, next) => {
    let { pid, title, desc, htmlTree, preview } = ctx.request.body;
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
export const pageBuild = async (ctx, next) => {
    const { pid } = ctx.request.body;
    const result = await PageModule.findOne({ pid });
    if (!result) {
        ctx.body = utils.res(3001, 'no data', {});
        return;
    }
    const { htmlTree, dirName } = result;
    const dirPath = `${path.resolve('./')}/server/public/html/${name(pid, dirName)}`;
    // 判断目录存在
    const dirExists = fs.existsSync(dirPath);
    // 创建新目录
    if (!dirExists) fs.mkdirSync(dirPath);
    const time1 = new Date().getTime();
    writeHtml(dirPath, result);
    const time2 = new Date().getTime();
    console.log('html: ', time2 - time1);
    writeCss(dirPath, htmlTree);
    const time3 = new Date().getTime();
    console.log('css: ', time3 - time2);
    writeJs(dirPath, htmlTree);
    const time4 = new Date().getTime();
    console.log('js: ', time4 - time3);
    mkdirImage(dirPath);
    const time5 = new Date().getTime();
    console.log('image: ', time5 - time4);
    process.execSync(`gulp build -f ${path.resolve('./')}/server/shell/gulpfile.js --pid ${name(pid, dirName)}`);
    const time6 = new Date().getTime();
    console.log('gulp: ', time6 - time5);

    ctx.body = utils.res(200, 'ok', {
        result: true,
    });
};

// 打开构建好的页面
export const pageOpen = async (ctx, next) => {
    const { pid } = ctx.request.body;
    const result = await PageModule.findOne({ pid });
    if (result) {
        const { dirName } = result;
        ctx.body = utils.res(200, 'ok', {
            url: `${domain}/html/${name(pid, dirName)}/index.html`,
        });
    } else {
        ctx.body = utils.res(500, '无此页面', {});
    }
};

// 页面删除
export const pageDelete = async (ctx, next) => {
    const { pid } = ctx.request.body;
    const result = await PageModule.findOne({ pid });
    const { dirName } = result;
    const resultPage = await PageModule.deleteOne({ pid });
    const resultList = await ListModule.deleteOne({ pid });

    const dirPath = `${path.resolve('./')}/server/public/html/${name(pid, dirName)}`;
    // 删除生成目录
    utils.delFile(dirPath);
    // 删除生成文件
    try {
        fs.unlinkSync(`${path.resolve('./')}/server/public/preview/${pid}.jpg`);
    } catch (e) {}

    if (resultPage.ok === 1 && resultList.ok === 1) {
        ctx.body = utils.res(200, 'ok', { result: true });
    } else {
        ctx.body = utils.res(500, '删除失败', { result: false });
    }
};

// 页面发布
export const pageRelease = async (ctx, next) => {
    const { pid, sid } = ctx.request.body;
    const result = await PageModule.findOne({ pid });
    const { dirName } = result;
    const scriptResult = await ScriptModel.findOne({ sid }, { _id: 0, __v: 0 });
    const { host, username, deployPath, modelType } = scriptResult;
    if (modelType === 'script') {
        process.execFileSync(`${path.resolve('./')}/server/shell/release/${sid}.sh`, [name(pid, dirName)]);
        ctx.body = utils.res(200, 'ok', { result: true });
    } else {
        const dirPath = `${path.resolve('./')}/server/public/html/${name(pid, dirName)}`;
        const dirExists = fs.existsSync(dirPath);
        if (dirExists) {
            process.execFileSync(`${path.resolve('./')}/server/shell/rsync.sh`, [
                dirPath,
                username,
                host,
                `${deployPath}/html`,
            ]);
            ctx.body = utils.res(200, 'ok', { result: true });
        } else {
            ctx.body = utils.res(500, '无此页面，请先生成后再发布', {});
        }
    }
};

// 页面下载
export const pageDownload = async (ctx, next) => {
    const { pid } = ctx.request.body;
    const result = await PageModule.findOne({ pid });
    const { dirName } = result;
    const publicPath = `${path.resolve('./')}/server/public`;
    const dirPath = `${publicPath}/html/${name(pid, dirName)}`;
    const dirExists = fs.existsSync(dirPath);
    if (dirExists) {
        const zipPath = `${publicPath}/zip/${name(pid, dirName)}.zip`;
        const publicZipPath = `${domain}/zip/${name(pid, dirName)}.zip`;
        // 打包文件夹
        await compressing.zip.compressDir(dirPath, zipPath)
            .then(() => {
                ctx.body = utils.res(200, 'ok', { url: publicZipPath });
            })
            .catch(err => {
                console.error('打包失败：', err);
                ctx.body = utils.res(500, '打包失败', {});
            });
    } else {
        ctx.body = utils.res(500, '无此页面，请先生成后再下载', {});
    }
}

// 处理iconfont
export const iconSave = async (ctx, next) => {
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

// 保存文件名
export const dirNameSave = async (ctx, next) => {
    let { pid, dirName } = ctx.request.body;
    const result = await PageModule.findOne({ pid });
    let oldDirName = name(pid, result.dirName);
    const publicPath = `${path.resolve('./')}/server/public/html/`;
    // 老路径是否存在
    const dirExists = fs.existsSync(`${publicPath}${oldDirName}`);
    // 数据库更新
    const pageResult = await PageModule.updateOne({ pid }, { $set: { dirName } });
    if (dirExists) {
        // 重命名文件夹
        const renameErr = await fs.renameSync(`${publicPath}${oldDirName}`, `${publicPath}${name(pid, dirName)}`);
        if (renameErr) {
            ctx.body = utils.res(500, 'rename err', {});
        }
    }

    if (pageResult) {
        ctx.body = utils.res(200, 'ok', { result: true });
    } else {
        ctx.body = utils.res(500, 'update err', {});
    }
}
