const fs = require('fs');
const path = require('path');

exports.save = async (ctx, next) => {};

exports.build = async (ctx, next) => {
    const data = {
        title: '测试',
        index: 'alsdjkladajkdalk',
        data: {
            A: {
                element: 'div',
                key: 'A',
                className: 'A',
                id: 'A',
                text: '1111',
            },
            B: {
                element: 'div',
                key: 'B',
                className: 'B',
                id: 'B',
                children: {
                    C: {
                        element: 'div',
                        key: 'C',
                        className: 'C',
                        id: 'C',
                        text: '3333',
                    },
                    D: {
                        element: 'div',
                        key: 'D',
                        className: 'D',
                        id: 'D',
                        children: {
                            E: {
                                element: 'div',
                                key: 'E',
                                className: 'E',
                                id: 'E',
                                text: '444',
                            },
                            F: {
                                element: 'div',
                                key: 'F',
                                className: 'F',
                                id: 'F',
                                text: '555',
                            },
                        },
                    },
                },
            },
        },
    };
    const dirPath = `${path.resolve('./')}/views${data.index}`;
    console.log(222, dirPath);
    // 判断目录存在
    const dirExists = fs.existsSync(dirPath);
    // 创建新目录
    if (!dirExists) fs.mkdirSync(dirPath);

    writeHtml(dirPath, data,  next)

    ctx.body = {
        title: 'koa2 json',
    };
};

const writeHtml = (dirPath, data, next) => {
    const htmlData = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <link rel="stylesheet" href="./css/index.css">
    </head>
    <body>
    
    <script src="./js/index.js"></script>
    </body>
</html>`;
    fs.writeFileSync(`${dirPath}/index.html`, htmlData);
}

const writeCss = (dirPath, data, next) => {
    const cssDirPath = `${dirPath}/css`
    const cssDirExists = fs.existsSync(cssDirPath);
    if (!cssDirExists) fs.mkdirSync(cssDirPath);
    const css = '';
}
