import { ELEMENT_UPDATE, INDEX_INCREMENT, ACTIVE_KEY_SET, EDIT_STATUS_SET } from './action-types';

const editorInfo = {
    index: 0, // 元素索引
    isDown: false,
    dragName: '',
    activeKey: '',
    isEdit: false,
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
        case ELEMENT_UPDATE:
            return { ...state, elements: action.elements };
        default:
            return state;
    }
};
