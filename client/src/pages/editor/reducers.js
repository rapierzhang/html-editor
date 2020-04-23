import {
    ELEMENTS_UPDATE,
    INDEX_INCREMENT,
    ACTIVE_KEY_SET,
    EDIT_STATUS_SET,
    ATTRIBUTE_LOAD,
    CANVAS_POSITION_SET, PID_SET,
} from './action-types';

const editorInfo = {
    pid: '',
    index: 1, // 元素索引

    isEdit: true, // 是否编辑状态
    activeKey: 'A', // 选中元素的key
    activeEle: {}, // 选中的元素

    canvasPosition: {
        ctxTop: 0,
        ctxBottom: 0,
        ctxLeft: 0,
        ctxRight: 0,
    }, //画布位置
    elements: {
        A: {
            element: 'div',
            id: 'A',
        },
    },
};

export default (state = editorInfo, action) => {
    // console.error(action)
    switch (action.type) {
        case PID_SET:
            return {...state, pid: action.pid}
        // index自增
        case INDEX_INCREMENT:
            return { ...state, index: state.index + 1 };
        // 选中状态
        case ACTIVE_KEY_SET:
            return { ...state, activeKey: action.activeKey };
        // 设置编辑状态
        case EDIT_STATUS_SET:
            return { ...state, isEdit: action.isEdit };
        // 元素更新
        case ELEMENTS_UPDATE:
            return { ...state, elements: action.elements };
        // 元素加载
        case ATTRIBUTE_LOAD:
            return { ...state, activeEle: action.activeEle };
        // 设置画布位置
        case CANVAS_POSITION_SET:
            return { ...state, canvasPosition: action.canvasPosition };
        default:
            return state;
    }
};
