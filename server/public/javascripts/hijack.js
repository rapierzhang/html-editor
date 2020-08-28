// 预览页面请求篡改

axios.interceptors.request.use(
    config => {
        if (config.method === 'post') {
            if (!config.data) config.data = {};
            // 上传文件代理
            if (Object.prototype.toString.call(config.data) === '[object FormData]') {
                config.data.append('proxyUrl', config.url);
            } else {
                config.data.proxyUrl = config.url;
            }
        } else {
            if (!config.params) config.params = {};
            config.params.proxyUrl = config.url;
        }
        config.url = `http://localhost:3001/api/proxy`;
        return config;
    },
    err => Promise.reject(err),
); // 对请求错误做些什么
