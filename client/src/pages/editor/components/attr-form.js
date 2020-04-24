import React, { Component } from 'react';
import { connect } from 'react-redux';
import utils from '../../../common/utils';
import classNames from 'classnames';
import { Select } from '../../../component';
import './attr-form.scss';
import { activeKeySet, attributeLoad, attributeUpdate, elementSelect, elementsUpdate, isEditSet } from '../actions';

const positionList = ['initial', 'absolute', 'fixed', 'relative', 'static', 'sticky', 'inherit'];
const directionList = ['top', 'right', 'bottom', 'left'];

class ArrtForm extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            navIndex: 1,
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

    // 属性更改
    onAttrChange(attrName, e) {
        // 判断是event传入的值还是组件传入的值
        const value = !!e.target ? e.target.value : e;
        const { elements, activeKey } = this.props.editorInfo;
        const thisNode = utils.deepSearch(elements, activeKey);
        const newNode = {
            ...thisNode,
            [attrName]: value,
        };
        console.error(value);
        const newElements = utils.deepUpdate(elements, { [activeKey]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        this.props.dispatch(attributeUpdate(newNode));
    }

    // 样式更改
    onStyleBlur(attrName, e) {
        const value = typeof e == 'object' ? e.target.value : e;
        const { elements, activeKey } = this.props.editorInfo;
        const thisNode = utils.deepSearch(elements, activeKey);
        const thisStyle = thisNode.css || {};
        const newNode = {
            ...thisNode,
            css: { ...thisStyle, [attrName]: utils.autoComplete(attrName, value) },
        };
        const newElements = utils.deepUpdate(elements, { [activeKey]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        this.props.dispatch(attributeUpdate(newNode));
    }

    removeEle() {
        const { elements, activeKey } = this.props.editorInfo;
        const newElements = utils.deepRemove(elements, activeKey);
        this.props.dispatch(elementsUpdate(newElements));
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
                    // onClick={this.selectEle.bind(this, ele.key)}
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
                    const removedElements = utils.deepRemove(elements, ele.key);
                    // 深度优先遍历子节点
                    const treeArr = utils.objDepthFirstTraversal(elements);
                    // 重置虚拟元素
                    this.setState({ isDown: false, movingX: 0, movingY: 0 });
                    // 判断加载哪个元素的前后
                    const index = Math.floor(endY / 30); // 第几个元素
                    const dot = ((endY / 30).toFixed(1) - index).toFixed(1);
                    const isBefore = treeArr.length - 1 > index ? true : dot < 0.5; //前后
                    const hoverKey = treeArr[Math.min(index, treeArr.length - 1)]; // 最后悬停时的元素key
                    if (hoverKey == ele.key) return; // 没变return
                    const newElements = utils.deepInsertSameFloor(removedElements, hoverKey, isBefore, {
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

    render() {
        const { elements, isEdit, activeKey, activeEle } = this.props.editorInfo;
        const { navIndex, isDown, movingX, movingY } = this.state;
        const {
            text,
            css: {
                position,

                backgroundImage,
                backgroundColor,

                fontSize,
                color,
                fontFamily,

                marginTop,
                marginRight,
                marginBottom,
                marginLeft,

                borderTop,
                borderRight,
                borderBottom,
                borderLeft,

                paddingTop,
                paddingRight,
                paddingBottom,
                paddingLeft,

                width,
                height,
            } = {},
        } = activeEle;

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
                                    <div className='card-title'>定位</div>
                                    <div className='card-content'>
                                        <div className='row'>
                                            <button className='del-ele' onClick={this.removeEle.bind(this)}>
                                                删除节点
                                            </button>
                                        </div>
                                        <div className='row'>
                                            <span>文字 </span>
                                            <textarea
                                                type='text'
                                                onChange={this.onAttrChange.bind(this, 'text')}
                                                value={text}
                                            />
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
                                                defaultVal={position}
                                                onChange={this.onStyleBlur.bind(this, 'position')}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {utils.has(['absolute', 'fixed', 'relative'], position) && (
                                    directionList.map((row, idx) => (
                                        <div key={`row-${idx}`} className='row'>
                                            <span>{row}: </span>
                                            <input
                                                type='text'
                                                onBlur={this.onStyleBlur.bind(this, row)}
                                                value={activeEle.css[row]}
                                            />
                                        </div>
                                    ))
                                )}
                                {/*------ 背景 ------*/}
                                <div className='attr-card'>
                                    <div className='card-title'>背景</div>
                                    <div className='card-content'>
                                        <div className='row'>
                                            <span>背景图: </span>
                                            <input
                                                type='text'
                                                onBlur={this.onStyleBlur.bind(this, 'backgroundImage')}
                                                value={backgroundImage}
                                            />
                                        </div>
                                        <div className='row'>
                                            <span>背景颜色: </span>
                                            <input
                                                type='text'
                                                onBlur={this.onStyleBlur.bind(this, 'backgroundColor')}
                                                value={backgroundColor}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/*------ 字体 ------*/}
                                <div className='attr-card'>
                                    <div className='card-title'>字体</div>
                                    <div className='card-content'>
                                        <div className='row'>
                                            <span>字号: </span>
                                            <input
                                                type='text'
                                                onBlur={this.onStyleBlur.bind(this, 'fontSize')}
                                                value={fontSize}
                                            />
                                        </div>
                                        <div className='row'>
                                            <span>颜色: </span>
                                            <input
                                                type='text'
                                                onBlur={this.onStyleBlur.bind(this, 'color')}
                                                value={color}
                                            />
                                        </div>
                                        <div className='row'>
                                            <span>字体: </span>
                                            <input
                                                type='text'
                                                onBlur={this.onStyleBlur.bind(this, 'fontFamily')}
                                                value={fontFamily}
                                            />
                                        </div>
                                    </div>
                                </div>
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
                                                onBlur={this.onStyleBlur.bind(this, 'marginLeft')}
                                                value={marginLeft}
                                            />
                                            <div className='margin-inner'>
                                                <input
                                                    className='box-input'
                                                    type='text'
                                                    placeholder='-'
                                                    onBlur={this.onStyleBlur.bind(this, 'marginTop')}
                                                    value={marginTop}
                                                />
                                                <div className='border'>
                                                    <span className='tag'>border</span>
                                                    <input
                                                        className='box-input'
                                                        type='text'
                                                        placeholder='-'
                                                        onBlur={this.onStyleBlur.bind(this, 'borderLeft')}
                                                        value={borderLeft}
                                                    />
                                                    <div className='border-inner'>
                                                        <input
                                                            className='box-input'
                                                            type='text'
                                                            placeholder='-'
                                                            onBlur={this.onStyleBlur.bind(this, 'borderTop')}
                                                            value={borderTop}
                                                        />
                                                        <div className='padding'>
                                                            <span className='tag'>padding</span>

                                                            <input
                                                                className='padding-input'
                                                                type='text'
                                                                placeholder='-'
                                                                onBlur={this.onStyleBlur.bind(this, 'paddingLeft')}
                                                                value={paddingLeft}
                                                            />
                                                            <div className='padding-inner'>
                                                                <input
                                                                    className='padding-input'
                                                                    type='text'
                                                                    placeholder='-'
                                                                    onBlur={this.onStyleBlur.bind(this, 'paddingTop')}
                                                                    value={paddingTop}
                                                                />
                                                                <div className='entity'>
                                                                    <input
                                                                        className='entity-input'
                                                                        type='text'
                                                                        placeholder='width'
                                                                        onBlur={this.onStyleBlur.bind(this, 'width')}
                                                                        value={width}
                                                                    />
                                                                    x
                                                                    <input
                                                                        className='entity-input'
                                                                        type='text'
                                                                        placeholder='height'
                                                                        onBlur={this.onStyleBlur.bind(this, 'height')}
                                                                        value={height}
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
                                                                    value={paddingBottom}
                                                                />
                                                            </div>
                                                            <input
                                                                className='padding-input'
                                                                type='text'
                                                                placeholder='-'
                                                                onBlur={this.onStyleBlur.bind(this, 'paddingRight')}
                                                                value={paddingRight}
                                                            />
                                                        </div>
                                                        <input
                                                            className='box-input'
                                                            type='text'
                                                            placeholder='-'
                                                            onBlur={this.onStyleBlur.bind(this, 'borderBottom')}
                                                            value={borderBottom}
                                                        />
                                                    </div>
                                                    <input
                                                        className='box-input'
                                                        type='text'
                                                        placeholder='-'
                                                        onBlur={this.onStyleBlur.bind(this, 'borderRight')}
                                                        value={borderRight}
                                                    />
                                                </div>
                                                <input
                                                    className='box-input'
                                                    type='text'
                                                    placeholder='-'
                                                    onBlur={this.onStyleBlur.bind(this, 'marginBottom')}
                                                    value={marginBottom}
                                                />
                                            </div>
                                            <input
                                                className='box-input'
                                                type='text'
                                                placeholder='-'
                                                onBlur={this.onStyleBlur.bind(this, 'marginRight')}
                                                value={marginRight}
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
