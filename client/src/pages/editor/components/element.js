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

    componentDidMount() {
        new Swiper('.swiper-container', {
            loop: true, // 循环模式选项

            // 如果需要分页器
            pagination: {
                el: '.swiper-pagination',
            },
        });
    }

    selectNode(id, e) {
        const { activeKey, elements } = this.props.editorInfo;
        e.stopPropagation();
        this.props.dispatch(elementSelect(id, activeKey, elements));
    }

    renderElement(item) {
        const { id, css, text, list = [] } = item;
        // 折行处理
        const textList = text.split('\n');
        let attr = utils.objKeyFilter(item, ['element', 'id', 'css', 'text']);
        attr = utils.objValFilter(attr, ['false']);
        const style = utils.cssFilter(css, false);
        switch (item.element) {
            // 容器
            case 'View':
                return (
                    <div id={id} className={classNames('element', 'view', id)} style={style}>
                        {this.props.children}
                    </div>
                );
            case 'ScrollView':
                return (
                    <div id={id} className={classNames('element', 'scroll-view', id)} style={style}>
                        {this.props.children}
                    </div>
                );
            case 'Swiper':
                return (
                    <div id={id} className={classNames('element', 'swiper', 'swiper-container', id)} style={style}>
                        <div className='swiper-wrapper'>
                            {list.map((url, idx) => (
                                <div key={`item-${idx}`} className='swiper-slide'>
                                    <img className='swiper-image' src={url} alt='' />
                                </div>
                            ))}
                        </div>
                        <div className='swiper-pagination'></div>
                    </div>
                );
            // 基础
            case 'Link':
                return (
                    <a id={id} className={classNames('element', 'link', id)} style={style} href=''>
                        {this.props.children}
                    </a>
                );
            case 'Text':
                return (
                    <span id={id} className={classNames('element', 'text', id)} style={style}>
                        {textList.map((row, idx) => (
                            <span key={`row-${idx}`} className='text-row'>
                                {row}
                            </span>
                        ))}
                    </span>
                );
            case 'Icon':
                return <i id={id} className={classNames('element', 'text', id)} style={style}></i>;
            // 表单
            case 'Form':
                return (
                    <div id={id} className={classNames('element', 'form', id)} style={style}>
                        {this.props.children}
                    </div>
                );
            case 'Input':
                return (
                    <input id={id} className={classNames('element', 'input', id)} style={style} type='text' {...attr} />
                );
            case 'Textarea':
                return (
                    <textarea
                        id={id}
                        className={classNames('element', 'textarea', id)}
                        style={style}
                        {...attr}
                    ></textarea>
                );
            case 'CheckBox':
                return (
                    <div id={id} className={classNames('element', 'checkbox', id)} style={style}>
                        checkbox
                    </div>
                );
            case 'Select':
                return <div id={id} className={classNames('element', 'select', id)} style={style}></div>;
            case 'Upload':
                return (
                    <div id={id} className={classNames('element', 'upload', id)} style={style}>
                        {this.props.children}
                    </div>
                );
            case 'Submit':
                return (
                    <div id={id} className={classNames('element', 'submit', id)} style={style}>
                        {text}
                    </div>
                );
            // 媒体
            case 'Audio':
                return <audio id={id} className={classNames('element', 'audio', id)} style={style} {...attr}></audio>;
            case 'Video':
                return <video id={id} className={classNames('element', 'video', id)} style={style} {...attr}></video>;
            case 'Image':
                return <img id={id} className={classNames('element', 'image', id)} style={style} {...attr} />;

            default:
                return <div>default</div>;
        }
    }

    // 拖拽更改大小
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
                this.onStyleChange({ width: '375px', height: `${height}px` });
            } else {
                this.onStyleChange({ width: `${width}px`, height: `${height}px` });
            }
        };

        // 拖拽结束
        window.onmouseup = () => {
            if (!this.state.isDown) return;
            this.setState({ isDown: false });
        };
    }

    // 拖拽更改位置
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

    // 样式更改
    onStyleChange(data) {
        const { elements, activeKey } = this.props.editorInfo;
        const thisNode = utils.deepSearch(elements, activeKey);
        const thisCss = thisNode.css || {};
        const newNode = {
            ...thisNode,
            css: { ...thisCss },
        };
        for (let k in data) {
            newNode.css[k] = data[k];
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
                style={utils.cssFilter(css, true)}
            >
                {/*------ 缩放控制点 ------*/}
                <div className='ctrl-point right-botom' onMouseDown={this.changeSize.bind(this)} />
                {/*------ 位置控制点 ------*/}
                {utils.has(canMoveList, css.position) && (
                    <div className='ctrl-point center' onMouseDown={this.changePosition.bind(this)} />
                )}
                {/*------ 宽高数字显示 ------*/}
                {active && <div className='width-num'>{css.width}</div>}
                {active && <div className='height-num'>{css.height}</div>}
                {/*------ 选中展示边框 ------*/}
                {this.renderElement(item)}
            </div>
        );
    }
}

Element.defaultProps = {};

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(Element);
