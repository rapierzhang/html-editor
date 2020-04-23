import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import './element.scss';
import utils from '../../../common/utils';
import { elementsUpdate } from '../actions';

class Element extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            isDown: false,

            // 起始拖拽位置
            startX: 0,
            startY: 0,
            // 移动中位置
            movingX: 0,
            movingY: 0,
        };
    }

    selectNode(key, e) {
        e.stopPropagation();
        this.props.onNodeSelect(key);
    }

    renderElement(item) {
        switch (item.element) {
            case 'div':
                return (
                    <div id={item.id} className={classNames('ele-div', item.id)} style={item.style}>
                        {this.props.children}
                        {item.text}
                    </div>
                );
            case 'input':
                return <input type='text' {...item} />;
            default:
                return <div>default</div>;
        }
    }

    onDrag(direction, evt) {
        const {
            canvasPosition: { ctxTop, ctxBottom, ctxLeft, ctxRight },
        } = this.props.editorInfo;
        this.setState({ isDown: true });
        const startX = evt.clientX;
        const startY = evt.clientY;
        const boxEle = this.refs.box;
        const boxWidth = boxEle.offsetWidth;
        const boxHeight = boxEle.offsetHeight;
        const ctxWidth = ctxRight - ctxLeft;

        // 拖拽中
        window.onmousemove = e => {
            if (!this.state.isDown) return;
            const movingX = e.clientX;
            const movingY = e.clientY;

            // 计算宽高
            const height = boxHeight + movingY - startY;
            const width = boxWidth + movingX - startX;

            if (direction == 'top' || direction == 'bottom') this.onStyleChange('height', height);
            if (direction == 'left' || direction == 'right') {
                // 超出最大宽度
                if (width >= ctxWidth) {
                    this.onStyleChange('width', ctxWidth);
                } else {
                    this.onStyleChange('width', width);
                }
            }
        };

        // 拖拽结束
        window.onmouseup = () => {
            const { isDown } = this.state;
            if (!isDown) return;
            this.setState({ isDown: false });
        };
    }

    onStyleChange(attr, val) {
        const { elements, activeKey } = this.props.editorInfo;
        const thisNode = utils.deepSearch(elements, activeKey);
        const thisStyle = thisNode.style || {};
        const newNode = {
            ...thisNode,
            style: { ...thisStyle, [attr]: utils.autoComplete(attr, val) },
        };
        const newElements = utils.deepUpdate(elements, { [activeKey]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
    }

    render() {
        const {
            item,
            editorInfo: { activeKey },
        } = this.props;
        const active = item.id == activeKey;

        return (
            <div
                className={classNames('ele-box', { active })}
                ref='box'
                style={item.style}
                onClick={this.selectNode.bind(this, item.id)}
            >
                <div className='ctrl-point top' onMouseDown={this.onDrag.bind(this, 'top')} />
                <div className='ctrl-point right' onMouseDown={this.onDrag.bind(this, 'right')} />
                <div className='ctrl-point bottom' onMouseDown={this.onDrag.bind(this, 'bottom')} />
                <div className='ctrl-point left' onMouseDown={this.onDrag.bind(this, 'left')} />
                <div className='ctrl-point center' />
                <div className='border' />
                {this.renderElement(item)}
            </div>
        );
    }
}

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(Element);
