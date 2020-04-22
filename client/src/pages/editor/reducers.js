import { ELEMENT_UPDATE, INDEX_INCREMENT } from './action-types';

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
        // 元素更新
        case ELEMENT_UPDATE:
            return Object.assign({}, state, {
                elements: action.elements,
            });
        default:
            return state;
    }
};
