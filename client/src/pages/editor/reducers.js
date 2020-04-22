import { ELEMENTS_UPDATE, INDEX_INCREMENT, ACTIVE_KEY_SET, EDIT_STATUS_SET, ATTRIBUTE_LOAD } from './action-types';

const editorInfo = {
    index: 0, // 元素索引

    isEdit: false, // 是否编辑状态
    activeKey: '', // 选中元素的key
    activeEle: {}, // 选中的元素

    elements: {},
};

export default (state = editorInfo, action) => {
    switch (action.type) {
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
        case ATTRIBUTE_LOAD:
            return { ...state, activeEle: action.activeEle };
        default:
            return state;
    }
};
