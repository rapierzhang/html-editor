const fs = require('fs');
const path = require('path');
const utils = require('../utils/index');
const db = require('../module/database');
const PageModule = require('../module/page');
const ListModule = require('../module/list');

exports.pageGet = async (ctx, next) => {
    let { pid } = ctx.request.body;
    const result = await PageModule.findOne({ pid });
    console.log(pid, result)
    if (result) {
        ctx.body = utils.res(200, 'ok', result);
    } else {
        pid = utils.uuid();
        ctx.body = utils.res(200, 'ok', { pid });
    }
};

exports.pageSave = async (ctx, next) => {
    let { pid, title, desc, htmlTree, preview } = ctx.request.body;
    const time = utils.dateFormat(new Date().getTime());
    let pageResult = false;
    let listResult = false;
    let msg = '';
    if (pid) {
        console.error('有数据');
        try {
            pageResult = await PageModule.update(
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
            listResult = await ListModule.update(
                { pid },
                {
                    $set: {
                        title,
                        desc,
                        preview,
                    },
                },
            );
        } catch (e) {
            msg = e;
        }
    } else {
        console.error('无数据');
        pid = utils.uuid();
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

exports.pageBuild = async (ctx, next) => {
    const result = await PageModule.findOne({ pid: ctx.query.pid });
    if (!result) {
        ctx.body = utils.res(500, 'no data', {});
        return;
    }
    const { pid, htmlTree } = result;
    const dirPath = `${path.resolve('./')}/public/html/${pid}`;
    // 判断目录存在
    const dirExists = fs.existsSync(dirPath);
    // 创建新目录
    if (!dirExists) fs.mkdirSync(dirPath);

    writeHtml(dirPath, result, next);
    writeCss(dirPath, htmlTree, next);
    writeJs(dirPath, htmlTree, next);

    ctx.body = utils.res(200, 'ok', {
        result: true,
    });
};

exports.pageDelete = async (ctx, next) => {};

exports.pageRelease = async (ctx, next) => {};

const dataIsExist = async (mod, data) => !!(await mod.findOne(data));

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
    const { pid, title, htmlTree } = data;
    let html = renderHtml(htmlTree);
    const htmlContext = defaultHtml(pid, title, html);
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
                cssContent += `${utils.toLine(key)}: ${pxToRem(css[key])};`;
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

const pxToRem = text => {
    if (text.search(/[0-9]px/) > -1) {
        return ((parseInt(text) * 2) / 45).toFixed(6) + 'rem';
    } else {
        return text;
    }
};

// 默认html
const defaultHtml = (pid, title = '', text = '') => {
    return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width,initial-scale=1,user-scalable=no" name="viewport" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="format-detection" content="telephone=no,address=no" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <title>${title}</title>
        <link rel="stylesheet" href="./${pid}/css/index.css" />
        <script>
            !(function(x) {
                function w() {
                    let v,
                        u,
                        s = x.document,
                        r = s.documentElement,
                        a = r.getBoundingClientRect().width;
                    if (!v && !u) {
                        var n = !!x.navigator.appVersion.match(/AppleWebKit.*Mobile.*/);
                        v = x.devicePixelRatio;
                        (v = n ? v : 1), (u = 1 / v);
                    }
                    if (a >= 640) {
                        r.style.fontSize = '40px';
                    } else {
                        if (a <= 320) {
                            r.style.fontSize = '20px';
                        } else {
                            r.style.fontSize = (a / 320) * 20 + 'px';
                        }
                    }
                }
                x.addEventListener('resize', () => w());
                w();
            })(window);
        </script>
    </head>
    <body>
        <div class="container">
            ${text}
        </div>
        <script src="https://cdn.bootcss.com/jquery/3.5.0/jquery.js"></script>
        <script src="./${pid}/js/index.js"></script>
    </body>
</html>`;
};

// 默认css
const defaultCss = () => {
    return `* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    outline: none;
    max-width: 100%;
}

body {
    background: #f5f5f5;
}

@media screen and (min-width: 640px) {
    .container {
        width: 375px;
        margin: 0 auto;
    }
}
`;
};
