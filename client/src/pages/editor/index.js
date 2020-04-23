import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Element, ArrtForm } from './components';
import utils from '../../common/utils';
import './editor.scss';
import { activeKeySet, canvasPositionSet, elementSelect, elementsUpdate, indexIncrement, isEditSet } from './actions';

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
        const { offsetTop, offsetHeight, offsetLeft, offsetWidth } = this.refs.ctx;
        const canvasPosition = {
            ctxTop: offsetTop,
            ctxBottom: offsetTop + offsetHeight,
            ctxLeft: offsetLeft,
            ctxRight: offsetLeft + offsetWidth,
        };
        this.props.dispatch(canvasPositionSet(canvasPosition));
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
            const { isDown } = this.state;
            const {
                canvasPosition: { ctxTop, ctxBottom, ctxLeft, ctxRight },
            } = this.props.editorInfo;
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
        const { elements, index } = this.props.editorInfo;
        const key = this.uniqueKey(index);
        const defaultEle = {
            element: ele,
            id: key,
            text: '',
            onClick: this.onNodeSelect.bind(this, key),
        };
        const newElements = {
            ...elements,
            [key]: defaultEle,
        };
        this.props.dispatch(indexIncrement());
        this.props.dispatch(elementsUpdate(newElements));
    }

    // 设置元素失败
    setFail() {
        console.error('fail');
    }

    // 选中元素
    onNodeSelect(id) {
        const { activeKey, elements } = this.props.editorInfo;
        this.props.dispatch(elementSelect(id, activeKey, elements));
    }

    // 渲染画布中元素
    renderElements(elements) {
        const { activeKey } = this.props.editorInfo;
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

    render() {
        const {
            editorInfo: { elements , activeKey},
        } = this.props;
        const { isDown, dragName, movingX, movingY } = this.state;
        // console.error(activeKey, isEdit);

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
                        <ArrtForm />
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
