const fs = require('fs');

const utils = {
    // 对象转扁平化数组
    objToArr: obj => {
        let arr = [];
        for (let key in obj) {
            if (!!obj[key].children) {
                let item = { ...obj[key] };
                delete item.children;
                arr = [...arr, item, ...utils.objToArr(obj[key].children)];
            } else {
                arr.push(obj[key]);
            }
        }
        return arr;
    },
    // 删除-
    delLine: name => name.replace(/-/g, ''),
    // 驼峰转-
    toLine: name => name.replace(/([A-Z])/g, '-$1').toLowerCase(),
    // 判断标签是否是闭合标签
    labelJudge: label => {
        const singleEleArr = ['input', 'image'];
        const multipleEleArr = ['div', 'span'];
        if (singleEleArr.indexOf(label) > -1) return 1;
        if (multipleEleArr.indexOf(label) > -1) return 2;
        return 0;
    },
    // 默认response
    res: (code = 200, msg = 'ok', data = {}) => ({
        code,
        msg,
        data,
    }),
    // 时间格式化
    dateFormat: (ms, fmt) => {
        /**
         * 时间格式化，将13位时间戳格式化为时间字符串
         * @param {number/string} [ms] 需要转换的毫秒值
         * @param {string} [fmt] 输出格式，不传默认为 {yyyy-MM-dd hh:mm:ss}
         * @return {string} 返回转换后的时间字符串
         */
        const date = new Date(parseInt(ms));
        fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
        const o = {
            'M+': date.getMonth() + 1, //月份
            'd+': date.getDate(), //日
            'h+': date.getHours(), //小时
            'm+': date.getMinutes(), //分
            's+': date.getSeconds(), //秒
            'q+': Math.floor((date.getMonth() + 3) / 3), //季度
            S: date.getMilliseconds(), //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        // eslint-disable-next-line
        for (let k in o)
            if (new RegExp('(' + k + ')').test(fmt))
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        return fmt;
    },
    // uuid
    uuid: () => {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
            let r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    },
    // 去除空格
    trim: str => str.replace(/ /g, ''),
    // css字符串转obj
    cssStrToObj(text = '') {
        let obj = {};
        const arr = utils
            .trim(text)
            .replace('\n', '')
            .split(';');
        arr.forEach(item => {
            if (!item) return;
            const [k, v] = item.split(':');
            obj[k] = v;
        });
        return obj;
    },

    delFile(path) {
        let files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(file => {
                const curPath = `${path}/${file}`;
                if (fs.statSync(curPath).isDirectory()) {
                    utils.delFile(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    },
    /*
     * 节点查询
     * @param    obj         object  需要查询的树
     * @param    key         string  需要查询的key
     * return                object  查到的子树
     * */
    deepSearch(obj, key) {
        let target = {};
        const recursion = (o, k) => {
            if (o.hasOwnProperty(k)) {
                target = o[k];
            } else {
                for (let item in o) {
                    if (o[item].children) {
                        recursion(o[item].children, k);
                    }
                }
            }
        };
        recursion(obj, key);
        return target;
    },
    lineToUnderLine: str => str.replace(/-/g, '_'),
};

module.exports = utils;
