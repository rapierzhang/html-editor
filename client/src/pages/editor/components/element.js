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
        const { activeId, elements } = this.props.editorInfo;
        e.stopPropagation();
        this.props.dispatch(elementSelect(id, activeId, elements));
    }

    renderElement(item) {
        const { id, css, text = '', list = [], label, name } = item;
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
                    <a id={id} className={classNames('element', 'link', id)} style={style}>
                        {this.props.children}
                    </a>
                );
            case 'Text':
                return (
                    <span id={id} className={classNames('element', 'text', id)} style={style}>
                        {textList.map((row, idx) =>
                            textList.length > 1 ? (
                                <span key={`row-${idx}`} className='text-row'>
                                    {row}
                                </span>
                            ) : (
                                row
                            ),
                        )}
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
            case 'Checkbox':
                return (
                    <span className={classNames('element', 'checkbox', id)} style={style}>
                        <input id={id} type='checkbox' name={name} value={label} />
                        <span className='checkbox-label'>{label}</span>
                    </span>
                );
            case 'Radio':
                return (
                    <span className={classNames('element', 'radio', id)} style={style}>
                        <input id={id} type='radio' name={name} value={label} />
                        <span className='radio-label'>{label}</span>
                    </span>
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

            // 其他
            /*case 'Dialog':
                return (
                    <div
                        id={id}
                        className={classNames('element', 'h5-dialog', id)}
                        style={{ width: ctxWidth, height: ctxHeight }}
                    >
                        {this.props.children}
                    </div>
                );*/
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
            const top = boxTop + changeY + 'px';
            const left = boxLeft + changeX + 'px';
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
        const { elements, activeId } = this.props.editorInfo;
        const thisNode = utils.deepSearch(elements, activeId);
        const thisCss = thisNode.css || {};
        const newNode = {
            ...thisNode,
            css: { ...thisCss },
        };
        for (let k in data) {
            newNode.css[k] = data[k];
        }
        const newElements = utils.deepUpdate(elements, { [activeId]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        this.props.dispatch(attributeUpdate(newNode));
    }

    render() {
        const {
            item,
            editorInfo: { activeId, canvasPosition: { ctxWidth, ctxHeight }, dialogMap },
        } = this.props;
        const { id, css = {}, element } = item;
        const active = id == activeId;
        // 元素可以更改大小
        const canResize = !utils.has(['Text', 'Link', 'Radio', 'Checkbox'], element);
        // 根节点
        if (element === 'Root') {
            return (
                <div
                    id='root'
                    className={classNames('root', { active })}
                    style={css}
                    onClick={this.selectNode.bind(this, 'root')}
                >
                    {this.props.children}
                </div>
            );
        }

        if (element === 'Dialog') {
            return (
                <div
                    id={id}
                    className={classNames('element', 'h5-dialog', id, { active, none: !dialogMap[id] })}
                    style={{ width: ctxWidth, height: ctxHeight }}
                    onClick={this.selectNode.bind(this, id)}
                >
                    {this.props.children}
                </div>
            )
        }

        return (
            <div
                className={classNames('ele-box', { active, 'can-resize': canResize })}
                ref='box'
                onClick={this.selectNode.bind(this, id)}
                style={utils.cssFilter(css, true)}
            >
                {/*------ 缩放控制点 ------*/}
                {canResize && <div className='ctrl-point right-botom' onMouseDown={this.changeSize.bind(this)} />}
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
