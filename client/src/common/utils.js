import { Toast } from '../component/';

const utils = {
    /*
     * 节点查询
     * @param    obj         object  需要查询的树
     * @param    key         string  需要查询的key
     * return                object  查到的子树
     * */
    deepSearch: (obj1, key1) => {
        let target = {};
        const recursion = (obj, key) => {
            if (obj.hasOwnProperty(key)) {
                target = obj[key];
            } else {
                for (let item in obj) {
                    if (obj[item].children) {
                        recursion(obj[item].children, key);
                    }
                }
            }
        };
        recursion(obj1, key1);
        return target;
    },
    /*
     * 节点更改
     * @param    obj1         object  需要更改的树
     * @param    obj2         object  需要更改的子树
     * return                 object  更新后的树
     * */
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
    /*
     * 节点插入
     * @param    obj         object  需要插入的树
     * @param    k           string  插入在哪个节点中
     * @oaram    insertObj   object  插入的对象
     * return                object  插入后的树
     * */
    deepInsert: (obj, k, insertObj) => {
        let target = {};
        for (let key in obj) {
            const item = obj[key];
            if (key === k) {
                if (item.hasOwnProperty('children')) {
                    target[key] = { ...item, children: { ...item.children, ...insertObj } };
                } else {
                    target[key] = { ...item, children: insertObj };
                }
            } else {
                if (item.hasOwnProperty('children')) {
                    target[key] = { ...item, children: utils.deepInsert(item.children, k, insertObj) };
                } else {
                    target[key] = item;
                }
            }
        }
        return target;
    },
    /*
     * 插入到某个元素的前后
     * @param    obj         object  需要插入的树
     * @param    k           string  插入在哪个节点前后
     * @param    before      bool    插入在节点的前后
     * @oaram    insertObj   object  插入的对象
     * return                object  插入后的树
     * */
    deepInsertSameFloor: (obj, k, before, insertObj) => {
        let target = {};
        if (obj.hasOwnProperty(k)) {
            const arr = Object.values(obj);
            arr.forEach(item => {
                if (item.id === k) {
                    if (before) {
                        target = { ...target, ...insertObj, [item.id]: item };
                    } else {
                        target = { ...target, [item.id]: item, ...insertObj };
                    }
                } else {
                    target[item.id] = item;
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
    /*
     * 节点删除
     * @param    obj     object  需要删除节点的树
     * @param    k       string  需要删除节点的key
     * return            object  删除后的树
     * */
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
    /*
     * 深度优先对象扁平化
     * @param    initObj object  需要遍历的树
     * return            array   结构话后的数组
     * */
    objDepthFirstTraversal: initObj => {
        let list = [];
        const render = obj => {
            Object.values(obj).map((item, idx) => {
                if (item.children) {
                    list.push(item.id);
                    render(item.children);
                } else {
                    list.push(item.id);
                }
            });
        };
        render(initObj);
        return list;
    },
    has: (strOrArr, text) => strOrArr.indexOf(text) > -1,
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
        // if (utils.has(colorArr, attr)) return `#${text}`;
        if (utils.has(urlArr, attr)) return `url(${text})`;
        return text;
    },
    // 属性自动过滤
    autoFilter: (attr, text) => {
        const pxArr = [
            ...['fontSize', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
            ...['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'width', 'height'],
            ...['top', 'right', 'bottom', 'left'],
        ];
        const urlArr = ['backgroundImage'];
        if (utils.has(pxArr, attr)) return text.replace(/px/g, '');
        if (utils.has(urlArr, attr)) return text.match(/url(\S*)/);
        return text;
    },
    // 弹层
    toast: msg => ({ ...Toast(msg) }),
    // 区分用途为 外部定位,内部样式
    cssFilter(css, out) {
        let obj = {};
        const distinguishArr = [
            'position',
            'top',
            'right',
            'bottom',
            'left',
            'marginTop',
            'marginRight',
            'marginBottom',
            'marginLeft',
        ];
        for (let k in css) {
            const match = utils.has(distinguishArr, k);
            if ((out && match) || (!out && !match)) {
                obj[k] = css[k];
            }
        }
        return obj;
    },
    // 过滤object
    objKeyFilter(obj, arr) {
        let o = { ...obj };
        for (let key in obj) {
            if (utils.has(arr, key)) {
                delete o[key];
            }
        }
        return o;
    },
    objValFilter(obj, arr) {
        let o = { ...obj };
        for (let key in obj) {
            if (utils.has(arr, obj[key])) {
                delete o[key];
            }
        }
        return o;
    },
    // 默认方法
    defaultJs(element, id, data) {
        let js = '';
        switch(element) {
            case 'Submit':
                const { formId } = data;
                js = `
                    $('#${id}').on('click', () => {
                        const formEle = $('#${formId}');
                        const url = formEle.attr('url') || '';
                        const type = formEle.attr('fetch-type') || 'post';
                        const contentType = formEle.attr('content-type') || 'application/json';
                        const child = formEle.find('[name]');
                        let data = {};
                        [...child].forEach(item => {
                            data[item.name] = item.value;
                        });
                        if (contentType === 'application/json') {
                            data = JSON.stringfy(data);
                        }
                        $.ajax({
                            url,
                            type,
                            dataType: 'json',
                            contentType,
                            data,
                        })
                        .then(res => {
                            console.error('success', res);
                        })
                        .catch(err => {
                            console.error('error', err);
                        });
                    });
                `;
                break
            default:
                js = '11';
        }
        return { defaultJs: js }
    }
};

export default utils;
