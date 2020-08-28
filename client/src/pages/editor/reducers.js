import {
    HTML_TREE_UPDATE,
    ACTIVE_KEY_SET,
    EDIT_STATUS_SET,
    ATTRIBUTE_LOAD,
    CANVAS_POSITION_SET,
    PID_SET,
    ATTRIBUTE_UPDATE,
    TITLE_SET,
    DESC_SET,
    DIRNAME_SET,
    DIALOG_HANDLE,
    ICON_LIST_SET,
    ALT_DOWN,
    NAV_HANDLE,
} from './action-types';

const editorInfo = {
    pid: '',
    title: '', // 标题
    desc: '', // 简介
    dirName: '', // 文件名

    isEdit: false, // 是否编辑状态
    activeId: '', // 选中元素的id
    navIndex: 0,
    activeEle: {
        id: '',
        attr: {},
        css: {},
        js: {},
        others: {},
    }, // 选中的元素

    //画布位置
    canvasPosition: {
        ctxTop: 0,
        ctxBottom: 0,
        ctxLeft: 0,
        ctxRight: 0,
        ctxHeight: 0,
        ctxWidth: 0,
    },
    htmlTree: {},
    dialogMap: {},

    iconfontUrl: '',
    iconList: [],
    altDown: false, // alt按住状态
};

export default (state = editorInfo, action) => {
    switch (action.type) {
        case PID_SET:
            return { ...state, pid: action.pid };
        // 选中状态
        case ACTIVE_KEY_SET:
            return { ...state, activeId: action.activeId };
        // 设置编辑状态
        case EDIT_STATUS_SET:
            return { ...state, isEdit: action.isEdit };
        // 元素更新
        case HTML_TREE_UPDATE:
            return { ...state, htmlTree: action.htmlTree };
        // 元素属性加载
        case ATTRIBUTE_LOAD:
            return { ...state, activeEle: { attr: {}, css: {}, js: {}, others: {}, ...action.activeEle } };
        // 元素属性更改
        case ATTRIBUTE_UPDATE:
            return { ...state, activeEle: action.activeEle };
        case NAV_HANDLE:
            return { ...state, navIndex: action.navIndex };
        // 设置画布位置
        case CANVAS_POSITION_SET:
            return { ...state, canvasPosition: action.canvasPosition };
        case TITLE_SET:
            return { ...state, title: action.title };
        case DESC_SET:
            return { ...state, desc: action.desc };
        case DIRNAME_SET:
            return { ...state, dirName: action.dirName }
        case DIALOG_HANDLE:
            return { ...state, dialogMap: { [action.id]: action.state } };
        case ICON_LIST_SET:
            return { ...state, iconfontUrl: action.iconfontUrl, iconList: action.iconList };
        case ALT_DOWN:
            return { ...state, altDown: action.altDown };
        default:
            return state;
    }
};
