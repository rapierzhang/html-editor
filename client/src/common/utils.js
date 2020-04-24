const utils = {
    // 节点查询
    deepSearch: (obj, key) => {
        if (obj.hasOwnProperty(key)) {
            return obj[key];
        } else {
            for (let item in obj) {
                if (!!obj[item].children) {
                    return utils.deepSearch(obj[item].children, key);
                }
            }
        }
    },
    // 节点更改
    deepUpdate: (obj1, obj2) => {
        const k = Object.keys(obj2)[0];
        let target = {};
        if (obj1.hasOwnProperty(k)) {
            return { ...obj1, ...obj2 };
        } else {
            for (let key in obj1) {
                if (obj1[key].children) {
                    target[key] = { ...obj1[key], children: utils.deepUpdate(obj1[key].children, obj2) };
                } else {
                    target[key] = obj1[key];
                }
            }
        }
        return target;
    },
    // 节点插入
    deepInsert: (obj, k, idx, insertObj) => {
        let target = {};
        for (let key in obj) {
            if (obj[key].children) {
                if (obj[key].children.hasOwnProperty(k)) {
                    // ddd
                    const row1 = obj;
                    const row2 = { ...obj[key].children };
                    const row3 = obj[key].children[k].children;
                    const insertObjVal = Object.values(insertObj)[0];
                    let newObj = {};
                    let row3Vals = Object.values(row3);
                    row3Vals.splice(idx, 0, insertObjVal);
                    row3Vals.forEach(item => {
                        newObj[item.text] = item;
                    });
                    row2[k].children = newObj;
                    target[key] = { ...obj[key], children: row2 };
                } else {
                    target[key] = utils.deepInsert(obj[key].children, k, idx, insertObj);
                }
            } else {
                target[key] = obj[key];
            }
        }
        return target;
    },
    // 插入到某个元素的前后
    deepInsertSameFloor: (obj, k, before, insertObj) => {
        let target = {};
        if (obj.hasOwnProperty(k)) {
            const arr = Object.values(obj);
            arr.forEach(item => {
                if (item.key === k) {
                    if (before) {
                        target = { ...target, ...insertObj, [item.key]: item };
                    } else {
                        target = { ...target, [item.key]: item, ...insertObj };
                    }
                } else {
                    target[item.key] = item;
                }
            });
        } else {
            for (let key in obj) {
                if (obj[key].children) {
                    target[key] = {
                        ...obj[key],
                        children: utils.deepInsertSameFloor(obj[key].children, k, before, insertObj),
                    };
                } else {
                    target[key] = obj[key];
                }
            }
        }
        return target;
    },
    // 节点删除
    deepRemove: (obj, k) => {
        let target = {};
        if (!!obj[k]) {
            let objCopy = { ...obj };
            delete objCopy[k];
            return objCopy;
        } else {
            for (let key in obj) {
                if (obj[key].children) {
                    const children = utils.deepRemove(obj[key].children, k);
                    const childrenLen = Object.keys(children).length;
                    const child = childrenLen > 0 ? { children } : {};
                    const objCopy = { ...obj[key] };
                    if (childrenLen == 0) delete objCopy.children;
                    target[key] = { ...objCopy, ...child };
                } else {
                    target[key] = obj[key];
                }
            }
        }
        return target;
    },
    // 深度优先对象扁平化
    objDepthFirstTraversal: initObj => {
        let list = [];
        const render = obj => {
            Object.values(obj).map((item, idx) => {
                if (item.children) {
                    list.push(item.key);
                    render(item.children);
                } else {
                    list.push(item.key);
                }
            });
        };
        render(initObj);
        return list;
    },
    has: (strOrArr, text) => {
        return strOrArr.indexOf(text) > -1
    },
    // 属性自动补全
    autoComplete: (attr, text) => {
        const pxArr = [
            ...['fontSize', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
            ...['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'width', 'height'],
            ...['top', 'right', 'bottom', 'left'],
        ];
        const colorArr = ['color', 'backgroundColor'];
        const urlArr = ['backgroundImage'];
        if (utils.has(pxArr, attr)) return `${text}px`;
        if (utils.has(colorArr, attr)) return `#${text}`;
        if (utils.has(urlArr, attr)) return `url(${text})`;
        return text;
    },
};

export default utils;
