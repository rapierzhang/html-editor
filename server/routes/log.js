import Koa from 'koa';
import koaRouter from 'koa-router';
import ws from 'ws';
import process from 'child_process';
const router = koaRouter();

const app = new Koa();
const server = app.listen(3003);

const WebSocketServer = ws.Server;
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
    console.log('----链接成功----');
    ws.send('服务端链接成功');

    ws.on('message', message => {
        console.log('接受到客户端: %s', message);
    });

    const pm2Log = process.spawn('pm2', ['log']);
    pm2Log.stdout.on('data', (data) => {
        ws.send(data.toString())
    });

    pm2Log.stderr.on('data', (data) => {});

    pm2Log.on('close', (code) => {});

});

export default router;
