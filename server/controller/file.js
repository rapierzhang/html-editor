const fs = require('fs');
const path = require('path');
const utils = require('../utils/index');

exports.fileUpload = async (ctx, next) => {
    const { files, body } = ctx.request;
    const { pid } = body;
    const { path: sourceFile, name } = files['file'];
    const dirPath = `${path.resolve('./')}/public/html/${pid}`;
    const dirExists = fs.existsSync(dirPath);
    // 判断之前是否生成过代码目录
    if (!dirExists) {
        ctx.body = utils.res(403, 'no file');
        return;
    }
    const imageDirPath = `${dirPath}/image`;
    const destFile = `${imageDirPath}/${name}`;
    // 移动文件
    const ok = await fs.renameSync(sourceFile, destFile);
    if (!ok) {
        ctx.body = utils.res(403, 'move fail');
    } else {
        ctx.body = utils.res(200, 'ok', {
            url: `http://localhost:3000/html/${pid}/image/${name}`,
        });
    }
};
