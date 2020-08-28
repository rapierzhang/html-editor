import fs from 'fs';
import path from 'path';
import utils from '../utils';
import defaultJs from '../../common/default-js';
import { compMap } from '../../common/component';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { domain } from '../config/domain.config';

// 图片目录
export const mkdirImage = dirPath => {
    const imgDirPath = `${dirPath}/image`;
    const jsDirExists = fs.existsSync(imgDirPath);
    if (!jsDirExists) fs.mkdirSync(imgDirPath);
};

/*------ html 相关 ------*/
// 写入HTML
export const writeHtml = (dirPath, data) => {
    const { pid, title, iconfontUrl, htmlTree } = data;
    const content = renderToString(render(htmlTree));

    const htmlContext = defaultHtml({ pid, title, iconfontUrl, content });
    fs.writeFileSync(`${dirPath}/index.html`, htmlContext);
};

const render = obj => {
    if (!obj) return;
    const list = Object.values(obj);
    return list.map((item, idx) => compMap('build', item, idx, render(item.children)));
};

// 默认html
const defaultHtml = data => {
    const { title = '', iconfontUrl, content } = data;
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
        <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/Swiper/5.3.8/css/swiper.min.css">
        <link rel="stylesheet" href="./dist/index.css" />
        ${iconfontUrl ? `<link rel="stylesheet" href="${iconfontUrl}" />` : ''}
        <script>
            !(function(x){function w(){var v,u,s=x.document,r=s.documentElement,a=r.getBoundingClientRect().width;if(!v&&!u){const n=!!x.navigator.appVersion.match(/AppleWebKit.*Mobile.*/);v=x.devicePixelRatio;(v=n?v:1),(u=1/v)}if(a>=640){r.style.fontSize="40px"}else{if(a<=320){r.style.fontSize="20px"}else{r.style.fontSize=(a/320)*20+"px"}}}x.addEventListener("resize",w);w()})(window);
        </script>
    </head>
    <body>
        <div id="app" class="container">
            ${content}
        </div>
        <div id="toast" class="toast"></div>
        <script src="https://cdn.bootcdn.net/ajax/libs/Swiper/5.3.8/js/swiper.min.js"></script>
        <script src="${domain}/javascripts/picker.min.js"></script>
        <script src="${domain}/javascripts/jquery.min.js"></script>
        <script src="${domain}/javascripts/axios.min.js"></script>
        <script src="./dist/index.js"></script>
    </body>
</html>`;
};

/*------ css 相关 ------*/
// 写入css
export const writeCss = (dirPath, htmlTree) => {
    const cssDirPath = `${dirPath}/css`;
    const cssDirExists = fs.existsSync(cssDirPath);
    if (!cssDirExists) fs.mkdirSync(cssDirPath);
    // 读取组件css
    let cssContext = defaultCss();
    const componentCss = fs.readFileSync(`${path.resolve('./')}/common/component.css`).toString();
    cssContext += componentCss;
    const cssArr = utils.objToArr(htmlTree);
    cssArr.forEach(({ id, css = {}, others = {} }) => {
        let cssContent = '';

        // 全局css
        const { globalCss, customCss, mapCss } = others || {};
        const { extra = '' } = css || {};

        if (globalCss) {
            cssContext += `${globalCss}\n\n`;
        }

        // 扩展css
        if (extra) {
            css = { ...css, ...utils.cssStrToObj(extra) };
            delete css.extra;
        }

        // 选择生成的css
        const cssLen = Object.keys(css).length;
        if (cssLen > 0) {
            for (let key in css) {
                // 删除空值
                if (css[key]) {
                    cssContent += `${utils.toLine(key)}: ${css[key]};`;
                }
            }
            // 末尾添加空行
            const cssItem = `.${id} {${cssContent}}\n\n`;
            cssContext += cssItem;
        }

        // 自定义html标签的css
        if (customCss) {
            cssContext += `#${id} ${customCss}`;
        }

        // Map组件内的css
        if (mapCss) {
            cssContext += `#${id} ${mapCss}`;
        }

    });
    fs.writeFileSync(`${cssDirPath}/index.css`, cssContext);
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
}

@media screen and (min-width: 640px) {
    .container {
        width: 750px;
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

`;
};

/*------ js 相关 ------*/
// 写入js
export const writeJs = (dirPath, htmlTree) => {
    const jsDirPath = `${dirPath}/js`;
    const jsDirExists = fs.existsSync(jsDirPath);
    if (!jsDirExists) fs.mkdirSync(jsDirPath);
    let jsContext = '';
    jsContext += defaultJavascript;

    let cacheJs = '';
    const jsArr = utils.objToArr(htmlTree);
    jsArr.forEach(item => {
        const { id, js: { initJs, extraJs, bindJs } = {}, others: { customJs } = {} } = item;
        const underlineId = utils.lineToUnderLine(id);
        // 初始化js
        if (initJs) {
            cacheJs += `
                /*------ init start ------*/
                ${initJs}
                /*------ init end ------*/
            `;
        }
        // 组件默认js
        const compDefaultJs = defaultJs(item);
        if (compDefaultJs) {
            // 在/common/defaule.js中获取
            cacheJs += compDefaultJs;
        }
        // 绑定js
        if (bindJs) {
            cacheJs += `const $${underlineId} = $('#${id}');`;
            for (let i in bindJs) {
                cacheJs += `$${underlineId}.on('${i}', () => { ${bindJs[i]} });`;
                cacheJs += '\n';
            }
        }
        // 扩展js
        if (extraJs) {
            cacheJs += extraJs;
        }
        // 自定义html的js
        if (customJs) {
            cacheJs += customJs;
        }
        // 空行
        if (initJs || compDefaultJs || extraJs || customJs) {
            cacheJs += '\n';
        }
    });
    jsContext += cacheJs;

    fs.writeFileSync(`${jsDirPath}/index.js`, jsContext);
};

// 默认js
const defaultJavascript = `
    // toast
    window.toast = msg => {
        const $toast = document.getElementById('toast');
        $toast.innerText = msg;
        $toast.style.display = 'block';
        setTimeout(() => $toast.style.display = 'none', 3000);
    }
    // dialog
    window.dialog = {
        show: id => document.getElementById(id).classList.add('show'),
        hide: id => document.getElementById(id).classList.remove('show'),
    } 
    
`;
