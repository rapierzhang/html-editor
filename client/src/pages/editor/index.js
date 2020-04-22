import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Element, ArrtForm } from './components';
import utils from '../../common/utils';
import './editor.scss';
import { activeKeySet, elementsUpdate, indexIncrement, isEditSet } from './actions';

const eleList = ['div', 'span'];

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDown: false,
            dragName: '',
            // 移动中位置
            movingX: 0,
            movingY: 0,

            // 画布位置
            ctxTop: 0,
            ctxBottom: 0,
            ctxLeft: 0,
            ctxRight: 0,
        };
    }

    componentDidMount() {}

    // 设置唯一key
    uniqueKey(num) {
        const letter = 'ABCDEFGHIJ';
        const str = num.toString();
        return str
            .split('')
            .map(item => letter[parseInt(item)])
            .join('-');
    }

    // 获取画布位置
    ctxPosition() {
        const ctx = this.refs.ctx;
        const { offsetTop, offsetHeight, offsetLeft, offsetWidth } = ctx;
        this.setState({
            ctxTop: offsetTop,
            ctxBottom: offsetTop + offsetHeight,
            ctxLeft: offsetLeft,
            ctxRight: offsetLeft + offsetWidth,
        });
    }

    // 开始拖拽
    msDown(ele, evt) {
        this.ctxPosition();
        this.setState({
            isDown: true,
            dragName: ele,
            movingX: evt.clientX,
            movingY: evt.clientY,
        });

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
            const { isDown, ctxTop, ctxBottom, ctxLeft, ctxRight } = this.state;
            if (!isDown) return;
            this.setState({ isDown: false, movingX: 0, movingY: 0 });

            const endX = e.clientX;
            const endY = e.clientY;
            // 判断是否在画布内
            if (endX > ctxLeft && endX < ctxRight && endY > ctxTop && endY < ctxBottom) {
                this.setSucc(ele);
            } else {
                this.setFail();
            }
        };
    }

    // 设置元素成功
    setSucc(ele) {
        console.error('set success!!!');
        const {
            editorInfo: { elements, index },
        } = this.props;
        const key = this.uniqueKey(index);
        const eleObj = {
            element: ele,
            key,
            className: key,
            id: key,
            text: '',
            onClick: this.onNodeSelect.bind(this, key),
        };
        this.props.dispatch(indexIncrement());
        this.props.dispatch(
            elementsUpdate({
                ...elements,
                [key]: eleObj,
            }),
        );
    }

    // 设置元素失败
    setFail() {
        console.error('fail');
    }

    // 选中元素
    onNodeSelect(key) {
        const {
            editorInfo: { activeKey },
        } = this.props;
        this.props.dispatch(activeKeySet(key));
        this.props.dispatch(isEditSet(key == activeKey)); //双击编辑
    }

    // 取消选中元素
    clearActiveKey() {
        this.props.dispatch(activeKeySet(false));
        this.props.dispatch(isEditSet(false));
    }

    // 更改属性
    onAttrChange(newNode) {
        const {
            editorInfo: { elements, activeKey },
        } = this.props;
        const newElements = utils.deepUpdate(elements, { [activeKey]: newNode });
        this.props.dispatch(elementsUpdate(newElements),
        );
    }

    // 删除元素
    onElementRemove(key) {
        const {
            editorInfo: { elements },
        } = this.props;
        const newElements = utils.deepRemove(elements, key);
        this.props.dispatch(
            elementsUpdate({
                elements: newElements,
            }),
        );
    }

    // 渲染画布中元素
    renderElements(elements) {
        const {
            editorInfo: { activeKey },
        } = this.props;
        const list = Object.values(elements);
        return list.map((item, idx) => {
            return (
                <Element
                    key={`item-${idx}`}
                    item={item}
                    active={activeKey == item.id}
                    onNodeSelect={this.onNodeSelect.bind(this)}
                >
                    {item.children && this.renderElements(item.children)}
                </Element>
            );
        });
    }

    // 更新节点
    updateTree(elements) {
        this.props.dispatch(elementsUpdate({ elements }));
    }

    render() {
        const {
            editorInfo: { elements, activeKey, isEdit },
        } = this.props;
        const { isDown, dragName, movingX, movingY } = this.state;
        const list = Object.values(elements);
        console.error(elements);

        return (
            <div className='editor'>
                {/*------ 拖拽虚拟元素 ------*/}
                <div className='header'></div>
                <div className='content'>
                    {/*------ 元素列表 ------*/}
                    <div className='ele-list'>
                        {eleList.map((item, idx) => (
                            <div key={`item-${idx}`} className='ele-item' onMouseDown={this.msDown.bind(this, item)}>
                                {item}
                            </div>
                        ))}
                    </div>
                    {/*------ 画布 ------*/}
                    <div className='table'>
                        <div className='context' ref='ctx'>
                            {this.renderElements(elements)}
                        </div>
                    </div>
                    {/*------ 属性 ------*/}
                    <div className='side-bar'>
                        <ArrtForm
                            activeKey={activeKey}
                            isEdit={isEdit}
                            elements={elements}
                            updateTree={this.updateTree.bind(this)}
                        />
                    </div>
                </div>
                <div
                    className={classNames('shadow-ele', { show: isDown })}
                    style={{ left: `${movingX}px`, top: `${movingY}px` }}
                >
                    {dragName}
                </div>
            </div>
        );
    }
}

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(Editor);
