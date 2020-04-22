import { ELEMENTS_UPDATE, INDEX_INCREMENT, ACTIVE_KEY_SET, EDIT_STATUS_SET, ATTRIBUTE_LOAD } from './action-types';
import utils from '../../common/utils';

// index自增
export const indexIncrement = () => dispatch => {
    dispatch({
        type: INDEX_INCREMENT,
    });
};

// 设置元素
export const elementsUpdate = elements => dispatch => {
    dispatch({
        type: ELEMENTS_UPDATE,
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

// 编辑状态
export const isEditSet = isEdit => dispatch => {
    dispatch({
        type: EDIT_STATUS_SET,
        isEdit,
    });
};

// 设置选中元素的属性
export const attributeLoad = (elements, activeKey) => dispatch => {
    const activeEle = utils.deepSearch(elements, activeKey);
    dispatch({
        type: ATTRIBUTE_LOAD,
        activeEle,
    });
};

// 选择编辑
export const elementSelect = (id, activeKey, elements) => dispatch => {
    dispatch(activeKeySet(id));
    if (id == activeKey) {
        dispatch(isEditSet(true));
        dispatch(attributeLoad(elements, activeKey));
    }
};
