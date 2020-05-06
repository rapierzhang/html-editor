import React, { Component } from 'react';
import { connect } from 'react-redux';
import utils from '../../../common/utils';
import classNames from 'classnames';
import { Select, Switch } from '../../../component';
import { AttrList } from './index';
import './attr-form.scss';
import { activeKeySet, attributeLoad, attributeUpdate, elementSelect, elementsUpdate, isEditSet } from '../actions';
import Upload from '../../../component/common/upload';

const positionList = ['initial', 'absolute', 'fixed', 'relative', 'static', 'sticky', 'inherit'];
const directionList = ['z-index', 'top', 'right', 'bottom', 'left'];
const flexDirectionList = [
    {
        value: 'row',
        title: '横向',
    },
    {
        value: 'row-reverse',
        title: '横向反向',
    },
    {
        value: 'column',
        title: '纵向',
    },
    {
        value: 'column-reverse',
        title: '纵向反向',
    },
];
const justifyContentList = [
    {
        title: '头部对齐',
        value: 'flex-start'
    },
    {
        title: '末尾对齐',
        value: 'flex-end'
    },
    {
        title: '居中对齐',
        value: 'center'
    },
    {
        title: '两边对齐',
        value: 'space-between'
    },
    {
        title: '平均分布',
        value: 'space-around'
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
]

class ArrtForm extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            navIndex: 0,
            isDown: false,
            movingX: 0,
            movingY: 0,

            treeTop: 0,
            treeBottom: 0,
            treeLeft: 0,
            treeRight: 0,
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
    onStyleBlur(attrName, e) {
        const value = typeof e == 'object' ? e.target.value : e;
        const { elements, activeKey } = this.props.editorInfo;
        const thisNode = utils.deepSearch(elements, activeKey);
        const thisStyle = thisNode.css || {};
        const newNode = {
            ...thisNode,
            css: { ...thisStyle, [attrName]: value },
        };
        const newElements = utils.deepUpdate(elements, { [activeKey]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        this.props.dispatch(attributeUpdate(newNode));
    }

    // 删除元素
    removeEle() {
        const { elements, activeKey } = this.props.editorInfo;
        const newElements = utils.deepRemove(elements, activeKey);
        this.props.dispatch(elementsUpdate(newElements));
        this.close();
    }

    // 关闭
    close() {
        this.props.dispatch(activeKeySet(false));
        this.props.dispatch(isEditSet(false));
    }

    // 渲染树结构
    renderTree(elements, activeKey, floor = 0) {
        const arr = Object.values(elements);
        return arr.map((ele, idx) => {
            const key = `${idx}-${parseInt(Math.random() * 1e5)}`;
            const row = (
                <div
                    key={key}
                    className={classNames('tree-item', { active: ele.id === activeKey })}
                    style={{ paddingLeft: `${floor * 10}px` }}
                    // onClick={this.selectEle.bind(this, ele.key)} ^^^^^^
                    onMouseDown={this.onDragTree.bind(this, ele)}
                >
                    |- {ele.element}
                </div>
            );
            if (ele.children) {
                return [row, this.renderTree(ele.children, activeKey, floor + 1)];
            } else {
                return row;
            }
        });
    }

    // 获取树的定位
    treePosition() {
        const tree = this.refs.tree;
        const { offsetTop, offsetHeight, offsetLeft, offsetWidth } = tree;
        this.setState({
            treeTop: offsetTop,
            treeBottom: offsetTop + offsetHeight,
            treeLeft: offsetLeft,
            treeRight: offsetLeft + offsetWidth,
        });
    }

    // 选择节点
    selectNode(ele) {
        const { activeKey, elements } = this.props.editorInfo;
        this.props.dispatch(elementSelect(ele.id, activeKey, elements));
    }

    // 拖拽树的节点
    onDragTree(ele, evt) {
        const firstTime = new Date().getTime();
        this.treePosition();
        this.setState({ isDown: true });

        // 拖拽中
        window.onmousemove = e => {
            if (!this.state.isDown) return;
            //获取x和y
            this.setState({
                movingX: e.clientX,
                movingY: e.clientY,
            });
        };
        // 拖拽结束
        window.onmouseup = e => {
            const lastTime = new Date().getTime();
            // 解决onMousedown和onClick冲突
            if (lastTime - firstTime < 300) {
                this.selectNode(ele);
                this.setState({ isDown: false });
            } else {
                const { elements } = this.props.editorInfo;
                const { isDown, treeTop, treeBottom, treeLeft, treeRight } = this.state;
                if (!isDown) return;

                const endX = e.clientX;
                const endY = e.clientY;
                if (endX > treeLeft && endX < treeRight && endY > treeTop && endY < treeBottom) {
                    // 先删除节点
                    const removedElements = utils.deepRemove(elements, ele.id);
                    // 深度优先遍历子节点
                    const treeArr = utils.objDepthFirstTraversal(elements);
                    // 重置虚拟元素
                    this.setState({ isDown: false, movingX: 0, movingY: 0 });
                    // 判断加载哪个元素的前后
                    const index = Math.floor(endY / 30) - 1; // 第几个元素

                    const dot = ((endY / 30).toFixed(1) - index).toFixed(1);
                    const isBefore = treeArr.length - 1 > index ? true : dot < 0.5; //前后
                    const hoverId = treeArr[Math.min(index, treeArr.length - 1)]; // 最后悬停时的元素key
                    if (hoverId == ele.id) return; // 没变return
                    const newElements = utils.deepInsertSameFloor(removedElements, hoverId, isBefore, {
                        [ele.id]: ele,
                    });
                    this.props.dispatch(elementsUpdate(newElements));
                    console.error('在里面');
                } else {
                    console.error('在外面');
                    return;
                }
            }
        };
    }

    // 切换flex
    onFlexSwitch(status) {
        if (status) {
            this.onStyleBlur('display', 'flex');
        } else {
            this.onStyleBlur('display', 'block');
        }
    }

    render() {
        const { pid, elements, isEdit, activeKey, activeEle = {} } = this.props.editorInfo;
        const { navIndex, isDown, movingX, movingY } = this.state;
        const { css = {} } = activeEle;

        return (
            <div className='attribute'>
                {isDown && (
                    <div className='attr-phantom' style={{ left: movingX, top: movingY }}>
                        000
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
                                        {/*------ 属性列表 ------*/}
                                        <AttrList />
                                        {/*^^^^^^
                                        <div className='row'>
                                            <Upload url={'http://localhost:3000/api/file/upload'} fileName='file' data={{ pid }}>
                                                <div>上传</div>
                                            </Upload>
                                        </div>*/}
                                        {/*------ 删除 ------*/}
                                        <div className='row'>
                                            <div className='del-ele button danger' onClick={this.removeEle.bind(this)}>
                                                删除节点
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/*------ 样式 ------*/}
                        {navIndex === 1 && (
                            <div className='style-box'>
                                {/*------ 定位 ------*/}
                                <div className='attr-card'>
                                    <div className='card-title'>定位</div>
                                    <div className='card-content'>
                                        <div className='row'>
                                            <span>定位: </span>
                                            <Select
                                                list={positionList}
                                                value={css.position || 'inherit'}
                                                onChange={this.onStyleBlur.bind(this, 'position')}
                                            />
                                        </div>
                                        {utils.has(['absolute', 'fixed', 'relative'], css.position) &&
                                            directionList.map((row, idx) => (
                                                <div key={`row-${idx}`} className='row'>
                                                    <span>{row}: </span>
                                                    <input
                                                        type='text'
                                                        onBlur={this.onStyleBlur.bind(this, row)}
                                                        value={activeEle.css[row]}
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                {/*------ 大小 ------*/}
                                {/*<div className='attr-card'>
                                    <div className='card-title'>大小</div>
                                    <div className='card-content'>
                                        <div className='row'>
                                            <span>宽</span>
                                            <input
                                                className='entity-input'
                                                type='text'
                                                placeholder='width'
                                                onBlur={this.onStyleBlur.bind(this, 'width')}
                                                value={css.width}
                                            />
                                        </div>
                                        <div className='row'>
                                            <span>高</span>
                                            <input
                                                className='entity-input'
                                                type='text'
                                                onBlur={this.onStyleBlur.bind(this, 'height')}
                                                value={css.height}
                                            />
                                        </div>
                                        <div className='row'>
                                            <span>外边距</span>
                                        </div>
                                        <div className="row">
                                            <span className='size-text'>上</span>
                                            <input
                                                className='size-input'
                                                type='text'
                                                onBlur={this.onStyleBlur.bind(this, 'marginTop')}
                                                value={css.marginTop}
                                            />
                                            <span className='size-text'>右</span>
                                            <input
                                                className='size-input'
                                                type='text'
                                                onBlur={this.onStyleBlur.bind(this, 'marginRight')}
                                                value={css.marginRight}
                                            />
                                            <span className='size-text'>下</span>
                                            <input
                                                className='size-input'
                                                type='text'
                                                onBlur={this.onStyleBlur.bind(this, 'marginBottom')}
                                                value={css.marginBottom}
                                            />
                                            <span className='size-text'>左</span>
                                            <input
                                                className='size-input'
                                                type='text'
                                                onBlur={this.onStyleBlur.bind(this, 'marginLeft')}
                                                value={css.marginLeft}
                                            />
                                        </div>
                                    </div>
                                </div>*/}
                                {/*------ 排列 ------*/}
                                {utils.has(['View', 'ScrollView', 'Form'], activeEle.element) && (
                                    <div className='attr-card'>
                                        <div className='card-title'>flax布局</div>
                                        <div className='card-content'>
                                            <div className='row'>
                                                <span>启用</span>
                                                <Switch
                                                    onChange={this.onFlexSwitch.bind(this)}
                                                    value={activeEle.css.display == 'flex'}
                                                />
                                            </div>
                                            {activeEle.css.display == 'flex' && (
                                                <div>
                                                    <div className='row'>
                                                        <span>主轴</span>
                                                        <Select
                                                            list={flexDirectionList}
                                                            value={css.flexDirection || 'row'}
                                                            onChange={this.onStyleBlur.bind(this, 'flexDirection')}
                                                        />
                                                    </div>
                                                    <div className='row'>
                                                        <span>主轴对齐方式</span>
                                                        <Select
                                                            list={justifyContentList}
                                                            value={css.justifyContent || 'flex-start'}
                                                            onChange={this.onStyleBlur.bind(this, 'justifyContent')}
                                                        />
                                                    </div>
                                                    <div className='row'>
                                                        <span>交叉轴对齐方式</span>
                                                        <Select
                                                            list={alignItemsList}
                                                            value={css.alignItems || 'stretch'}
                                                            onChange={this.onStyleBlur.bind(this, 'alignItems')}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {/*------ 背景 ------*/}
                                {utils.has(['View', 'ScrollView', 'Form', 'Submit'], activeEle.element) && (
                                    <div className='attr-card'>
                                        <div className='card-title'>背景</div>
                                        <div className='card-content'>
                                            <div className='row'>
                                                <span>背景图: </span>
                                                <input
                                                    type='text'
                                                    onBlur={this.onStyleBlur.bind(this, 'backgroundImage')}
                                                    value={css.backgroundImage}
                                                />
                                            </div>
                                            <div className='row'>
                                                <span>背景颜色: </span>
                                                <input
                                                    type='text'
                                                    onBlur={this.onStyleBlur.bind(this, 'backgroundColor')}
                                                    value={css.backgroundColor}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/*------ 字体 ------*/}
                                {utils.has(['Text', 'Input', 'Textarea', 'Submit'], activeEle.element) && (
                                    <div className='attr-card'>
                                        <div className='card-title'>字体</div>
                                        <div className='card-content'>
                                            <div className='row'>
                                                <span>字号: </span>
                                                <input
                                                    type='text'
                                                    onBlur={this.onStyleBlur.bind(this, 'fontSize')}
                                                    value={css.fontSize}
                                                />
                                            </div>
                                            <div className='row'>
                                                <span>颜色: </span>
                                                <input
                                                    type='text'
                                                    onBlur={this.onStyleBlur.bind(this, 'color')}
                                                    value={css.color}
                                                />
                                            </div>
                                            <div className='row'>
                                                <span>字体: </span>
                                                <input
                                                    type='text'
                                                    onBlur={this.onStyleBlur.bind(this, 'fontFamily')}
                                                    value={css.fontFamily}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/*------ 盒子模型 ------*/}
                                <div className='attr-card'>
                                    <div className='card-title'>盒子</div>
                                    <div className='card-content'>
                                        <div className='box-model'>
                                            <span className='tag'>margin</span>
                                            <input
                                                className='box-input'
                                                type='text'
                                                placeholder='-'
                                                onChange={this.onStyleBlur.bind(this, 'marginLeft')}
                                                value={css.marginLeft}
                                            />
                                            <div className='margin-inner'>
                                                <input
                                                    className='box-input'
                                                    type='text'
                                                    placeholder='-'
                                                    onBlur={this.onStyleBlur.bind(this, 'marginTop')}
                                                    value={css.marginTop}
                                                />
                                                <div className='border'>
                                                    <span className='tag'>border</span>
                                                    <input
                                                        className='box-input'
                                                        type='text'
                                                        placeholder='-'
                                                        onBlur={this.onStyleBlur.bind(this, 'borderLeft')}
                                                        value={css.borderLeft}
                                                    />
                                                    <div className='border-inner'>
                                                        <input
                                                            className='box-input'
                                                            type='text'
                                                            placeholder='-'
                                                            onBlur={this.onStyleBlur.bind(this, 'borderTop')}
                                                            value={css.borderTop}
                                                        />
                                                        <div className='padding'>
                                                            <span className='tag'>padding</span>

                                                            <input
                                                                className='padding-input'
                                                                type='text'
                                                                placeholder='-'
                                                                onBlur={this.onStyleBlur.bind(this, 'paddingLeft')}
                                                                value={css.paddingLeft}
                                                            />
                                                            <div className='padding-inner'>
                                                                <input
                                                                    className='padding-input'
                                                                    type='text'
                                                                    placeholder='-'
                                                                    onBlur={this.onStyleBlur.bind(this, 'paddingTop')}
                                                                    value={css.paddingTop}
                                                                />
                                                                <div className='entity'>
                                                                    <input
                                                                        className='entity-input'
                                                                        type='text'
                                                                        placeholder='width'
                                                                        onBlur={this.onStyleBlur.bind(this, 'width')}
                                                                        value={css.width}
                                                                    />
                                                                    x
                                                                    <input
                                                                        className='entity-input'
                                                                        type='text'
                                                                        placeholder='height'
                                                                        onBlur={this.onStyleBlur.bind(this, 'height')}
                                                                        value={css.height}
                                                                    />
                                                                </div>
                                                                <input
                                                                    className='padding-input'
                                                                    type='text'
                                                                    placeholder='-'
                                                                    onBlur={this.onStyleBlur.bind(
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
                                                                onBlur={this.onStyleBlur.bind(this, 'paddingRight')}
                                                                value={css.paddingRight}
                                                            />
                                                        </div>
                                                        <input
                                                            className='box-input'
                                                            type='text'
                                                            placeholder='-'
                                                            onBlur={this.onStyleBlur.bind(this, 'borderBottom')}
                                                            value={css.borderBottom}
                                                        />
                                                    </div>
                                                    <input
                                                        className='box-input'
                                                        type='text'
                                                        placeholder='-'
                                                        onBlur={this.onStyleBlur.bind(this, 'borderRight')}
                                                        value={css.borderRight}
                                                    />
                                                </div>
                                                <input
                                                    className='box-input'
                                                    type='text'
                                                    placeholder='-'
                                                    onBlur={this.onStyleBlur.bind(this, 'marginBottom')}
                                                    value={css.marginBottom}
                                                />
                                            </div>
                                            <input
                                                className='box-input'
                                                type='text'
                                                placeholder='-'
                                                onBlur={this.onStyleBlur.bind(this, 'marginRight')}
                                                value={css.marginRight}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/*------ 扩展 ------*/}
                                <div className='attr-card'>
                                    <div className='card-title'>扩展</div>
                                    <div className='card-content'>
                                        <textarea
                                            name=''
                                            id=''
                                            cols='30'
                                            rows='10'
                                            onBlur={this.onStyleBlur.bind(this, 'extend')}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='tree' ref='tree'>
                        {this.renderTree(elements, activeKey)}
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
