const fs = require('fs');
const path = require('path');
const utils = require('../utils/index');

exports.save = async (ctx, next) => {};

exports.build = async (ctx, next) => {
    const data = {
        title: '测试',
        index: 'alsdjkladajkdalk',
        htmlTree: {
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
            G: {
                element: 'image',
                key: 'G',
                src: '//www.baidu.com/img/bd_logo1.png',
                css: {
                    backgroundColor: '#f5f5f5',
                    fontSize: '28px',
                    color: 'red',
                },
            },
        },
    };
    const { index, htmlTree } = data;
    const dirPath = `${path.resolve('./')}/views/${index}`;
    console.log(`dirPath: `, dirPath);
    // 判断目录存在
    const dirExists = fs.existsSync(dirPath);
    // 创建新目录
    if (!dirExists) fs.mkdirSync(dirPath);

    writeHtml(dirPath, htmlTree, next);
    writeCss(dirPath, htmlTree, next);

    ctx.body = {
        title: 'koa2 json',
    };
};

// 写入HTML
const writeHtml = (dirPath, data, next) => {
    let html = renderHtml(data);
    const htmlContext = defaultHtml(html);
    fs.writeFileSync(`${dirPath}/index.html`, htmlContext);
};

// 渲染html
const renderHtml = (data, floor = 0) => {
    let html = ``;
    let idx = 0;
    for (let eleKey in data) {
        const item = data[eleKey];
        const { key, element, text, children } = item;
        const labelType = utils.labelJudge(element);
        if (idx > 0) {
            html += `
            ${renderTab(floor)}`;
        }
        if (labelType === 1) {
            html += `<${element} id='${key}' class='${key}' ${renderAttribute(item)} />`;
        } else if (labelType === 2) {
            html += `<${element} id='${key}' class='${key}' ${renderAttribute(item)} >
                ${renderTab(floor)}${children ? renderHtml(children, floor + 1) : text}
            ${renderTab(floor)}</${element}>`;
        } else {
            console.log('------ 无此标签 ------');
        }
        idx ++
    }
    return html;
};

const renderTab = num => {
    let str = '';
    for (let i = num; i > 0; i--) {
        str += '    ';
    }
    return str;
};

const renderAttribute = data => {
    let str = '';
    for (let k in data) {
        if (['key', 'element', 'children', 'css', 'style', 'text'].indexOf(k) > -1) {
            continue;
        } else {
            str += `${k}='${data[k]}'`;
        }
    }
    return str;
};

// 写入css
const writeCss = (dirPath, data, next) => {
    const cssDirPath = `${dirPath}/css`;
    const cssDirExists = fs.existsSync(cssDirPath);
    if (!cssDirExists) fs.mkdirSync(cssDirPath);
    let cssContext = defaultCss();
    const cssArr = utils.objToArr(data);
    cssArr.forEach(item => {
        let cssContent = '';
        const { css } = item;
        if (css) {
            const cssLen = Object.keys(css).length;
            let cssRowIdx = 0;
            for (let key in css) {
                cssContent += `${utils.toLine(key)}: ${css[key]};`;
                cssRowIdx++;
                if (cssRowIdx < cssLen) {
                    cssContent += `
    `;
                }
            }
            const cssItem = `
.${item.key} { 
    ${cssContent} 
}
`;
            cssContext += cssItem;
        }
    });
    fs.writeFileSync(`${cssDirPath}/index.css`, cssContext);
};

// 默认html
const defaultHtml = (text = '') => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <link rel="stylesheet" href="./css/index.css">
    </head>
    <body>
        <div>
            ${text}
        </div>
        <script src="./js/index.js"></script>
    </body>
</html>`;

// 默认css
const defaultCss = (text = '') => `* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    outline: none;
    ${text}
}
`;
