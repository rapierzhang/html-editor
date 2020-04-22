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
            return Object.assign({}, state, {
                index: editorInfo.index + 1,
            });
        // 选中状态
        case ACTIVE_KEY_SET:
            return Object.assign({}, state, {
                activeKey: action.activeKey,
            });
        // 设置编辑状态
        case EDIT_STATUS_SET:
            return Object.assign({}, state, {
                isEdit: action.isEdit,
            });
        // 元素更新
        case ELEMENT_UPDATE:
            return Object.assign({}, state, {
                elements: action.elements,
            });
        default:
            return state;
    }
};
