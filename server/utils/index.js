const utils = {
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
    toLine: name => name.replace(/([A-Z])/g, '-$1').toLowerCase(),
};

module.exports = utils;
