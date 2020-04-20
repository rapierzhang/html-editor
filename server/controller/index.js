const fs = require('fs');
const path = require('path');
const utils = require('../utils/index');

exports.save = async (ctx, next) => {};

exports.build = async (ctx, next) => {
    const data = {
        title: '测试',
        index: 'alsdjkladajkdalk',
        data: {
            A: {
                element: 'div',
                key: 'A',
                text: '1111',
                css: {
                    backgroundColor: '#f5f5f5',
                    fontSize: '28px',
                    color: 'red',
                },
            },
            B: {
                element: 'div',
                key: 'B',
                children: {
                    C: {
                        element: 'div',
                        key: 'C',
                        text: '3333',
                        css: {
                            backgroundColor: '#f5f5f5',
                            fontSize: '28px',
                            color: 'red',
                        },
                    },
                    D: {
                        element: 'div',
                        key: 'D',
                        children: {
                            E: {
                                element: 'div',
                                key: 'E',
                                text: '444',
                            },
                            F: {
                                element: 'div',
                                key: 'F',
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

    writeHtml(dirPath, data, next);
    writeCss(dirPath, data, next);

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
};

const writeCss = (dirPath, data, next) => {
    const cssDirPath = `${dirPath}/css`;
    const cssDirExists = fs.existsSync(cssDirPath);
    if (!cssDirExists) fs.mkdirSync(cssDirPath);
    let cssContext = '';
    const cssArr = utils.objToArr(data.data);
    // console.log('arr: ', cssArr);
    cssArr.forEach(item => {
        let cssContent = '';
        if (item.css) {
            const { css } = item;
            const cssLen = Object.keys(css).length;
            let cssRowIdx = 0;
            for (let key in css) {
                cssContent += `${utils.toLine(key)}: ${css[key]}; `;
                cssRowIdx++;
                if (cssRowIdx < cssLen) {
                    cssContent += ``;
                }
            }
            const cssItem = `.${item.key} { ${cssContent} }
`;
            cssContext += cssItem;
        }
    });
    console.log(cssContext);
};
