import {
    ELEMENTS_UPDATE,
    INDEX_SET,
    INDEX_INCREMENT,
    ACTIVE_KEY_SET,
    EDIT_STATUS_SET,
    ATTRIBUTE_LOAD,
    CANVAS_POSITION_SET,
    PID_SET,
    ATTRIBUTE_UPDATE,
    TITLE_SET,
    DESC_SET,
    DIALOG_HANDLE,
    ICON_LIST_SET,
} from './action-types';

const editorInfo = {
    pid: '',
    index: 0, // 元素索引
    title: '未命名页面', // 标题
    desc: '', // 简介

    isEdit: false, // 是否编辑状态
    activeId: '', // 选中元素的id
    activeEle: {}, // 选中的元素

    //画布位置
    canvasPosition: {
        ctxTop: 0,
        ctxBottom: 0,
        ctxLeft: 0,
        ctxRight: 0,
        ctxHeight: 0,
        ctxWidth: 0,
    },
    elements: {
        root: {
            id: 'root',
            element: 'Root',
            children: [],
        },
    },
    dialogMap: {},

    iconfontUrl: '',
    iconList: [],
};

export default (state = editorInfo, action) => {
    // console.error(action)
    switch (action.type) {
        case PID_SET:
            return { ...state, pid: action.pid };
        case INDEX_SET:
            return { ...state, index: action.index };
        // index自增
        case INDEX_INCREMENT:
            return { ...state, index: state.index + 1 };
        // 选中状态
        case ACTIVE_KEY_SET:
            return { ...state, activeId: action.activeId };
        // 设置编辑状态
        case EDIT_STATUS_SET:
            return { ...state, isEdit: action.isEdit };
        // 元素更新
        case ELEMENTS_UPDATE:
            return { ...state, elements: action.elements };
        // 元素属性加载
        case ATTRIBUTE_LOAD:
            return { ...state, activeEle: action.activeEle };
        // 元素属性更改
        case ATTRIBUTE_UPDATE:
            return { ...state, activeEle: action.activeEle };
        // 设置画布位置
        case CANVAS_POSITION_SET:
            return { ...state, canvasPosition: action.canvasPosition };
        case TITLE_SET:
            return { ...state, title: action.title };
        case DESC_SET:
            return { ...state, desc: action.desc };
        case DIALOG_HANDLE:
            return { ...state, dialogMap: { [action.id]: action.state } };
        case ICON_LIST_SET:
            return { ...state, iconfontUrl: action.iconfontUrl, iconList: action.iconList };
        default:
            return state;
    }
};
