import fs from 'fs'
import path from 'path'
import utils from '../utils/index'
import { domain } from '../config/domain.config'

export const fileUpload = async (ctx, next) => {
    const { files, body } = ctx.request;
    const { pid } = body;
    const { path: sourceFile } = files['file'];
    const imageName = path.basename(sourceFile).replace(/upload_/g, '');
    const dirPath = `${path.resolve('./')}/server/public/html/${pid}`;
    const dirExists = fs.existsSync(dirPath);
    // 判断之前是否生成过代码目录
    if (!dirExists) {
        ctx.body = utils.res(3002, 'no file');
        return;
    }
    const imageDirPath = `${dirPath}/image`;
    const destFile = `${imageDirPath}/${imageName}`;
    // 移动文件
    const err = await fs.renameSync(sourceFile, destFile);
    if (err) {
        ctx.body = utils.res(3003, 'move fail');
    } else {
        ctx.body = utils.res(200, 'ok', {
            url: `${domain}/html/${pid}/image/${imageName}`,
        });
    }
};

export const listPreviewSave = async (ctx, next) => {
    const { files, body } = ctx.request;
    const { pid } = body;
    const { path: sourceFile } = files['file'];
    const dirPath = `${path.resolve('./')}/server/public/preview`;
    const dirExists = fs.existsSync(dirPath);
    // 判断之前是否生成过代码目录
    if (!dirExists) fs.mkdirSync(dirPath);

    const imageName = `${pid}.jpg`;
    const destFile = `${dirPath}/${imageName}`;
    // 移动文件
    const err = await fs.renameSync(sourceFile, destFile);
    if (err) {
        ctx.body = utils.res(3003, 'move fail');
    } else {
        ctx.body = utils.res(200, 'ok', {
            url: `${domain}/preview/${imageName}`,
        });
    }
};

export const fileUploadTest = async (ctx, next) => {
    const { body, files } = ctx.request;
    const { path: sourceFile } = files['file'];
    const imageName = path.basename(sourceFile).replace(/upload_/g, '');

    const dirPath = `${path.resolve('./')}/server/public/test`;
    const dirExists = fs.existsSync(dirPath);
    // 判断之前是否生成过代码目录
    if (!dirExists) fs.mkdirSync(dirPath);

    const destFile = `${dirPath}/${imageName}`;
    // 移动文件
    const err = await fs.renameSync(sourceFile, destFile);
    if (err) {
        ctx.body = utils.res(3003, 'move fail');
    } else {
        ctx.body = utils.res(200, 'ok', {
            url: `${domain}/test/${imageName}`,
        });
    }
};
