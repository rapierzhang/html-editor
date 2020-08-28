const CONFIG = {
    restDomain:
        process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'http://html-editor.ufo.sogou-inc.com', // 服务端域
    wsDomain:
        process.env.NODE_ENV === 'development' ? 'ws://localhost:3003' : 'ws://10.160.20.140:3003/ws', // TODO nginx配置有问题
};

export default CONFIG;
