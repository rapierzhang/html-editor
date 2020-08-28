import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compMap } from '../../../../../common/component';
import { utils } from '../../../common';
import { dialogHandle, elementSelect, htmlTreeUpdate } from '../actions';
import './component-list.scss';

// 可嵌套组件
const list = Object.values(compMap('list'));
const containerElement = list.filter(item => item.nesting === true).map(item => item.component);
const compList = list.filter(item => !item.hide);

class ComponentList extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            menuY: 0,
            activeComponent: '',
        };
    }

    // 展示提示
    menuShow(activeComponent, nth) {
        const scrollTop = this.refs.list.scrollTop;
        const menuY = (nth - Math.floor(scrollTop / 50)) * 50 - (scrollTop % 50) + 35;
        this.setState({ menuY });
        this.setState({ activeComponent });
    }

    menuHide() {
        this.setState({ activeComponent: '' });
    }

    // 设置元素成功
    async eleInsert(element) {
        const { htmlTree, activeId, activeEle, altDown } = this.props.editorInfo;
        const id = utils.uniqueKey();
        let newHtmlTree;
        const defaultEle = {
            element,
            id,
            attr: {},
            css: {},
            others: {},
            onClick: this.onNodeSelect.bind(this, id),
        };
        // 为submit添加表单id

        if (element === 'Submit') {
            const familyTree = utils.familyTree(htmlTree, activeId);
            let isInFamily = false;
            familyTree.forEach(item => {
                if (item.element == 'Form') {
                    defaultEle.others.formId = item.id;
                    isInFamily = true;
                }
            });
            if (!isInFamily) {
                utils.toast('请在Form组件内插入');
                return;
            }
        }
        if (element === 'Dialog') {
            // dialog 放到最外层 并默认展示
            newHtmlTree = { ...htmlTree, ...{ [id]: defaultEle } };
            this.props.dispatch(dialogHandle(id, true));
        } else if (activeId) {
            // 嵌套
            if (utils.has(containerElement, activeEle.element)) {
                newHtmlTree = utils.deepInsert(htmlTree, activeId, { [id]: defaultEle });
            } else {
                utils.toast('只有容器元素可以容纳其他元素');
                return;
            }
        } else {
            // 普通插入
            newHtmlTree = utils.deepInsert(htmlTree, htmlTree.root ? 'root' : 'component', { [id]: defaultEle });
        }
        await this.props.dispatch(htmlTreeUpdate(newHtmlTree)); // 元素更新 必须await，否则因为树没更新导致下面的方法获取不到新的树
        if (!altDown) this.onNodeSelect(id); // 按住alt不选择
        console.error('set success!!!');
    }

    // 选中元素
    onNodeSelect(id) {
        const { activeId, htmlTree } = this.props.editorInfo;
        this.props.dispatch(elementSelect(id, activeId, htmlTree));
    }

    render() {
        const { menuY, activeComponent } = this.state;
        const { activeEle } = this.props.editorInfo;

        return (
            <div className='ele-list' ref='list'>
                {compList.map((item, idx) =>
                    !item.hide ? (
                        item.label ? (
                            <div key={`row-${idx}`} className='list-label'>
                                {item.title}
                            </div>
                        ) : (
                            <div
                                key={`row-${idx}`}
                                className='ele-item'
                                onMouseEnter={this.menuShow.bind(this, item.component, idx + 1)}
                                onMouseOut={this.menuHide.bind(this)}
                                onClick={this.eleInsert.bind(this, item.component)}
                            >
                                {item.component} {item.title}
                            </div>
                        )
                    ) : null,
                )}
                {activeComponent && (!activeEle.element || utils.has(containerElement, activeEle.element)) && (
                    <div className='ele-menu' style={{ top: menuY }}>
                        <div className='horn-bottom' />
                        <div className='horn-under' />
                        <div className='row'>插入到{activeEle.element || 'Root'}</div>
                    </div>
                )}
            </div>
        );
    }
}

ComponentList.defaultProps = {};

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(ComponentList);
