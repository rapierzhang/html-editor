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
                bindJs: [
                    {
                        type: 'click',
                        func: `alert(111)`,
                    },
                    {
                        type: 'mouseover',
                        func: `alert(333)`,
                    },
                ],
                defaultJs: '',
                extraJs: '',
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
            H: {
                element: 'image',
                key: 'H',
                src: '//www.baidu.com/img/bd_logo1.png',
                css: {
                    backgroundColor: '#f5f5f5',
                    fontSize: '28px',
                    color: 'red',
                },
                defaultJs: `
setTimeout(() => {
    alert(222);
}, 1000)`,
            },
        },
    };
    const { index, htmlTree } = data;
    const dirPath = `${path.resolve('./')}/public/html/${index}`;
    // 判断目录存在
    const dirExists = fs.existsSync(dirPath);
    // 创建新目录
    if (!dirExists) fs.mkdirSync(dirPath);

    writeHtml(dirPath, data, next);
    writeCss(dirPath, htmlTree, next);
    writeJs(dirPath, htmlTree, next);

    ctx.body = utils.res(200, 'ok', {
        result: true,
    });
};

// 写入js
const writeJs = (dirPath, htmlTree, next) => {
    const jsDirPath = `${dirPath}/js`;
    const jsDirExists = fs.existsSync(jsDirPath);
    if (!jsDirExists) fs.mkdirSync(jsDirPath);
    let jsContext = '';
    const jsArr = utils.objToArr(htmlTree);
    jsArr.forEach(item => {
        const { key, bindJs, defaultJs, extraJs } = item;
        // 绑定事件
        if (bindJs) {
            jsContext += `const ele${utils.delLine(key)} = $('#${key}');`;
            bindJs.map(row => {
                jsContext += `
ele${utils.delLine(key)}.on('${row.type}', () => {
    ${row.func}
});`;
            });
        }
        // 默认组件js
        if (defaultJs) {
            jsContext += defaultJs;
        }
        // 扩展js
        if (extraJs) {
            jsContext += defaultJs;
        }
        // 空行
        if (bindJs || defaultJs || extraJs) {
            jsContext += `
`;
        }
    });
    fs.writeFileSync(`${jsDirPath}/index.js`, jsContext);
};

// 写入HTML
const writeHtml = (dirPath, data, next) => {
    const { title, htmlTree } = data;
    let html = renderHtml(htmlTree);
    const htmlContext = defaultHtml(title, html);
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
            html += `<${element} id='${key}' class='${key}' ${renderAttribute(item)}/>`;
        } else if (labelType === 2) {
            html += `<${element} id='${key}' class='${key}' ${renderAttribute(item)}>
                ${renderTab(floor)}${children ? renderHtml(children, floor + 1) : text}
            ${renderTab(floor)}</${element}>`;
        } else {
            console.log('------ 无此标签 ------');
        }
        idx++;
    }
    return html;
};

// 渲染缩进
const renderTab = num => {
    let str = '';
    for (let i = num; i > 0; i--) {
        str += '    ';
    }
    return str;
};

// 渲染属性
const renderAttribute = data => {
    let str = '';
    for (let k in data) {
        if (['key', 'element', 'children', 'css', 'style', 'text', 'bindJs', 'defaultJs', 'extraJs'].indexOf(k) > -1) {
            continue;
        } else {
            str += `${k}='${data[k]}'`;
        }
    }
    return str;
};

// 写入css
const writeCss = (dirPath, htmlTree, next) => {
    const cssDirPath = `${dirPath}/css`;
    const cssDirExists = fs.existsSync(cssDirPath);
    if (!cssDirExists) fs.mkdirSync(cssDirPath);
    let cssContext = defaultCss();
    const cssArr = utils.objToArr(htmlTree);
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
const defaultHtml = (title = '', text = '') => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta 
            name="viewport"
            content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <meta name="format-detection" content="telephone=no" />
        <title>${title}</title>
        <link rel="stylesheet" href="./css/index.css" />
    </head>
    <body>
        <div>
            ${text}
        </div>
        <script src="https://cdn.bootcss.com/jquery/3.5.0/jquery.js"></script>
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
