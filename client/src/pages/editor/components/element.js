import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import './element.scss';
import utils from '../../../common/utils';
import { attributeUpdate, elementsUpdate } from '../actions';

const canMoveList = ['absolute', 'fixed', 'relative']

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
        // 折行处理
        const textList = item.text.split('\n');
        switch (item.element) {
            case 'div':
                return (
                    <div id={item.id} className={classNames('ele-div', item.id)} style={item.css}>
                        {this.props.children}
                        {textList.map((row, idx) => (
                            <div key={`row-${idx}`}>{row}</div>
                        ))}
                    </div>
                );
            case 'input':
                return <input type='text' {...item} />;
            default:
                return <div>default</div>;
        }
    }

    changeSize(evt) {
        this.setState({ isDown: true });
        const startX = evt.clientX;
        const startY = evt.clientY;
        const boxEle = this.refs.box;
        const boxWidth = boxEle.offsetWidth;
        const boxHeight = boxEle.offsetHeight;

        // 拖拽中
        window.onmousemove = e => {
            if (!this.state.isDown) return;
            const movingX = e.clientX;
            const movingY = e.clientY;

            // 计算宽高
            const height = boxHeight + movingY - startY;
            const width = boxWidth + movingX - startX;

            // 超出最大宽度
            if (width >= 375) {
                this.onStyleChange(375, height);
            } else {
                this.onStyleChange(width, height);
            }
        };

        // 拖拽结束
        window.onmouseup = () => {
            if (!this.state.isDown) return;
            this.setState({ isDown: false });
        };
    }

    changePosition(evt) {
        this.setState({ isDown: true });
        const startX = evt.clientX;
        const startY = evt.clientY;
        const boxEle = this.refs.box;
        const boxTop = boxEle.offsetTop;
        const boxLeft = boxEle.offsetLeft;

        // 拖拽中
        window.onmousemove = e => {
            if (!this.state.isDown) return;
            const movingX = e.clientX;
            const movingY = e.clientY;
            const changeX = movingX - startX;
            const changeY = movingY - startY;

        };

        // 拖拽结束
        window.onmouseup = () => {
            if (!this.state.isDown) return;
            this.setState({ isDown: false });
        };
    }

    onStyleChange(width, height) {
        const { elements, activeKey } = this.props.editorInfo;
        const thisNode = utils.deepSearch(elements, activeKey);
        const thisStyle = thisNode.css || {};
        const newNode = {
            ...thisNode,
            css: {
                ...thisStyle,
                width: utils.autoComplete('width', width),
                height: utils.autoComplete('height', height),
            },
        };
        const newElements = utils.deepUpdate(elements, { [activeKey]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        // this.props.dispatch(attributeUpdate(newNode));
    }


    render() {
        const {
            item,
            editorInfo: { activeKey },
        } = this.props;
        const { id, css } = item;
        const active = item.id == activeKey;

        return (
            <div
                className={classNames('ele-box', { active })}
                ref='box'
                style={item.css}
                onClick={this.selectNode.bind(this, id)}
            >
                <div className='ctrl-point right-botom' onMouseDown={this.changeSize.bind(this)} />
                {css && utils.has(canMoveList, css.position) && <div className='ctrl-point center'onMouseDown={this.changePosition.bind(this)}  />}

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
