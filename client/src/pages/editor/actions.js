import { ELEMENT_UPDATE, INDEX_INCREMENT } from './action-types';

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
