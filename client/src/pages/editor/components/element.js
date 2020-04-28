import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import './element.scss';
import utils from '../../../common/utils';
import { attributeUpdate, elementSelect, elementsUpdate } from '../actions';

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

    selectNode(id, e) {
        const { activeKey, elements } = this.props.editorInfo;

        e.stopPropagation();
        this.props.dispatch(elementSelect(id, activeKey, elements))
    }

    renderElement(item) {
        const { id, css, text } = item;
        // 折行处理
        const textList = text.split('\n');
        let attr = utils.objKeyFilter(item, ['element', 'id', 'css', 'text']);
        attr = utils.objValFilter(attr, ['false']);
        switch (item.element) {
            // 容器
            case 'View':
                return (
                    <div id={id} className={classNames('element', 'view', id)} style={css}>
                        {this.props.children}
                    </div>
                );
            case 'ScrollView':
                return (
                    <div id={id} className={classNames('element', 'scroll-view', id)} style={utils.positionFilter(css)}>
                        {this.props.children}
                    </div>
                );
            case 'Swiper':
                return (
                    <div id={id} className={classNames('element', 'swiper', id)} style={css}>
                        swiper
                    </div>
                );
            // 基础
            case 'Text':
                return (
                    <span id={id} className={classNames('element', 'text', id)} style={css}>
                        {textList.map((row, idx) => (
                            <span key={`row-${idx}`} className='text-row'>
                                {row}
                            </span>
                        ))}
                    </span>
                );
            case 'Icon':
                return <i id={id} className={classNames('element', 'text', id)} style={css}></i>;
            // 表单
            case 'Form':
                return (
                    <div id={id} className={classNames('element', 'form', id)} style={utils.positionFilter(css)}>
                        {this.props.children}
                        {textList.map((row, idx) => (
                            <div key={`row-${idx}`}>{row}</div>
                        ))}
                    </div>
                );
            case 'Input':
                return (
                    <input
                        type='text'
                        id={id}
                        className={classNames('element', 'input', id)}
                        style={utils.positionFilter(css)}
                    />
                );
            case 'TextArea':
                return (
                    <textarea
                        id={id}
                        className={classNames('element', 'textarea', id)}
                        style={utils.positionFilter(css)}
                    ></textarea>
                );
            case 'CheckBox':
                return (
                    <div id={id} className={classNames('element', 'checkbox', id)} style={utils.positionFilter(css)}>
                        checkbox
                    </div>
                );
            case 'Radio':
                return (
                    <div id={id} className={classNames('element', 'radio', id)} style={utils.positionFilter(css)}>
                        radio
                    </div>
                );
            case 'Select':
                return (
                    <div
                        id={id}
                        className={classNames('element', 'select', id)}
                        style={utils.positionFilter(css)}
                    ></div>
                );
            // 媒体
            case 'Audio':
                return (
                    <audio
                        id={id}
                        className={classNames('element', 'audio', id)}
                        style={utils.positionFilter(css)}
                        {...attr}
                    ></audio>
                );
            case 'Video':
                return (
                    <video
                        id={id}
                        className={classNames('element', 'video', id)}
                        style={utils.positionFilter(css)}
                        {...attr}
                    ></video>
                );
            case 'Image':
                return (
                    <img
                        id={id}
                        className={classNames('element', 'image', id)}
                        style={utils.positionFilter(css)}
                        {...attr}
                    />
                );

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
                {this.renderElement(item)}
            </div>
        );
    }
}

Element.defaultProps = {

}

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(Element);
