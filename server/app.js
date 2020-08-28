import Koa from 'koa';
import json from 'koa-json';
import onerror from 'koa-onerror';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import staticFiles from './utils/koa-static-enhance';
import cors from 'koa2-cors'; //跨域处理
import path from 'path';
import db from './model/database'; // 数据库配置，不能删
import { list, page, component, users, file, proxy, script, log } from './routes';

const app = new Koa();

// error handler
onerror(app);

// middlewares
app.use(
    koaBody({
        patchKoa: true,
        json: true,
        text: true,
        urlencoded: true,
        multipart: true, // 支持文件上传
        formidable: {
            uploadDir: path.join(__dirname, '/public/upload/'), // 设置文件上传目录
            keepExtensions: true, // 保持文件的后缀
            maxFieldsSize: 10 * 1024 * 1024, // 文件上传大小 10M
            /*onFileBegin: (name, file) => {
                // 文件上传前的设置
                console.log(`name: ${name}`);
                console.log(file);
            },*/
        },
    }),
);

app.use(json());
// app.use(logger());
// 静态目录预览页面请求篡改
const hijackList = [
    {
        key: '.html',
        regexp: '<script src="./dist/index.js"></script>',
        ctx: `<script src="/javascripts/hijack.js"></script><script src="./dist/index.js"></script>`,
    },
];
app.use(staticFiles(`${__dirname}/public`, {}, hijackList));

app.use(
    cors({
        origin: ctx => {
            //设置允许来自指定域名请求
            if (ctx.url === '/test') return '*';
            return '*'; //只允许http://localhost:8080这个域名的请求
        },
        maxAge: 5, //指定本次预检请求的有效期，单位为秒。
        credentials: true, //是否允许发送Cookie
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'], //设置获取其他自定义字段
    }),
);

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(list.routes(), list.allowedMethods());
app.use(page.routes(), page.allowedMethods());
app.use(component.routes(), component.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(file.routes(), file.allowedMethods());
app.use(proxy.routes(), proxy.allowedMethods());
app.use(script.routes(), script.allowedMethods());
app.use(log.routes(), log.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

module.exports = app;
