import { ELEMENT_UPDATE, INDEX_INCREMENT, ACTIVE_KEY_SET, EDIT_STATUS_SET } from './action-types';

// index自增
export const indexIncrement = () => dispatch => {
    dispatch({
        type: INDEX_INCREMENT,
    });
};

// 设置元素
export const elementsUpdate = elements => dispatch => {
    dispatch({
        type: ELEMENT_UPDATE,
        elements,
    });
};

// 选中元素
export const activeKeySet = activeKey => dispatch => {
    dispatch({
        type: ACTIVE_KEY_SET,
        activeKey,
    });
};

// 编辑状态设置
export const isEditSet = isEdit => dispatch => {
    dispatch({
        type: EDIT_STATUS_SET,
        isEdit,
    });
};
