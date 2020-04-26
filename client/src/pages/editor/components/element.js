import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import './element.scss';
import utils from '../../../common/utils';
import { attributeUpdate, elementsUpdate } from '../actions';

const canMoveList = ['absolute', 'fixed', 'relative'];

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

    renderElement(item, css) {
        // 折行处理
        const textList = item.text.split('\n');
        switch (item.element) {
            case 'View':
                return (
                    <div id={item.id} className={classNames('element', 'view', item.id)} style={item.css}>
                        {this.props.children}
                        {textList.map((row, idx) => (
                            <div key={`row-${idx}`}>{row}</div>
                        ))}
                    </div>
                );
            case 'ScrollView':
                return (
                    <div
                        id={item.id}
                        className={classNames('element', 'scroll-view', item.id)}
                        style={utils.positionFilter(item.css)}
                    >
                        {this.props.children}
                        {textList.map((row, idx) => (
                            <div key={`row-${idx}`}>{row}</div>
                        ))}
                    </div>
                );
            case 'Swiper':
                return (
                    <div id={item.id} className={classNames('element', 'swiper', item.id)} style={item.css}>
                        swiper
                    </div>
                );
            case 'Input':
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
                this.onStyleChange({ width: 375, height });
            } else {
                this.onStyleChange({ width, height });
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
        const {
            canvasPosition: { ctxTop, ctxRight, ctxBottom, ctxLeft },
        } = this.props.editorInfo;
        const boxEle = this.refs.box;
        const startX = evt.clientX;
        const startY = evt.clientY;
        const { offsetTop: boxTop, offsetLeft: boxLeft, offsetWidth: boxWidth, offsetHeight: boxHeight } = boxEle;
        const halfWidth = boxWidth / 2;
        const halfHeight = boxHeight / 2;

        // 拖拽中
        window.onmousemove = e => {
            if (!this.state.isDown) return;
            const movingX = e.clientX;
            const movingY = e.clientY;
            const changeX = movingX - startX;
            const changeY = movingY - startY;
            const top = boxTop + changeY;
            const left = boxLeft + changeX;
            if (movingX - halfWidth < ctxLeft) {
                // 超出左侧
                this.onStyleChange({ top, left: 0 });
            } else if (movingY - halfHeight < ctxTop) {
                // 超出上部
                this.onStyleChange({ top: 0, left });
            } else if (movingX + halfWidth > ctxRight) {
                // 超出右侧
                this.onStyleChange({ top, left: 375 - boxEle.offsetWidth });
            } else if (movingY + halfHeight > ctxBottom) {
                // 超出下册
                this.onStyleChange({ top: null, bottom: 0, left });
            } else {
                this.onStyleChange({ top, left });
            }
        };

        // 拖拽结束
        window.onmouseup = () => {
            if (!this.state.isDown) return;
            this.setState({ isDown: false });
        };
    }

    onStyleChange(data) {
        const { elements, activeKey } = this.props.editorInfo;
        const thisNode = utils.deepSearch(elements, activeKey);
        const thisCss = thisNode.css || {};
        const newNode = {
            ...thisNode,
            css: {
                ...thisCss,
            },
        };
        for (let k in data) {
            newNode.css[k] = utils.autoComplete('width', data[k]);
        }
        const newElements = utils.deepUpdate(elements, { [activeKey]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        this.props.dispatch(attributeUpdate(newNode));
    }

    render() {
        const {
            item,
            editorInfo: { activeKey },
        } = this.props;
        const { id, css = {} } = item;
        const active = item.id == activeKey;

        return (
            <div
                className={classNames('ele-box', { active })}
                ref='box'
                onClick={this.selectNode.bind(this, id)}
                style={css}
            >
                <div className='ctrl-point right-botom' onMouseDown={this.changeSize.bind(this)} />
                {utils.has(canMoveList, css.position) && (
                    <div className='ctrl-point center' onMouseDown={this.changePosition.bind(this)} />
                )}
                {active && <div className='width-num'>{css.width}</div>}
                {active && <div className='height-num'>{css.height}</div>}

                <div className='border' />
                {this.renderElement(item, css)}
            </div>
        );
    }
}

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(Element);
