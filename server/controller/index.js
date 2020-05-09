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
    process.execFileSync(`${path.resolve('./')}/shell/format.sh`, [dirPath]);

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
exports.pageRelease = async (ctx, next) => {
    const { pid } = ctx.request.body;
    const dirPath = `${path.resolve('./')}/public/html/${pid}`;
    // 判断目录存在
    const dirExists = fs.existsSync(dirPath);
    if (dirExists) {
        process.execFileSync(`${path.resolve('./')}/shell/release.sh`, [dirPath]);
        ctx.body = utils.res(200, 'ok', { result: true });
    } else {
        ctx.body = utils.res(500, '无此页面，请先生成后再发布', {});
    }
};

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
    jsContext += defaultJavascript;
    const jsArr = utils.objToArr(htmlTree);
    jsArr.forEach(item => {
        const { id, initJs, bindJs, bindType, defaultJs, extraJs } = item;
        // 初始化js
        if (initJs) {
            jsContext += initJs;
        }
        // 默认组件js
        if (defaultJs) {
            jsContext += defaultJs;
        }
        // 绑定事件
        if (bindJs) {
            jsContext += `const ele${utils.delLine(id)} = $('#${id}');`;
            jsContext += `
                ele${utils.delLine(id)}.on('${bindType}', () => {
                        ${bindJs}
                    });`;
        }
        // 扩展js
        if (extraJs) {
            jsContext += extraJs;
        }
        // 空行
        if (initJs || bindJs || defaultJs || extraJs) {
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
    let html = '';
    for (let key in htmlTree) {
        html += renderElement(htmlTree[key]);
    }
    return html;
};

const renderElement = data => {
    const { id, element, children, name, label } = data;
    switch (element) {
        case 'Root':
            return `
                <div id='${id}' class='root ${id}' ${renderAttribute(data)}>
                    ${children ? renderHtml(children) : ''}
                </div>
                `;
        case 'View':
            return `
                <div id='${id}' class='element view ${id}' ${renderAttribute(data)}>
                    ${children ? renderHtml(children) : ''}
                </div>
                `;
        case 'ScrollView':
            return `
                <div id='${id}' class='element scroll-view ${id}' ${renderAttribute(data)}>
                    ${children ? renderHtml(children) : ''}
                </div>
                `;
        case 'Swiper':
            return `
                <div id='${id}' class='element swiper swiper-container ${id}' ${renderAttribute(data)}>
                    <div class='swiper-wrapper'>
                        ${data.list.map(
                            url =>
                                `<div class='swiper-slide'>
                                     <img class='swiper-image' src='${url}'/>
                                 </div>`,
                        )}
                    </div>
                    <div class='swiper-pagination'></div>
                </div>
                `;

        case 'Link':
            return `
                <a id='${id}' class='element link ${id}' ${renderAttribute(data)}>
                    ${children && renderHtml(children)}
                </a>
                `;
        case 'Text':
            const textList = data.text.split('\n');
            return textList.length > 1
                ? `<span id='${id}' class='element text ${id}'>
                    ${textList.map((row, idx) => `<span class='text-row'>${row}</span>`).join('')}
                </span>`
                : `<span id='${id}' class='element text ${id}'>
                    ${data.text}
                </span>`;
        case 'Icon':
            return `<i id='${id}' class='element icon ${id}'>${data.text}</i>`;

        case 'Form':
            return `
                <div id='${id}' class='element form ${id}' ${renderAttribute(data)}>
                    ${children ? renderHtml(children) : ''}
                </div>
            `;
        case 'Input':
            return `<input id='${id}' class='element input ${id}' ${renderAttribute(data)} />`;
        case 'Textarea':
            return `
                <textarea id='${id}' class='element textarea ${id}' ${renderAttribute(data)} ></textarea>
                `;
        case 'Radio':
            return `
                <span class='element radio ${id}'>
                    <input id="${id}" type='radio' value="${label}" ${renderAttribute(data)} />
                    <span class='radio-label'>${label}</span>
                </span>
            `;
        case 'Checkbox':
            return `
                <span class='element checkbox ${id}'>
                    <input id="${id}" type='checkbox' value="${label}" ${renderAttribute(data)} />
                    <span class='checkbox-label'>${label}</span>
                </span>
            `;
        case 'Select':
            return ``;
        case 'Upload':
            return `
                <div id='${id}' class='element upload ${id}' ${renderAttribute(data)}>
                    ${children && renderHtml(children)}
                    <input id='${id}-file' type='file'>
                    <input id='${id}-url' type='text' name='${name}' >
                </div>
            `;
        case 'Submit':
            return `
                <div id='${id}' class='element submit ${id}'>
                    ${data.text}
                </div>
            `;

        case 'Audio':
            return `
                <audio id='${id}' class='element audio ${id}' ${renderAttribute(data)} ></audio>
                `;
        case 'Video':
            return `
                <video id='${id}' class='element video ${id}' ${renderAttribute(data)} ></video>
                `;
        case 'Image':
            return `
                <img id='${id}' class='element image ${id}' ${renderAttribute(data)} />
                `;
        default:
            return '无此元素';
    }
};

// 渲染属性
const renderAttribute = data => {
    let str = '';
    for (let k in data) {
        if (
            [
                'id',
                'key',
                'element',
                'children',
                'css',
                'style',
                'text',
                'list',
                'label',
                'initJs',
                'bindJs',
                'bindType',
                'defaultJs',
                'extraJs',
            ].indexOf(k) > -1
        ) {
            continue;
        } else if (data[k] === true) {
            str += k;
        } else if (data[k] === false) {
            continue;
        } else {
            str += `${utils.toLine(k)}='${data[k].replace(/'/g, '"')}'`;
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
    cssArr.forEach(({ css, id }) => {
        let cssContent = '';
        if (css) {
            const cssLen = Object.keys(css).length;
            let cssRowIdx = 0;
            for (let key in css) {
                cssContent += `${utils.toLine(key)}: ${css[key]};`;
                cssRowIdx++;
                if (cssRowIdx < cssLen) {
                    cssContent += ``;
                }
            }
            const cssItem = `.${id} {${cssContent}}`;
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
        <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/Swiper/5.3.8/css/swiper.css">
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
        <div id="toast" class="toast"></div>
        <script src="https://cdn.bootcss.com/jquery/3.5.0/jquery.js"></script>
        <script src="https://cdn.bootcdn.net/ajax/libs/Swiper/5.3.8/js/swiper.min.js"></script>
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

html {
    height: 100%;
}

body {
    height: 100%;
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

.container {
    height: 100%;
}

.toast {
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    display: none;
}

.element {
    width: 100%;
    height: 50px;
    vertical-align: middle;
    font-size: 12px;
}

.root {
    height: 100%;
}

.swiper-image {
    width: 100%;
    height: 100%;
}

.link {
    color: #000;
}

.text {
    display: inline-block;
    width: auto;
    height: auto;
}

.text-row {
    display: block;
}

.icon {
    display: inline-block;
}

.textarea {
    resize: none;
}

.checkbox {
    width: auto;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.checkbox-label {
    margin-left: 5px; /*^^^^^^*/
}

.radio {
    width: auto;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.radio-label {
    margin-left: 5px; /*^^^^^^*/
}

.submit {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.upload>input {
    display: none;
}
`;
};

// 默认js
const defaultJavascript = `
    window.toast = msg => {
        const $toast = $('#toast');
        $toast.text(msg);
        $toast.show();
        setTimeout(() => $toast.hide(), 3000);
    }
`;
