import nodeSSH from 'node-ssh';
import nodeScp from 'node-scp';
import path from 'path';
import fs from 'fs';
import process from 'child_process';
import utils from '../utils/index';
import { ScriptModel, ScriptListModel } from '../model';

// 脚本获取
export const scriptGet = async (ctx, next) => {
    let { sid } = ctx.query;
    const result = await ScriptModel.findOne({ sid }, { _id: 0, __v: 0 });
    if (result) {
        ctx.body = utils.res(200, 'ok', result);
    } else {
        sid = utils.uuid();
        ctx.body = utils.res(200, 'ok', {
            sid,
            title: '',
            desc: '',
            script: '',
            host: '',
            username: '',
            password: '',
            modelType: 'rsync',
            deployPath: '',
        });
    }
};

// 脚本保存
export const scriptSave = async (ctx, next) => {
    let { sid, title, desc, script, host, username, password, deployPath, modelType } = ctx.request.body;
    const time = new Date().getTime();
    let scriptResult = false;
    let listResult = false;
    let msg = '';
    const result = await ScriptModel.findOne({ sid });
    if (result) {
        console.error('有数据 修改');
        try {
            scriptResult = await ScriptModel.updateOne(
                { sid },
                {
                    $set: {
                        title,
                        desc,
                        script,
                        host,
                        username,
                        password,
                        deployPath,
                        modelType,
                        updateTime: time,
                    },
                },
            );
            listResult = await ScriptListModel.updateOne(
                { sid },
                {
                    $set: {
                        title,
                        desc,
                        updateTime: time,
                    },
                },
            );
        } catch (e) {
            msg = e;
        }
    } else {
        console.error('无数据 新建');
        const _script = new ScriptModel({
            sid,
            title,
            desc,
            script,
            host,
            username,
            password,
            deployPath,
            modelType,
            createTime: time,
            updateTime: time,
        });
        const _list = new ScriptListModel({
            sid,
            title,
            desc,
            createTime: time,
            updateTime: time,
        });

        try {
            scriptResult = await _script.save();
            listResult = await _list.save();
        } catch (e) {
            msg = e;
        }
    }
    // 保存部署shell脚本
    if (modelType === 'script') {
        const shellPath = `${path.resolve('./')}/server/shell/release/${sid}.sh`;
        fs.writeFileSync(shellPath, script);
        process.execSync(`chmod +x ${shellPath}`);
    }

    if (!!scriptResult && !!listResult) {
        ctx.body = utils.res(200, 'ok', { result: true });
    } else {
        ctx.body = utils.res(500, msg, {});
    }
};

// 脚本列表
export const scriptList = async (ctx, next) => {
    const pageList = await ScriptListModel.find({}, { _id: 0, __v: 0 }).sort({ createTime: -1 });
    const totalCount = await ScriptListModel.find({}).countDocuments();

    const result = {
        pageList,
        totalCount,
    };
    ctx.body = utils.res(200, 'ok', result);
};

// 脚本删除
export const scriptDelete = async (ctx, next) => {
    let { sid } = ctx.request.body;
    const result = await ScriptModel.deleteOne({ sid });
    const listResult = await ScriptListModel.deleteOne({ sid });
    const dirPath = `${path.resolve('./')}/server/shell/release/${sid}.sh`;
    const isExist = fs.existsSync(dirPath);
    if (isExist) utils.delFile(dirPath);
    if (result && listResult) {
        ctx.body = utils.res(200, 'ok', { result: true });
    } else {
        ctx.body = utils.res(500, 'delete fail', '');
    }
};

// 打通ssh
export const openSSH = async (ctx, next) => {
    const { username, host, password } = ctx.request.body;
    try {
        // 拷贝公钥
        const client = await nodeScp({
            host,
            port: 22,
            username,
            password,
        });
        await client.uploadFile('/Users/mingyangzhang/.ssh/id_rsa.pub', '/root/id_rsa.pub'); // ^^^
        await client.close();

        // 用将公钥追加写入到指定位置
        const ssh = new nodeSSH();
        await ssh.connect({ host, username, password });
        await ssh
            .execCommand(
                `cd /root && mkdir -p .ssh && cat >> /root/.ssh/authorized_keys < /root/id_rsa.pub && rm /root/id_rsa.pub`,
            )
            .then(() => {
                ctx.body = utils.res(200, 'ok', { result: true });
            });
    } catch (e) {
        ctx.body = utils.res(200, 'ok', { result: false });
    }
};

// 初始化目录
export const initDir = async (ctx, next) => {
    const { username, host, password, deployPath } = ctx.request.body;
    const ssh = new nodeSSH();
    try {
        await ssh.connect({ host, username, password });
        await ssh.execCommand(`cd ${deployPath} && mkdir -p html`).then(() => {
            process.execFileSync(`${path.resolve('./')}/server/shell/rsync.sh`, [
                `${path.resolve('./')}/server/public/javascripts`,
                username,
                host,
                `${deployPath}`,
            ]);
        });
        ctx.body = utils.res(200, 'ok', { result: true });
    } catch (e) {
        ctx.body = utils.res(200, 'ok', { result: false });
    }
};
