const fs = require('fs');
const path = require('path');
const utils = require('../utils/index');

exports.fileUpload = async (ctx, next) => {
    const { files, body } = ctx.request;
    const { pid } = body;
    const { path: sourceFile } = files['file'];
    const imageName = path.basename(sourceFile).replace(/upload_/g, '');
    const dirPath = `${path.resolve('./')}/public/html/${pid}`;
    const dirExists = fs.existsSync(dirPath);
    // 判断之前是否生成过代码目录
    if (!dirExists) {
        ctx.body = utils.res(3001, 'no file');
        return;
    }
    const imageDirPath = `${dirPath}/image`;
    const destFile = `${imageDirPath}/${imageName}`;
    // 移动文件
    const err = await fs.renameSync(sourceFile, destFile);
    if (err) {
        ctx.body = utils.res(3002, 'move fail');
    } else {
        ctx.body = utils.res(200, 'ok', {
            url: `http://localhost:3000/html/${pid}/image/${imageName}`,
        });
    }
};

exports.listPreviewSave = async (ctx, next) => {
    const { files, body } = ctx.request;
    const { pid } = body;
    const { path: sourceFile } = files['file'];
    const dirPath = `${path.resolve('./')}/public/preview`;
    const dirExists = fs.existsSync(dirPath);
    // 判断之前是否生成过代码目录
  if (!dirExists) fs.mkdirSync(dirPath);

  const imageName = `${pid}.jpg`;
  const destFile = `${dirPath}/${imageName}`;
    // 移动文件
    const err = await fs.renameSync(sourceFile, destFile);
    if (err) {
        ctx.body = utils.res(403, 'move fail');
    } else {
        ctx.body = utils.res(200, 'ok', {
            url: `http://localhost:3000/preview/${imageName}`,
        });
    }
};
