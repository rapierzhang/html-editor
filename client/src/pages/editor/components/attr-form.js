import React, { Component } from 'react';
import { connect } from 'react-redux';
import utils from '../../../common/utils';
import classNames from 'classnames';
import { Select, Switch } from '../../../component';
import { AttrList } from './index';
import './attr-form.scss';
import {
    activeIdSet,
    attributeLoad,
    attributeUpdate,
    elementSelect,
    elementsUpdate,
    isEditSet,
    dialogHandle,
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
const directionList = ['z-index', 'top', 'right', 'bottom', 'left'];
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

class ArrtForm extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            navIndex: 0,
            hoverId: '',
            hoverNode: {},

            movingX: 0,
            movingY: 0,
        };
    }

    static getDerivedStateFromProps(props, state) {
        // console.error(props.editorInfo.activeEle)
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
    showMenu(id, e) {
        const { button, pageX, pageY } = e;
        const { elements } = this.props.editorInfo;
        const hoverNode = utils.deepSearch(elements, id);
        if (button == 2) {
            this.setState({
                movingX: pageX,
                movingY: pageY,
                hoverId: id,
                hoverNode,
            });
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

    render() {
        const { pid, elements, isEdit, activeId, activeEle = {} } = this.props.editorInfo;
        const { navIndex, movingX, movingY, hoverId } = this.state;
        const { css = {} } = activeEle;

        return (
            <div className='attribute' onClick={this.hideMenu.bind(this)}>
                {/*------ 菜单 ------*/}
                {activeId && hoverId && activeId != hoverId && (
                    <div className='attr-phantom' style={{ left: movingX, top: movingY }}>
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
                                        <div className='row'>id: {activeEle.id}</div>
                                        <div className='row'>
                                            <span>展示</span>
                                            {activeEle.element === 'Dialog' && (
                                                <Switch onChange={this.dialogHandle.bind(this, activeEle.id)} />
                                            )}
                                        </div>
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
                                {utils.has(['View', 'ScrollView', 'Form', 'Upload'], activeEle.element) && (
                                    <div className='attr-card'>
                                        <div className='card-title'>flax布局</div>
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
                                {/*------ 背景 ------*/}
                                {utils.has(
                                    ['Root', 'View', 'ScrollView', 'Form', 'Upload', 'Submit'],
                                    activeEle.element,
                                ) && (
                                    <div className='attr-card'>
                                        <div className='card-title'>背景</div>
                                        <div className='card-content'>
                                            <div className='row'>
                                                <span>背景图: </span>
                                                <input
                                                    type='text'
                                                    onChange={this.onStyleChange.bind(this, 'backgroundImage')}
                                                    value={css.backgroundImage}
                                                />
                                            </div>
                                            <div className='row'>
                                                <span>背景颜色: </span>
                                                <input
                                                    type='text'
                                                    onChange={this.onStyleChange.bind(this, 'backgroundColor')}
                                                    value={css.backgroundColor}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/*------ 字体 ------*/}
                                {utils.has(['Root', 'Text', 'Input', 'Textarea', 'Submit'], activeEle.element) && (
                                    <div className='attr-card'>
                                        <div className='card-title'>字体</div>
                                        <div className='card-content'>
                                            <div className='row'>
                                                <span>字号: </span>
                                                <input
                                                    type='text'
                                                    onChange={this.onStyleChange.bind(this, 'fontSize')}
                                                    value={css.fontSize}
                                                />
                                            </div>
                                            <div className='row'>
                                                <span>颜色: </span>
                                                <input
                                                    type='text'
                                                    onChange={this.onStyleChange.bind(this, 'color')}
                                                    value={css.color}
                                                />
                                            </div>
                                            <div className='row'>
                                                <span>粗细: </span>
                                                <input
                                                    type='text'
                                                    onChange={this.onStyleChange.bind(this, 'fontWeight')}
                                                    value={css.fontWeight}
                                                />
                                            </div>
                                            <div className='row'>
                                                <span>字体: </span>
                                                <input
                                                    type='text'
                                                    onChange={this.onStyleChange.bind(this, 'fontFamily')}
                                                    value={css.fontFamily}
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
                                                    onChange={this.onStyleChange.bind(this, 'borderRadius')}
                                                    value={css.borderRadius}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/*------ 盒子模型 ------*/}
                                {!utils.has(['Root', 'Dialog'], activeEle.element) && (
                                    <div className='attr-card'>
                                        <div className='card-title'>盒子</div>
                                        <div className='card-content'>
                                            <div className='box-model'>
                                                <span className='tag'>margin</span>
                                                <input
                                                    className='box-input'
                                                    type='text'
                                                    placeholder='-'
                                                    onChange={this.onStyleChange.bind(this, 'marginLeft')}
                                                    value={css.marginLeft}
                                                />
                                                <div className='margin-inner'>
                                                    <input
                                                        className='box-input'
                                                        type='text'
                                                        placeholder='-'
                                                        onChange={this.onStyleChange.bind(this, 'marginTop')}
                                                        value={css.marginTop}
                                                    />
                                                    <div className='border'>
                                                        <span className='tag'>border</span>
                                                        <input
                                                            className='box-input'
                                                            type='text'
                                                            placeholder='-'
                                                            onChange={this.onStyleChange.bind(this, 'borderLeft')}
                                                            value={css.borderLeft}
                                                        />
                                                        <div className='border-inner'>
                                                            <input
                                                                className='box-input'
                                                                type='text'
                                                                placeholder='-'
                                                                onChange={this.onStyleChange.bind(this, 'borderTop')}
                                                                value={css.borderTop}
                                                            />
                                                            <div className='padding'>
                                                                <span className='tag'>padding</span>

                                                                <input
                                                                    className='padding-input'
                                                                    type='text'
                                                                    placeholder='-'
                                                                    onChange={this.onStyleChange.bind(
                                                                        this,
                                                                        'paddingLeft',
                                                                    )}
                                                                    value={css.paddingLeft}
                                                                />
                                                                <div className='padding-inner'>
                                                                    <input
                                                                        className='padding-input'
                                                                        type='text'
                                                                        placeholder='-'
                                                                        onChange={this.onStyleChange.bind(
                                                                            this,
                                                                            'paddingTop',
                                                                        )}
                                                                        value={css.paddingTop}
                                                                    />
                                                                    <div className='entity'>
                                                                        <input
                                                                            className='entity-input'
                                                                            type='text'
                                                                            placeholder='width'
                                                                            onChange={this.onStyleChange.bind(
                                                                                this,
                                                                                'width',
                                                                            )}
                                                                            value={css.width}
                                                                        />
                                                                        x
                                                                        <input
                                                                            className='entity-input'
                                                                            type='text'
                                                                            placeholder='height'
                                                                            onChange={this.onStyleChange.bind(
                                                                                this,
                                                                                'height',
                                                                            )}
                                                                            value={css.height}
                                                                        />
                                                                    </div>
                                                                    <input
                                                                        className='padding-input'
                                                                        type='text'
                                                                        placeholder='-'
                                                                        onChange={this.onStyleChange.bind(
                                                                            this,
                                                                            'paddingBottom',
                                                                        )}
                                                                        value={css.paddingBottom}
                                                                    />
                                                                </div>
                                                                <input
                                                                    className='padding-input'
                                                                    type='text'
                                                                    placeholder='-'
                                                                    onChange={this.onStyleChange.bind(
                                                                        this,
                                                                        'paddingRight',
                                                                    )}
                                                                    value={css.paddingRight}
                                                                />
                                                            </div>
                                                            <input
                                                                className='box-input'
                                                                type='text'
                                                                placeholder='-'
                                                                onChange={this.onStyleChange.bind(this, 'borderBottom')}
                                                                value={css.borderBottom}
                                                            />
                                                        </div>
                                                        <input
                                                            className='box-input'
                                                            type='text'
                                                            placeholder='-'
                                                            onChange={this.onStyleChange.bind(this, 'borderRight')}
                                                            value={css.borderRight}
                                                        />
                                                    </div>
                                                    <input
                                                        className='box-input'
                                                        type='text'
                                                        placeholder='-'
                                                        onChange={this.onStyleChange.bind(this, 'marginBottom')}
                                                        value={css.marginBottom}
                                                    />
                                                </div>
                                                <input
                                                    className='box-input'
                                                    type='text'
                                                    placeholder='-'
                                                    onChange={this.onStyleChange.bind(this, 'marginRight')}
                                                    value={css.marginRight}
                                                />
                                            </div>
                                        </div>
                                    </div>
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
)(ArrtForm);
