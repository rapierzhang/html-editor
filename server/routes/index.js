const router = require('koa-router')();
const controller = require('../controller/index');

router.get('/', async (ctx, next) => {
    await ctx.render('index', {
        title: 'Hello Koa 2!',
    });
});

router.get('/json', async (ctx, next) => {
    await ctx.body({
        title: 'Hello Koa 2!',
    });
});

router.post('/save', controller.save)

router.post('/build', controller.build);

router.post('/test', async (ctx, next) => {
    console.log('-------------');
    console.log('ctx.header: ', ctx.header);
    console.log('ctx.headers: ', ctx.headers);
    console.log('ctx.method: ', ctx.method);
    console.log('ctx.url: ', ctx.url);
    console.log('ctx.originalUrl: ', ctx.originalUrl);
    console.log('ctx.origin: ', ctx.origin);
    console.log('ctx.href: ', ctx.href);
    console.log('ctx.path: ', ctx.path);
    console.log('ctx.query: ', ctx.query);
    console.log('ctx.querystring: ', ctx.querystring);
    console.log('ctx.host: ', ctx.host);
    console.log('ctx.hostname: ', ctx.hostname);
    console.log('ctx.fresh: ', ctx.fresh);
    console.log('ctx.stale: ', ctx.stale);
    console.log('ctx.protocol: ', ctx.protocol);
    console.log('ctx.secure: ', ctx.secure);
    console.log('ctx.ip: ', ctx.ip);
    console.log('ctx.ips: ', ctx.ips);
    console.log('ctx.subdomains: ', ctx.subdomains);
    console.log('ctx.body: ', ctx.body);
    console.log('ctx.status: ', ctx.status);
    console.log('ctx.message: ', ctx.message);
    console.log('ctx.headerSent: ', ctx.headerSent);
    console.log('-------------');

    ctx.body = {
        title: 'koa2 json',
    };
});

module.exports = router;
