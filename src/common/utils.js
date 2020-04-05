const utils = {
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
                    target[key] = {...obj[key], children: utils.deepInsertSameFloor(obj[key].children, k, before, insertObj)};
                } else {
                    target[key] = obj[key];
                }
            }
        }
    },
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
};

export default utils;
