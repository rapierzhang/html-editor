import {
    PID_SET,
    ELEMENTS_UPDATE,
    INDEX_INCREMENT,
    ACTIVE_KEY_SET,
    EDIT_STATUS_SET,
    ATTRIBUTE_LOAD,
    ATTRIBUTE_UPDATE,
    CANVAS_POSITION_SET,
} from './action-types';
import { utils, fetch } from '../../common';

export const pidSet = pid => dispatch => {
    dispatch({
        type: PID_SET,
        pid,
    });
};

export const pageInit = params => {
    return fetch({
        url: '/api/page/get',
        method: 'post',
        params,
    }).then(res => res.data);
};

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

// 更改选中元素属性
export const attributeUpdate = activeEle => dispatch => {
    dispatch({
        type: ATTRIBUTE_UPDATE,
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

// 设置画布位置
export const canvasPositionSet = canvasPosition => dispatch => {
    dispatch({
        type: CANVAS_POSITION_SET,
        canvasPosition,
    });
};

// 保存数据
export const htmlSave = params => {
    return fetch({
        url: '/api/page/save',
        method: 'POST',
        params,
    }).then(res => res.data);
};

export const htmlBuild = params => {
    return fetch({
        url: '/api/page/build',
        method: 'POST',
        params,
    }).then(res => res.data);
};
