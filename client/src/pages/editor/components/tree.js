import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import { attributeUpdate, elementSelect, htmlTreeUpdate, navHandle } from '../actions';
import { utils } from '../../../common';
import './tree.scss';

class Tree extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            movingX: 0,
            movingY: 0,

            hoverId: '',
            hoverNode: {},

            compData: utils.defaultData,
        };
    }

    renderTree(htmlTree, activeId, floor = 0) {
        const arr = Object.values(htmlTree);
        return arr.map((ele, idx) => {
            const { id, element, children, others = {} } = ele;
            const { nodeClose, componentName } = others;
            const key = `${idx}-${parseInt(Math.random() * 1e5)}`;
            const row = (
                <div
                    key={key}
                    id={`tree-${id}`}
                    className='tree-item'
                    onClick={this.selectNode.bind(this, id)}
                    onMouseDown={this.showMenu.bind(this, id)}
                >
                    <div
                        className={classNames('tree-row', { active: id === activeId })}
                        style={{ paddingLeft: `${floor * 10}px` }}
                    >
                        <div className='row-text'>
                            {children ? (
                                <div className='ctrl-box' onClick={this.statusSwitch.bind(this, id)}>
                                    {nodeClose ? <RightOutlined /> : <DownOutlined />}
                                </div>
                            ) : (
                                <div className='blank'></div>
                            )}
                            <div className='text'>{element}</div>
                        </div>
                        <span className='component-name'>{componentName}</span>
                    </div>
                    {children && !nodeClose && this.renderTree(children, activeId, floor + 1)}
                </div>
            );
            return row;
        });
    }

    // 切换展开状态
    statusSwitch(activeId, e) {
        e.stopPropagation();
        const { htmlTree } = this.props.editorInfo;
        const thisNode = utils.deepSearch(htmlTree, activeId);
        const { others = {} } = thisNode;
        thisNode.others = {
            ...others,
            nodeClose: !others.nodeClose,
        };
        const newHtmlTree = utils.deepUpdate(htmlTree, { [activeId]: thisNode });
        this.props.dispatch(htmlTreeUpdate(newHtmlTree));
        this.props.dispatch(attributeUpdate(thisNode));
    }

    // 选择节点
    selectNode(id, e) {
        e.stopPropagation();
        const { activeId, htmlTree, altDown } = this.props.editorInfo;
        this.setState({ hoverId: '' });
        if (altDown) this.props.dispatch(navHandle(1));
        this.props.dispatch(elementSelect(id, activeId, htmlTree));
        // 展示元素位置
        const ele = document.getElementById(id);
        if (!ele) return;
        const clintRect = ele.getBoundingClientRect() || {};
        const eleTop = clintRect.top;
        const table = document.getElementById('table');
        const tableTop = table.scrollTop;
        table.scrollTop = tableTop + eleTop / 2 - 180;
    }

    // 菜单展示
    showMenu(hoverId, e) {
        e.stopPropagation();
        const { button, pageX, pageY } = e;
        if (button == 2) {
            const { htmlTree, activeId } = this.props.editorInfo;
            const hoverNode = utils.deepSearch(htmlTree, hoverId);
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

    hideMenu() {
        this.setState({
            hoverId: '',
            hoverNode: {},
        });
    }

    // 更改树
    changeTree(position) {
        let newTree = {};
        const { hoverId, hoverNode } = this.state;
        const { htmlTree, activeId } = this.props.editorInfo;
        if (activeId === 'root' && utils.has(['before', 'after'], position)) {
            utils.toast('不能插入在Root元素前后');
            return;
        }
        // 先将hover的元素删除
        const removedHtmlTree = utils.deepRemove(htmlTree, hoverId);
        // 在插入到相应位置
        switch (position) {
            case 'before':
                newTree = utils.deepInsertSameFloor(removedHtmlTree, activeId, true, { [hoverId]: hoverNode });
                break;
            case 'in':
                newTree = utils.deepInsert(removedHtmlTree, activeId, { [hoverId]: hoverNode });
                break;
            case 'after':
                newTree = utils.deepInsertSameFloor(removedHtmlTree, activeId, false, { [hoverId]: hoverNode });
                break;
        }
        // 更新树
        this.props.dispatch(htmlTreeUpdate(newTree));
        this.hideMenu();
    }

    render() {
        const { hoverId, movingX, movingY } = this.state;
        const {
            editorInfo: { activeId, htmlTree, activeEle },
        } = this.props;

        return (
            <div id='tree' className='tree' ref='tree'>
                {this.renderTree(htmlTree, activeId)}

                {/*------ 菜单 必须有选中才展示 ------*/}
                {activeId && hoverId && activeId != hoverId && (
                    <div className='tree-menu' style={{ left: movingX, top: movingY }}>
                        <div className='row' onClick={this.changeTree.bind(this, 'before')}>
                            移动到选中元素前
                        </div>
                        {utils.has(
                            ['Root', 'View', 'ScrollView', 'Form', 'Upload', 'Link', 'Dialog'],
                            activeEle.element,
                        ) && (
                            <div className='row' onClick={this.changeTree.bind(this, 'in')}>
                                移动到选中元素内
                            </div>
                        )}
                        <div className='row' onClick={this.changeTree.bind(this, 'after')}>
                            移动到选中元素后
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(Tree);
