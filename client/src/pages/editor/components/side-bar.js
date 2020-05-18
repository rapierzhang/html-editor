import React, { Component } from 'react';
import { connect } from 'react-redux';
import utils from '../../../common/utils';
import classNames from 'classnames';
import { Select, Switch } from '../../../component';
import { AttrList, Box } from './index';
import './side-bar.scss';
import {
    activeIdSet,
    attributeLoad,
    attributeUpdate,
    elementSelect,
    elementsUpdate,
    isEditSet,
    dialogHandle,
    iconUpload,
    iconListSet,
} from '../actions';
import Upload from '../../../component/common/upload';

const positionList = [
    {
        title: '没有定位',
        value: 'static',
    },
    {
        title: '父元素继承',
        value: 'initial',
    },
    {
        title: '父元素绝对定位',
        value: 'absolute',
    },
    {
        title: '窗口绝对定位',
        value: 'fixed',
    },
    {
        title: '相对定位',
        value: 'relative',
    },
];
const directionList = ['zIndex', 'top', 'right', 'bottom', 'left'];
const flexDirectionList = [
    {
        title: '横向',
        value: 'row',
    },
    {
        title: '横向反向',
        value: 'row-reverse',
    },
    {
        title: '纵向',
        value: 'column',
    },
    {
        title: '纵向反向',
        value: 'column-reverse',
    },
];
const justifyContentList = [
    {
        title: '头部对齐',
        value: 'flex-start',
    },
    {
        title: '末尾对齐',
        value: 'flex-end',
    },
    {
        title: '居中对齐',
        value: 'center',
    },
    {
        title: '两边对齐',
        value: 'space-between',
    },
    {
        title: '平均分布',
        value: 'space-around',
    },
];
const alignItemsList = [
    {
        title: '头部对齐',
        value: 'flex-start',
    },
    {
        title: '尾部对齐',
        value: 'flex-end',
    },
    {
        title: '居中对齐',
        value: 'center',
    },
    {
        title: '文字基线对齐',
        value: 'baseline',
    },
    {
        title: '占满高度',
        value: 'stretch',
    },
];
const bgRepeatList = [
    {
        title: '重复',
        value: 'repeat',
    },
    {
        title: 'X轴重复',
        value: 'repeat-x',
    },
    {
        title: 'Y轴重复',
        value: 'repeat-y',
    },
    {
        title: '不重复',
        value: 'no-repeat',
    },
];
const textAlignList = [
    {
        title: '居左',
        value: 'left'
    },
    {
        title: '居右',
        value: 'right'
    },
    {
        title: '居中',
        value: 'center'
    },
    {
        title: '两端',
        value: 'justify'
    },
];

