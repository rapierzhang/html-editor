import { Toast } from '../component/';
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
     * 深度优先对象扁平化
     * @param    initObj object  需要遍历的树
     * return            array   结构话后的数组
     * */
    objDepthFirstTraversal(initObj) {
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
    // 属性自动补全
    autoComplete(attr, text) {
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
    autoFilter(attr, text) {
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
    trim: str => str.replace(/ /g, ''),
    // 驼峰转-
    toLine: str => str.replace(/([A-Z])/g, '-$1').toLowerCase(),
    toHump: str => str.replace(/\-(\w)/g, (all, letter) => letter.toUpperCase()),
    cssTtrToObj(text = '') {
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
    // 区分用途为 外部定位,内部样式
    cssFilter(css = {}, out) {
        // css扩展
        const { extra = '' } = css;
        const extraObj = utils.cssTtrToObj(utils.has(extra, '-') ? utils.toHump(extra) : extra);
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
    lineToUnderLine: str => str.replace(/-/g, '_'),
    // 组件默认方法
    defaultJs(element, id, data) {
        const underLineId = utils.lineToUnderLine(id);
        let js = '';
        switch (element) {
            case 'Swiper':
                js = `
                    new Swiper('.swiper-container', {
                    loop: true,
                    pagination: {
                        el: '.swiper-pagination',
                    },
                });
                `;
                break;
            case 'Upload':
                js = `
                    const $${underLineId} = $('#${id}');
                    const $${underLineId}_file = $('#${id}-file');
                    const $${underLineId}_url = $('#${id}-url');
                    
                    $${underLineId}.on('click', () => $${underLineId}_file[0].click());
                    
                    $${underLineId}_file.on('change', e => {
                        const url = $${underLineId}.attr('url');
                        const fileName = $${underLineId}.attr('file-name');
                        const formData = new FormData();
                        formData.append(fileName, e.target.files[0]);
                        $.ajax({
                            type: 'post',
                            url,
                            data: formData,
                            dataType: 'json',
                            cache: false,
                            contentType: false,
                            processData: false,
                        })
                            .then(res => {
                                $${underLineId}_url.val(res.data.url);
                                eval($${underLineId}.attr('on-succ'));
                            })
                            .catch(err => {
                                eval($${underLineId}.attr('on-err'));
                            });
                    });
                `;
                break;
            case 'Submit':
                const { formId } = data;
                // TODO 返回值
                js = `
                    $('#${id}').on('click', () => {
                        const $form = $('#${formId}');
                        const url = $form.attr('url') || '';
                        const type = $form.attr('fetch-type') || 'post';
                        const contentType = $form.attr('content-type') || 'application/json';
                        const child = $form.find('[name]');
                        let data = {};
                        [...child].forEach(item => {
                            const { type, name, value, checked } = item;
                            if (type === 'radio') {
                                if (checked) data[name] = value;
                            } else if (type === 'checkbox') {
                                if (checked) {
                                    if (data[name]) {
                                        data[name].push(value);
                                    } else {
                                        data[name] = [value];
                                    }
                                }
                            } else {
                                data[name] = value;
                            }
                        });
                        if (contentType === 'application/json') {
                            data = JSON.stringify(data);
                        }
                        $.ajax({
                            url,
                            type,
                            dataType: 'json',
                            contentType,
                            data,
                            success: res => {
                                FORM_SUCC
                            },
                            error: err => {
                                FORM_ERR
                            },
                        });
                    });
                `;
                break;
            default:
                js = '';
        }
        return js ? { defaultJs: js } : {};
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
    ...fetchStatus,
};

export default utils;
