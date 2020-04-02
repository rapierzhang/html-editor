import React, { Component } from 'react';
import classNames from 'classnames';
import { Element, ArrtForm } from './components';
import './editor.scss';

const eleList = ['div', 'span'];

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0, // 元素索引
            isDown: false,
            dragName: '',
            activeKey: '',
            // 移动中位置
            movingX: 0,
            movingY: 0,

            // 画布位置
            ctxTop: 0,
            ctxBottom: 0,
            ctxLeft: 0,
            ctxRight: 0,

            elements: {
                A: {
                    element: 'div',
                    key: 'A',
                    className: 'A',
                    id: 'A',
                    text: '1111',
                },
                B: {
                    element: 'div',
                    key: 'B',
                    className: 'B',
                    id: 'B',
                    children: {
                        C: {
                            element: 'div',
                            key: 'C',
                            className: 'C',
                            id: 'C',
                            text: '3333',
                        },
                        D: {
                            element: 'div',
                            key: 'D',
                            className: 'D',
                            id: 'D',
                            children: {
                                E: {
                                    element: 'div',
                                    key: 'E',
                                    className: 'E',
                                    id: 'E',
                                    text: '444',
                                },
                                F: {
                                    element: 'div',
                                    key: 'F',
                                    className: 'F',
                                    id: 'F',
                                    text: '555',
                                },
                            }
                        },
                    }
                },
            },
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
        let { index, elements } = this.state;
        index ++;
        const key = this.uniqueKey(index);
        const eleObj = {
            element: ele,
            key,
            className: key,
            id: key,
            text: '',
            onClick: this.setEleAttr.bind(this, key),
        };
        this.setState({
            index,
            elements: {
                ...elements,
                [key]: eleObj,
            },
        });
    }

    // 设置元素失败
    setFail() {
        console.error('fail');
    }

    // 更改属性
    onAttrChange(newEle) {
        const { activeKey, elements } = this.state;
        this.setState({
            elements: { ...elements, ...{ [activeKey]: newEle } },
        });
    }

    // 选中元素
    onElementSelect(key) {
        this.setState({
            activeKey: key,
        });
    }
    // 取消选中元素
    clearActiveKey() {
        this.setState({ activeKey: false });
    }

    renderElements(elements) {
        const { activeKey } = this.state;
        const list = Object.values(elements);
        return list.map((item, idx) => {
            if (item.children) {
                return (
                    <Element
                        key={`item-${idx}`}
                        item={item}
                        active={activeKey == item.key}
                        onElementSelect={this.onElementSelect.bind(this)}
                    >
                        {this.renderElements(item.children)}
                    </Element>
                )
            } else {
                return (
                    <Element
                        key={`item-${idx}`}
                        item={item}
                        active={activeKey == item.key}
                        onElementSelect={this.onElementSelect.bind(this)}
                    />
                )
            }
        })
    }

    render() {
        const { isDown, dragName, activeKey, elements, movingX, movingY } = this.state;
        const list = Object.values(elements);
        activeKey && console.error(elements[activeKey]);

        return (
            <div className='editor'>
                {/*------ 拖拽虚拟元素 ------*/}
                <div
                    className={classNames('shadow-ele', { show: isDown })}
                    style={{ left: `${movingX}px`, top: `${movingY}px` }}
                >
                    {dragName}
                </div>
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
                <div className='attr-box'>
                    <ArrtForm
                        activeKey={activeKey}
                        elements={elements}
                        onAttrChange={this.onAttrChange.bind(this)}
                        onSelectEle={this.onElementSelect.bind(this)}
                        clearActiveKey={this.clearActiveKey.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

export default Editor;
