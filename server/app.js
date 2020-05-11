const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const koaBody = require('koa-body');
const logger = require('koa-logger');
const staticFiles = require('koa-static');
const cors = require('koa2-cors'); //跨域处理

const path = require('path');

const list = require('./routes/list');
const page = require('./routes/page');
const users = require('./routes/users');
const file = require('./routes/file');

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
            uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传目录
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
app.use(logger());
app.use(staticFiles(__dirname + '/public'));

app.use(
    cors({
        origin: ctx => {
            //设置允许来自指定域名请求
            if (ctx.url === '/test') return '*';
            return 'http://localhost:8888'; //只允许http://localhost:8080这个域名的请求
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
app.use(users.routes(), users.allowedMethods());
app.use(file.routes(), file.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

module.exports = app;
