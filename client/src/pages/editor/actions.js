import {
    PID_SET,
    HTML_TREE_UPDATE,
    ACTIVE_KEY_SET,
    EDIT_STATUS_SET,
    ATTRIBUTE_LOAD,
    ATTRIBUTE_UPDATE,
    CANVAS_POSITION_SET,
    TITLE_SET,
    DESC_SET,
    DIRNAME_SET,
    DIALOG_HANDLE,
    ICON_LIST_SET,
    ALT_DOWN,
    NAV_HANDLE,
} from './action-types';
import { fetch } from '../../common';
import utils from '../../common/utils';
import uploadFile from '../../common/upload';

// 设置pid
export const pidSet = pid => dispatch => {
    dispatch({
        type: PID_SET,
        pid,
    });
};

// 设置元素
export const htmlTreeUpdate = htmlTree => dispatch => {
    dispatch({
        type: HTML_TREE_UPDATE,
        htmlTree,
    });
};

// 选中元素
export const activeIdSet = activeId => dispatch => {
    dispatch({
        type: ACTIVE_KEY_SET,
        activeId,
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
export const attributeLoad = (htmlTree, activeId) => dispatch => {
    const activeEle = utils.deepSearch(htmlTree, activeId);
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
export const elementSelect = (id, activeId, htmlTree, confirm) => dispatch => {
    dispatch(activeIdSet(id));
    dispatch(attributeLoad(htmlTree, id));
    if (id == activeId || confirm) {
        dispatch(isEditSet(true));
    } else {
        dispatch(isEditSet(false));
    }
};

// 设置画布位置
export const canvasPositionSet = canvasPosition => dispatch => {
    dispatch({
        type: CANVAS_POSITION_SET,
        canvasPosition,
    });
};

// 更改title
export const titleSet = title => dispatch => {
    dispatch({
        type: TITLE_SET,
        title,
    });
};

// 更改desc
export const descSet = desc => dispatch => {
    dispatch({
        type: DESC_SET,
        desc,
    });
};

// 更改dirName
export const dirNameSet = dirName => dispatch => {
    dispatch({
        type: DIRNAME_SET,
        dirName,
    });
};

// sidebar控制
export const navHandle = navIndex => dispatch => {
    dispatch({
        type: NAV_HANDLE,
        navIndex,
    });
};

// 页面初始化请求
export const pageInit = params => {
    return fetch({
        url: '/api/page/get',
        method: 'post',
        params,
    }).then(res => res.data);
};

// 保存数据
export const htmlSave = params => {
    return fetch({
        url: '/api/page/save',
        method: 'POST',
        params,
    }).then(res => res.data);
};

// 构建页面
export const htmlBuild = params => {
    return fetch({
        url: '/api/page/build',
        method: 'POST',
        params,
    }).then(res => res.data);
};

// 打开生成的页面
export const htmlOpen = params => {
    return fetch({
        url: '/api/page/open',
        method: 'POST',
        params,
    }).then(res => res.data);
};

// 发布页面
export const htmlRelease = params => {
    return fetch({
        url: '/api/page/release',
        method: 'POST',
        params,
    }).then(res => res.data);
};

export const htmlDownload = params => {
    return fetch({
        url: '/api/page/download',
        method: 'POST',
        params,
    }).then(res => res.data);
};

// 删除页面
export const htmlDelete = params => {
    return fetch({
        url: '/api/page/delete',
        method: 'POST',
        params,
    }).then(res => res.data);
};

// dialog控制
export const dialogHandle = (id, state) => dispatch => {
    dispatch({
        type: DIALOG_HANDLE,
        id,
        state,
    });
};

// 预览图保存
export const listPreviewSave = formData =>
    uploadFile({ url: '/api/file/list_preview_save', formData })
        .then(res => res.data.url)
        .catch(() => '');

// 上传icon
export const iconUpload = params => {
    return fetch({
        url: '/api/page/icon_save',
        method: 'POST',
        params,
    }).then(res => res.data);
};

// 设置icon列表
export const iconListSet = (iconfontUrl, iconList) => dispatch => {
    dispatch({
        type: ICON_LIST_SET,
        iconfontUrl,
        iconList,
    });
};

// 保存文件目录
export const dirNameSave = params => {
    return fetch({
        url: '/api/page/dirname_save',
        method: 'POST',
        params,
    }).then(res => res.data);
};

/*---------------------- 模板相关 ----------------------*/

// 监听ALT按键
export const ctrlListen = altDown => dispatch => {
    dispatch({
        type: ALT_DOWN,
        altDown,
    });
};

// 模板页面初始化请求
export const componentGet = params => {
    return fetch({
        url: '/api/component/get',
        method: 'post',
        params,
    }).then(res => res.data);
};

// 模板保存数据
export const componentSave = params => {
    return fetch({
        url: '/api/component/save',
        method: 'POST',
        params,
    }).then(res => res.data);
};
