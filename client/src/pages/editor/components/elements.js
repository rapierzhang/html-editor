import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import './element.scss';

class Element extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            isDown: false,
            // 移动中位置
            movingX: 0,
            movingY: 0,
        }
    }

    selectNode(key, e) {
        e.stopPropagation();
        this.props.onNodeSelect(key);
    }

    renderElement(item) {
        switch (item.element) {
            case 'div':
                return (
                    <div
                        id={item.id}
                        className={classNames('ele-div', item.id)}
                        style={item.style}
                        onClick={this.selectNode.bind(this, item.id)}
                    >
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
        this.setState({
            isDown: true,
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

    render() {
        const {
            item,
            editorInfo: { activeKey },
        } = this.props;
        const active = item.id == activeKey;

        return (
            <div className={classNames('ele-box', { active })}>
                <div className='ctrl-point top' />
                <div className='ctrl-point right' />
                <div className='ctrl-point bottom' />
                <div className='ctrl-point left' />
                <div className='ctrl-point center' />
                {this.renderElement(item)}
            </div>
        );
    }
}

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(Element);