class SideBar extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            navIndex: 0,
            hoverId: '',
            hoverNode: {},

            movingX: 0,
            movingY: 0,

            iconfontUrl: '',

            activeId: '',
            activeEle: {},
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { activeId, activeEle, iconfontUrl } = props.editorInfo;
        // 选中元素
        if (activeId != state.activeId) {
            return {
                activeId,
                activeEle,
            };
        }
        // 更新属性
        if (JSON.stringify(activeEle) != JSON.stringify(state.activeEle)) {
            // backgroundImage需要特殊处理url()
            const { css = {} } = activeEle;
            if (css.backgroundImage && css.backgroundImage != state.activeEle.css.backgroundImage) return null;

            return {
                activeId,
                activeEle,
            };
        }

        // if (iconfontUrl != state.iconfontUrl) {
        //     return {
        //         iconfontUrl
        //     }
        // }
        return null;
    }

    // 切换导航
    switchNav(navIndex) {
        this.setState({ navIndex });
    }

    // 样式更改
    onStyleChange(attrName, e) {
        const value = typeof e == 'object' ? e.target.value : e;
        const { elements, activeId } = this.props.editorInfo;
        const thisNode = utils.deepSearch(elements, activeId);
        const thisStyle = thisNode.css || {};
        const newNode = {
            ...thisNode,
            css: { ...thisStyle, [attrName]: value },
        };
        const newElements = utils.deepUpdate(elements, { [activeId]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        this.props.dispatch(attributeUpdate(newNode));
    }

    // 删除元素
    removeEle() {
        const { elements, activeId } = this.props.editorInfo;
        const newElements = utils.deepRemove(elements, activeId);
        this.props.dispatch(elementsUpdate(newElements));
        this.close();
    }

    // 关闭
    close() {
        this.props.dispatch(activeIdSet(false));
        this.props.dispatch(isEditSet(false));
    }

    // 弹窗控制
    dialogHandle(id, state) {
        this.props.dispatch(dialogHandle(id, state));
    }

    // 渲染树结构
    renderTree(elements, activeId, floor = 0) {
        const arr = Object.values(elements);
        return arr.map((ele, idx) => {
            const key = `${idx}-${parseInt(Math.random() * 1e5)}`;
            const row = (
                <div
                    key={key}
                    className={classNames('tree-item', { active: ele.id === activeId })}
                    style={{ paddingLeft: `${floor * 10}px` }}
                    onClick={this.selectNode.bind(this, ele)}
                    onMouseDown={this.showMenu.bind(this, ele.id)}
                >
                    <span>|- {ele.element}</span>
                </div>
            );
            if (ele.children) {
                return [row, this.renderTree(ele.children, activeId, floor + 1)];
            } else {
                return row;
            }
        });
    }

    // 选择节点
    selectNode(ele) {
        this.setState({ hoverId: '' });
        const { activeId, elements } = this.props.editorInfo;
        this.props.dispatch(elementSelect(ele.id, activeId, elements));
    }

    // 展示菜单
    showMenu(hoverId, e) {
        const { button, pageX, pageY } = e;
        if (button == 2) {
            const { elements, activeId } = this.props.editorInfo;
            const hoverNode = utils.deepSearch(elements, hoverId);
            const contain = utils.deepSearch({ [hoverId]: hoverNode }, activeId).hasOwnProperty('element');
            // 父元素不能插入子元素中
            if (!contain) {
                this.setState({
                    movingX: pageX,
                    movingY: pageY,
                    hoverId,
                    hoverNode,
                });
            }
        }
    }

    // 隐藏菜单
    hideMenu(e) {
        e.stopPropagation();
        this.setState({ hoverId: '' });
    }

    // 更改树的结构
    changeTree(position) {
        let newTree = {};
        const { elements, activeId } = this.props.editorInfo;
        const { hoverId, hoverNode } = this.state;
        if (activeId === 'root' && utils.has(['before', 'after'], position)) {
            utils.toast('不能插入在Root元素前后');
            return;
        }
        // 先将hover的元素删除
        const removedElements = utils.deepRemove(elements, hoverId);
        // 在插入到相应位置
        switch (position) {
            case 'before':
                newTree = utils.deepInsertSameFloor(removedElements, activeId, true, { [hoverId]: hoverNode });
                break;
            case 'in':
                newTree = utils.deepInsert(removedElements, activeId, { [hoverId]: hoverNode });
                break;
            case 'after':
                newTree = utils.deepInsertSameFloor(removedElements, activeId, false, { [hoverId]: hoverNode });
                break;
        }
        // 更新树
        this.props.dispatch(elementsUpdate(newTree));
    }

    // 切换flex
    onFlexSwitch(status) {
        if (status) {
            this.onStyleChange('display', 'flex');
        } else {
            this.onStyleChange('display', 'block');
        }
    }

    onBgUploadSucc(data) {
        const { url } = data;
        this.onStyleChange('backgroundImage', `url(${url})`);
    }

    onBgUploadErr() {
        utils.toast('上传失败');
    }

    // 背景图相关
    bgImageFocus() {
        const { activeEle } = this.state;
        const { css } = activeEle;
        let { backgroundImage = '' } = css;
        const bgImageMatch = backgroundImage.match(/url\((.*)\)/, '$1');
        if (bgImageMatch) {
            activeEle.css.backgroundImage = bgImageMatch[1];
            this.setState({ activeEle });
        }
    }

    bgImageChange(e) {
        const { activeEle } = this.state;
        activeEle.css.backgroundImage = e.target.value;
        this.setState({ activeEle });
    }

    bgImageBlur(e) {
        const backgroundImage = e.target.value ? `url(${e.target.value})` : '';
        const { activeEle } = this.state;
        activeEle.css.backgroundImage = backgroundImage;
        this.setState({ activeEle });
        this.onStyleChange('backgroundImage', backgroundImage);
    }

    onIconChange(e) {
        this.setState({ iconfontUrl: e.target.value });
    }

    // iconfont上传
    uploadIcon() {
        const { pid } = this.props.editorInfo;
        const { iconfontUrl } = this.state;
        iconUpload({ pid, iconfontUrl })
            .then(res => {
                const { iconfontUrl, iconList } = res;
                const header = document.getElementById('iconfont');
                header.setAttribute('href', iconfontUrl);
                this.props.dispatch(iconListSet(iconfontUrl, iconList));
                utils.toast('上传成功');
            })
            .catch(err => {
                utils.toast('上传失败');
            });
    }

    iconSelect(icon) {
        const { elements, activeId, activeEle: thisNode } = this.props.editorInfo;
        const extClass = icon;
        const newNode = {
            ...thisNode,
            extClass,
        };
        const newElements = utils.deepUpdate(elements, { [activeId]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        this.props.dispatch(attributeUpdate(newNode));
    }

    render() {
        const { pid, elements, isEdit, dialogMap, iconList = [], iconfontUrl: defaultIconUrl } = this.props.editorInfo;
        const { navIndex, movingX, movingY, hoverId, activeId, activeEle, iconfontUrl } = this.state;
        const { css = {} } = activeEle;
        const dialogStatus = dialogMap[activeId];

        return (
            <div className='side-bar' onClick={this.hideMenu.bind(this)}>
                {/*------ 菜单 必须有选中才展示 ------*/}
                {activeId && hoverId && activeId != hoverId && (
                    <div className='attr-menu' style={{ left: movingX, top: movingY }}>
                        <div className='row' onClick={this.changeTree.bind(this, 'before')}>
                            移动到选中元素前
                        </div>
                        <div className='row' onClick={this.changeTree.bind(this, 'in')}>
                            移动到选中元素内
                        </div>
                        <div className='row' onClick={this.changeTree.bind(this, 'after')}>
                            移动到选中元素后
                        </div>
                    </div>
                )}
                {isEdit ? (
                    <div className='attr-list'>
                        {/*------ nav ------*/}
                        <div className='nav'>
                            <span
                                className={classNames('nav-item', { actived: navIndex == 0 })}
                                onClick={this.switchNav.bind(this, 0)}
                            >
                                属性
                            </span>
                            <span
                                className={classNames('nav-item', { actived: navIndex == 1 })}
                                onClick={this.switchNav.bind(this, 1)}
                            >
                                样式
                            </span>
                            <button className='close' onClick={this.close.bind(this)}>
                                X
                            </button>
                        </div>
                        {/*------ 属性 ------*/}
                        {navIndex === 0 && (
                            <div className='attr-box'>
                                <div className='attr-card'>
                                    <div className='card-content'>
                                        <div className='row'>id: {activeId}</div>
                                        {activeEle.element === 'Dialog' && (
                                            <div className='row'>
                                                <span>展示</span>
                                                <Switch
                                                    onChange={this.dialogHandle.bind(this, activeEle)}
                                                    value={dialogStatus}
                                                />
                                            </div>
                                        )}
                                        {activeEle.element === 'Icon' && (
                                            <div>
                                                <div className='row'>
                                                    <input
                                                        className='icon-input'
                                                        type='text'
                                                        placeholder={defaultIconUrl}
                                                        value={iconfontUrl}
                                                        onChange={this.onIconChange.bind(this)}
                                                    />
                                                    <div
                                                        className='button primary'
                                                        onClick={this.uploadIcon.bind(this)}
                                                    >
                                                        上传
                                                    </div>
                                                </div>
                                                <div className='icon-box'>
                                                    {iconList.map((icon, idx) => (
                                                        <div
                                                            key={`icon-${idx}`}
                                                            className='icon-item'
                                                            onClick={this.iconSelect.bind(this, icon)}
                                                        >
                                                            <i className={classNames('iconfont', icon)} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {/*------ 属性列表 ------*/}
                                        <AttrList />
                                        {/*------ 删除节点 ------*/}
                                        {activeId !== 'root' && (
                                            <div className='row'>
                                                <div
                                                    className='del-ele button danger'
                                                    onClick={this.removeEle.bind(this)}
                                                >
                                                    删除节点
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/*------ 样式 ------*/}
                        {navIndex === 1 && (
                            <div className='style-box'>
                                {/*------ 定位 ------*/}
                                {!utils.has(['Root', 'Dialog'], activeEle.element) && (
                                    <div className='attr-card'>
                                        <div className='card-title'>定位</div>
                                        <div className='card-content'>
                                            <div className='row'>
                                                <span>定位: </span>
                                                <Select
                                                    list={positionList}
                                                    value={css.position || 'static'}
                                                    titleShow
                                                    onChange={this.onStyleChange.bind(this, 'position')}
                                                />
                                            </div>
                                            {utils.has(['absolute', 'fixed', 'relative'], css.position) &&
                                                directionList.map((row, idx) => (
                                                    <div key={`row-${idx}`} className='row'>
                                                        <span>{row}: </span>
                                                        <input
                                                            type='text'
                                                            onChange={this.onStyleChange.bind(this, row)}
                                                            value={css[row]}
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                                {/*------ 排列 ------*/}
                                {utils.has(['View', 'ScrollView', 'Form', 'Upload', 'Text'], activeEle.element) && (
                                    <div className='attr-card'>
                                        <div className='card-title'>flex布局</div>
                                        <div className='card-content'>
                                            <div className='row'>
                                                <span>启用</span>
                                                <Switch
                                                    onChange={this.onFlexSwitch.bind(this)}
                                                    value={css.display == 'flex'}
                                                />
                                            </div>
                                            {css.display == 'flex' && (
                                                <div>
                                                    <div className='row'>
                                                        <span>主轴</span>
                                                        <Select
                                                            titleShow
                                                            list={flexDirectionList}
                                                            value={css.flexDirection || 'row'}
                                                            onChange={this.onStyleChange.bind(this, 'flexDirection')}
                                                        />
                                                    </div>
                                                    <div className='row'>
                                                        <span>主轴对齐方式</span>
                                                        <Select
                                                            titleShow
                                                            list={justifyContentList}
                                                            value={css.justifyContent || 'flex-start'}
                                                            onChange={this.onStyleChange.bind(this, 'justifyContent')}
                                                        />
                                                    </div>
                                                    <div className='row'>
                                                        <span>交叉轴对齐方式</span>
                                                        <Select
                                                            titleShow
                                                            list={alignItemsList}
                                                            value={css.alignItems || 'stretch'}
                                                            onChange={this.onStyleChange.bind(this, 'alignItems')}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {/*------ 文字排列 ^^^^^^------*/}
                                {/*{utils.has(['Text'], activeEle.element) && (
                                    <div className='attr-card'>
                                        <div className='card-title'>文字布局</div>
                                        <div className='card-content'>
                                            <div className='row'>
                                                <span>文字排列</span>
                                                <Select
                                                    titleShow
                                                    list={textAlignList}
                                                    value={css.textAlign || 'left'}
                                                    onChange={this.onStyleChange.bind(this, 'textAlign')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}*/}
                                {/*------ 背景 ------*/}
                                {utils.has(
                                    ['Root', 'View', 'ScrollView', 'Form', 'Upload', 'Submit'],
                                    activeEle.element,
                                ) && (
                                    <div className='attr-card'>
                                        <div className='card-title'>背景</div>
                                        <div className='card-content'>
                                            <div className='row'>
                                                <span>背景颜色: </span>
                                                <input
                                                    type='text'
                                                    value={css.backgroundColor}
                                                    placeholder='#xxxxxx 或 rgb(*, *, *)'
                                                    onChange={this.onStyleChange.bind(this, 'backgroundColor')}
                                                />
                                            </div>
                                            <div className='row'>
                                                <span>背景图: </span>
                                                <div className='upload-image'>
                                                    <input
                                                        type='text'
                                                        placeholder='url(*****)'
                                                        value={css.backgroundImage}
                                                        onFocus={this.bgImageFocus.bind(this)}
                                                        onChange={this.bgImageChange.bind(this)}
                                                        onBlur={this.bgImageBlur.bind(this)}
                                                    />
                                                    {/*^^^^^^*/}
                                                    <Upload
                                                        className='upload-btn'
                                                        url={'http://localhost:3000/api/file/upload'}
                                                        fileName='file'
                                                        data={{ pid: '65d0cf96c6104d6a8b0dec6e3c6b3023' }}
                                                        onUploadSucc={this.onBgUploadSucc.bind(this)}
                                                        onUploadErr={this.onBgUploadErr.bind(this)}
                                                    >
                                                        <span>上传</span>
                                                    </Upload>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <span>背景位置: </span>
                                                <input
                                                    type='text'
                                                    placeholder='**px **px'
                                                    onChange={this.onStyleChange.bind(this, 'backgroundPosition')}
                                                    value={css.backgroundPosition}
                                                />
                                            </div>
                                            <div className='row'>
                                                <span>背景大小: </span>
                                                <input
                                                    type='text'
                                                    placeholder='xx% xx%'
                                                    onChange={this.onStyleChange.bind(this, 'backgroundSize')}
                                                    value={css.backgroundPosition}
                                                />
                                            </div>
                                            <div className='row'>
                                                <span>背景重复: </span>
                                                <Select
                                                    list={bgRepeatList}
                                                    value={css.backgroundRepeat || 'repeat'}
                                                    titleShow
                                                    onChange={this.onStyleChange.bind(this, 'backgroundRepeat')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/*------ 字体 ------*/}
                                {utils.has(
                                    ['Root', 'Text', 'Input', 'Textarea', 'Submit', 'Icon'],
                                    activeEle.element,
                                ) && (
                                    <div className='attr-card'>
                                        <div className='card-title'>字体</div>
                                        <div className='card-content'>
                                            <div className='row'>
                                                <span>字号: </span>
                                                <input
                                                    type='text'
                                                    value={css.fontSize}
                                                    placeholder='12px'
                                                    onChange={this.onStyleChange.bind(this, 'fontSize')}
                                                />
                                            </div>
                                            <div className='row'>
                                                <span>颜色: </span>
                                                <input
                                                    type='text'
                                                    placeholder='#xxxxxx 或 rgb(*, *, *)'
                                                    value={css.color}
                                                    onChange={this.onStyleChange.bind(this, 'color')}
                                                />
                                            </div>
                                            <div className='row'>
                                                <span>粗细: </span>
                                                <input
                                                    type='500'
                                                    onChange={this.onStyleChange.bind(this, 'fontWeight')}
                                                    value={css.fontWeight}
                                                />
                                            </div>
                                            <div className='row'>
                                                <span>字体: </span>
                                                <input
                                                    type='text'
                                                    value={css.fontFamily}
                                                    onChange={this.onStyleChange.bind(this, 'fontFamily')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/*------ 其他 ------*/}
                                {!utils.has(['Root', 'Dialog'], activeEle.element) && (
                                    <div className='attr-card'>
                                        <div className='card-title'>其他</div>
                                        <div className='card-content'>
                                            <div className='row'>
                                                <span>圆角</span>
                                                <input
                                                    type='text'
                                                    placeholder='0px'
                                                    value={css.borderRadius}
                                                    onChange={this.onStyleChange.bind(this, 'borderRadius')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/*------ 盒子模型 ------*/}
                                {!utils.has(['Dialog'], activeEle.element) && (
                                    <Box css={css} activeEle={activeEle} onChange={this.onStyleChange.bind(this)} />
                                )}
                                {/*------ 扩展 ------*/}
                                <div className='attr-card'>
                                    <div className='card-title'>扩展</div>
                                    <div className='card-content'>
                                        <textarea
                                            className='extra'
                                            cols='50'
                                            rows='30'
                                            value={css.extra}
                                            onChange={this.onStyleChange.bind(this, 'extra')}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='tree' ref='tree'>
                        {this.renderTree(elements, activeId)}
                    </div>
                )}
            </div>
        );
    }
}

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(SideBar);
