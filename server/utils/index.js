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
        data
    }),
};

module.exports = utils;
