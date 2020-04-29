const fs = require('fs');
const path = require('path');
const utils = require('../utils/index');
const PageModule = require('../module/page');
const ListModule = require('../module/list');
const process = require('child_process');

// 页面信息获取
exports.pageGet = async (ctx, next) => {
    let { pid } = ctx.request.body;
    const result = await PageModule.findOne({ pid });
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
    const time = utils.dateFormat(new Date().getTime());
    let pageResult = false;
    let listResult = false;
    let msg = '';
    const result = await PageModule.findOne({ pid });
    if (result) {
        console.error('有数据 修改');
        try {
            pageResult = await PageModule.update(
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
        });

        try {
            pageResult = await _page.save();
            listResult = await _list.save();
        } catch (e) {
            msg = e;
        }
    }
    console.error(pageResult);

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
        ctx.body = utils.res(500, 'no data', {});
        return;
    }
    const { htmlTree } = result;
    const dirPath = `${path.resolve('./')}/public/html/${pid}`;
    // 判断目录存在
    const dirExists = fs.existsSync(dirPath);
    // 创建新目录
    if (!dirExists) fs.mkdirSync(dirPath);

    writeHtml(dirPath, result);
    writeCss(dirPath, htmlTree);
    writeJs(dirPath, htmlTree);
    mkdirImage(dirPath);
    // 执行格式化命令
    process.execFileSync(`${path.resolve('./')}/shell/format.sh`, [pid]);

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
exports.pageDelete = async (ctx, next) => {};
// 页面发布
exports.pageRelease = async (ctx, next) => {};

const dataIsExist = async (mod, data) => !!(await mod.findOne(data));

// 图片目录
const mkdirImage = dirPath => {
    const imgDirPath = `${dirPath}/image`;
    const jsDirExists = fs.existsSync(imgDirPath);
    if (!jsDirExists) fs.mkdirSync(imgDirPath);
};

// 写入js
const writeJs = (dirPath, htmlTree) => {
    const jsDirPath = `${dirPath}/js`;
    const jsDirExists = fs.existsSync(jsDirPath);
    if (!jsDirExists) fs.mkdirSync(jsDirPath);
    let jsContext = '';
    const jsArr = utils.objToArr(htmlTree);
    jsArr.forEach(item => {
        const { id, bindJs, defaultJs, extraJs } = item;
        // 绑定事件
        if (bindJs) {
            jsContext += `const ele${utils.delLine(id)} = $('#${id}');`;
            bindJs.map(row => {
                jsContext += `
                    ele${utils.delLine(id)}.on('${row.type}', () => {
                        ${row.func}
                    });
                `;
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
const writeHtml = (dirPath, data) => {
    const { pid, title, htmlTree } = data;
    let html = renderHtml(htmlTree);
    const htmlContext = defaultHtml(pid, title, html);
    fs.writeFileSync(`${dirPath}/index.html`, htmlContext);
};

// 渲染html

const renderHtml = htmlTree => {
    let html = ``;
    for (let key in htmlTree) {
        html += renderElement(htmlTree[key]);
    }
    return html;
};

const renderElement = data => {
    const { id, element, children } = data;
    switch (element) {
        case 'View':
            return `
                <div id='${id}' class='view ${id}' ${renderAttribute(data)}>
                    ${children && renderHtml(children)}
                </div>
                `;
        case 'ScrollView':
            return `
                <div id='${id}' class='scroll-view ${id}' ${renderAttribute(data)}>
                    ${children && renderHtml(children)}
                </div>
                `;
        case 'Swiper':
            return `
                <div id='${id}' class='swiper ${id}' ${renderAttribute(data)}>
                    ${children && renderHtml(children)}
                </div>
                `;
        case 'Text':
            const textList = data.text.split('\n');
            return textList.length > 0
                ? `<span id='${id}' class='text ${id}'>
                    ${textList.map((row, idx) => `<span class='text-row'>${row}</span>`).join('')}
                </span>`
                : `<span id='${id}' class='text ${id}'>
                    ${data.text}
                </span>`;
        case 'Icon':
            return `
                <i id='${id}' class='icon ${id}'>${data.text}</i>
                `;
        case 'Input':
            return `
                <input id='${id}' class='input ${id}' ${renderAttribute(data)} />
                `;
        case 'Textarea':
            return `
                <textarea id='${id}' class='textarea ${id}' ${renderAttribute(data)} ></textarea>
                `;
        case 'CheckBox':
            return ``;
        case 'Radio':
            return ``;
        case 'Select':
            return ``;
        case 'UploadFile':
            return ``;
        case 'Audio':
            return `
                <audio id='${id}' class='audio ${id}' ${renderAttribute(data)} ></audio>
                `;
        case 'Video':
            return `
                <video id='${id}' class='video ${id}' ${renderAttribute(data)} ></video>
                `;
        case 'Image':
            return `
                <img id='${id}' class='image ${id}' ${renderAttribute(data)} />
                `;
        default:
            return '';
    }
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
const writeCss = (dirPath, htmlTree) => {
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
                    cssContent += ``;
                }
            }
            const cssItem = `.${item.id} {${cssContent}}`;
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
    return `
<!DOCTYPE html>
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
        min-height: 1px;
        position: relative;
    }
}

.text {
    display: inline-block;
}

.text-row {
    display: block;
}

.icon {
    display: inline-block;
}
`;
};
