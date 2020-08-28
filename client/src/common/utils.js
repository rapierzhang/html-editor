import { Toast } from '../component/common';
import copy from 'copy-to-clipboard';

const fetchStatus = {
    defaultData: {
        isInit: false,
        fetchStatus: 'norequest',
        data: {},
    },
    fetchLoading(that, key) {
        /*
         * 请求中
         * @param  that     this
         * @param  key      名称
         * */
        that.setState({
            [key]: {
                isInit: that.state[key].isInit,
                fetchStatus: 'loading',
                data: that.state[key].data,
            },
        });
    },
    fetchSucc(that, key, data) {
        /*
         * 请求成功
         * @param   that     this
         * @param   key      名称
         * @param   data     数据
         * */
        that.setState({
            [key]: {
                isInit: true,
                fetchStatus: 'success',
                data,
            },
        });
    },
    fetchErr(that, key, data) {
        /*
         * 请求失败
         * @param   that     this
         * @param   key      名称
         * @param   data     错误信息
         * */
        that.setState({
            [key]: {
                isInit: false,
                fetchStatus: 'error',
                data,
            },
        });
    },
};

const utils = {
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
    /*
     * 节点更改
     * @param    obj1         object  需要更改的树
     * @param    obj2         object  需要更改的子树
     * return                 object  更新后的树
     * */
    deepUpdate(obj1, obj2) {
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
    deepInsert(obj, k, insertObj) {
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
     * @param    id          string  插入在哪个节点前后
     * @param    before      bool    插入在节点的前后
     * @oaram    insertObj   object  插入的对象          {id: {id:...}}
     * return                object  插入后的树
     * */
    deepInsertSameFloor(obj, id, before, insertObj) {
        let target = {};
        if (obj.hasOwnProperty(id)) {
            const arr = Object.values(obj);
            arr.forEach(item => {
                if (item.id === id) {
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
                        children: utils.deepInsertSameFloor(obj[key].children, id, before, insertObj),
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
    deepRemove(obj, k) {
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
     *  深度遍历
     *  @param   obj     object  需要更改的树
     *  @param   func    func    回调函数
     */
    deepForEach(obj, func) {
        let target = {};
        for (let key in obj) {
            if (obj[key].children) {
                target[key] = { ...func(obj[key]), children: utils.deepForEach(obj[key].children, func) };
            } else {
                target[key] = func(obj[key]);
            }
        }
        return target;
    },
    deepIdChange(obj, func) {
        let target = {};
        for (let key in obj) {
            const newId = func(key);
            if (obj[key].children) {
                target[newId] = { ...obj[key], id: newId, children: utils.deepIdChange(obj[key].children, func) };
            } else {
                target[newId] = { ...obj[key], id: newId };
            }
        }
        return target;
    },
    /*
     * 获取所有父节点
     *   @param   obj           object  需要更改的树
     *   @param   id            string  需要查询的id
     *   @param   family        array   家族列表
     *   @param   includeSelf   bool    包含自己
     * */
    familyTree(obj, id, family = [], includeSelf = true) {
        let f = [];
        const getTree = (obj, id, family = []) => {
            const arr = Object.values(obj);
            arr.forEach(item => {
                const newFamily = {
                    id: item.id,
                    element: item.element,
                };
                if (item.id == id) {
                    f = [...family, ...includeSelf && { newFamily }];
                } else if (item.children) {
                    getTree(item.children, id, [...family, newFamily]);
                } else {
                    return;
                }
            });
        };
        getTree(obj, id, family);
        return f;
    },
    isInFamily(obj, id, familyKey, familyValue) {
      const familyList = utils.familyTree(obj, id, [], false);
      let result = false;
      familyList.forEach(item => {
          if(item[familyKey] === familyValue) result = true;
      })
        return result;
    },
    // 是否存在
    has: (strOrObj, text) => strOrObj.indexOf(text) > -1,
    /**
     * 时间格式化，将13位时间戳格式化为时间字符串
     * @param {number/string} [ms] 需要转换的毫秒值
     * @param {string} [fmt] 输出格式，不传默认为 {yyyy-MM-dd hh:mm:ss}
     * @return {string} 返回转换后的时间字符串
     */
    dateFormat(ms, fmt) {
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
    // 弹层
    toast: msg => ({ ...Toast(msg) }),
    trim: str => str.replace(/ /g, ''),
    toHump: str => str.replace(/\-(\w)/g, (all, letter) => letter.toUpperCase()),
    cssStrToObj(text = '') {
        if (!text) return {};
        text = text.replace(/\n/g, '');
        text = text.replace(/([^-])(?:-+([^-]))/g, ($0, $1, $2) => $1 + $2.toUpperCase());
        text = text.match(/\{(.*)\}/, '$1');
        let obj = {};
        const arr = text[1].split(';');
        arr.forEach(item => {
            if (!item) return;
            const [k, v] = item.split(':');
            obj[k] = v;
        });
        return obj;
    },
    // 区分用途为 外部定位,内部样式
    cssFilter(css = {}, out) {
        // css扩展
        const { extra = '' } = css;
        const extraObj = utils.cssStrToObj(extra);
        css = { ...css, ...extraObj };
        delete css.extra;
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
            if ((out && match) || (!out && !match) || k == 'width' || k == 'height') {
                obj[k] = css[k];
            }
        }
        // 解决position定位问题 当position为fixed'或static时先放一个假的，等构建时在换成真的
        if (obj.position === 'fixed') {
            obj.position = 'absolute';
        }
        if (obj.position === 'static') {
            obj = {
                ...obj,
                position: 'relative',
                top: 0,
                left: 0,
            };
        }
        return obj;
    },
    // 过滤object
    objKeyFilter(obj, arr) {
        let o = { ...obj };
        for (let key in obj) {
            if (utils.has(arr, key)) delete o[key];
        }
        return o;
    },
    objValFilter(obj, arr) {
        let o = { ...obj };
        for (let key in obj) {
            if (utils.has(arr, obj[key])) delete o[key];
        }
        return o;
    },
    // base64转blob
    dataURItoBlob(base64Data) {
        let byteString;
        if (base64Data.split(',')[0].indexOf('base64') >= 0) byteString = atob(base64Data.split(',')[1]);
        else byteString = unescape(base64Data.split(',')[1]);
        const mimeString = base64Data
            .split(',')[0]
            .split(':')[1]
            .split(';')[0];
        let ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], { type: mimeString });
    },
    // 监听回车
    enter: e => new Promise(resolve => (e.which == 13 || e.keyCode == 13) && resolve()),
    // 复制
    copy(text) {
        copy(text);
        utils.toast('复制成功！');
    },
    // 唯一id
    uniqueKey() {
        let num = new Date().getTime();
        const str = utils.tenToLetter(num);
        return utils.splitByLine(str, 3, '-');
    },
    // 按位分割
    splitByLine(str, num, symbol = '') {
        const strLen = str.length;
        let newStr = '';
        for (let i = 0; i < strLen; i++) {
            if (i % num == 0 && parseInt(i / num) != 0) newStr += symbol;
            newStr += str[i];
        }
        return newStr;
    },
    // 10进制转26进制
    tenToLetter(num) {
        let str = '';
        while (num > 0) {
            let m = num % 26;
            if (m == 0) m = 26;
            str = String.fromCharCode(m + 64) + str;
            num = (num - m) / 26;
        }
        return str.toLocaleLowerCase();
    },
    letterToTen(str) {
        let num = 0;
        let s = str.match(/./g); //求出字符数组
        for (let i = str.length - 1, j = 1; i >= 0; i--, j *= 26) {
            let c = s[i].toUpperCase();
            if (c < 'A' || c > 'Z') return 0;
            num += (c.charCodeAt(0) - 64) * j;
        }
        return num;
    },
    trimNumber(str = '') {
        if (typeof str !== 'string') return str;
        return str.replace(/\d+/g, '').replace(/-/g, '');
    },
    ...fetchStatus,
};

export default utils;
