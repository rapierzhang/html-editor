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

    // 选择节点
    selectNode(id, e) {
        e.stopPropagation();
        const { activeId, elements } = this.props.editorInfo;
        this.props.dispatch(elementSelect(id, activeId, elements));

        // 展示元素位置
        const treeId = document.getElementById(`tree-${id}`)
        const eleTop = treeId && treeId.getBoundingClientRect().top;
        const table = document.getElementById('side-bar');
        const tableTop = table.scrollTop;
        table.scrollTop = tableTop + eleTop - 200;
    }

    renderElement(item) {
        const { id, css, text = '', imageList = [], label, name, extClass } = item;
        // 折行处理
        const textList = text.split('\n');
        let attr = utils.objKeyFilter(item, ['element', 'id', 'css', 'text', 'maxlength']);
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
                            {imageList.map((url, idx) => (
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
                        {textList.map((row, idx) => {
                            const arr = row.split('');
                            return textList.length > 1 ? (
                                <span key={`row-${idx}`} className='text-row'>
                                    {arr.map((span, i) => (
                                        <span key={`span-${i}`}>{span}</span>
                                    ))}
                                </span>
                            ) : (
                                arr.map((span, i) => <span key={`span-${i}`}>{span}</span>)
                            );
                        })}
                    </span>
                );
            case 'Icon':
                return <i id={id} className={classNames('element', 'icon', id, extClass)} style={style}></i>;
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
                return (
                    <div id={id} className={classNames('element', 'select', id)} style={style}>
                        请选择
                    </div>
                );
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
            const height = boxHeight + (movingY - startY) * 2;
            const width = boxWidth + (movingX - startX) * 2;

            // 超出最大宽度
            if (width >= 750) {
                this.onStyleChange({ width: '750px', height: `${height}px` });
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
            canvasPosition: { ctxBottom },
        } = this.props.editorInfo;
        const boxEle = this.refs.box;
        const startX = evt.clientX;
        const startY = evt.clientY;
        // 元素位置大小
        const { offsetTop: boxTop, offsetLeft: boxLeft, offsetWidth: boxWidth, offsetHeight: boxHeight } = boxEle;

        // 拖拽中
        window.onmousemove = e => {
            if (!this.state.isDown) return;
            // 鼠标位置
            const movingX = e.clientX;
            const movingY = e.clientY;
            // 改变值
            const changeX = (movingX - startX) * 2;
            const changeY = (movingY - startY) * 2;
            // 元素四边位置
            const top = boxTop + changeY;
            const bottom = boxTop + boxHeight + changeY;
            const left = boxLeft + changeX;
            const right = boxLeft + boxWidth + changeX;
            if (left < 0) {
                // 超出左侧
                this.onStyleChange({ top: `${top}px`, left: 0 });
            } else if (top < 0) {
                // 超出上部
                this.onStyleChange({ top: 0, left: `${left}px` });
            } else if (right > 750) {
                // 超出右侧
                this.onStyleChange({ top: `${top}px`, left: 750 - boxEle.offsetWidth });
            } else if (bottom + 20 > ctxBottom) {
                // 超出下侧
                this.onStyleChange({ top: `${ctxBottom - boxHeight - 20}px`, left: `${left}px` });
            } else {
                this.onStyleChange({ top: `${top}px`, left: `${left}px` });
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
            editorInfo: {
                activeId,
                canvasPosition: { ctxWidth, ctxHeight },
                dialogMap,
            },
        } = this.props;
        const { id, css = {}, element } = item;
        const active = id == activeId;
        // 元素可以更改大小
        const canResize = !utils.has(['Text', 'Icon', 'Link', 'Radio', 'Checkbox'], element);
        switch (element) {
            // 根节点
            case 'Root':
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
            // 弹层
            case 'Dialog':
                return (
                    <div
                        id={id}
                        className={classNames('h5-dialog', id, { active, none: !dialogMap[id] })}
                        style={{ width: ctxWidth, height: ctxHeight }}
                        onClick={this.selectNode.bind(this, id)}
                    >
                        {this.props.children}
                    </div>
                );
            // 默认
            default:
                return (
                    <div
                        className={classNames('ele-box', { active, 'can-resize': canResize })}
                        ref='box'
                        onClick={this.selectNode.bind(this, id)}
                        style={utils.cssFilter(css, true)}
                    >
                        {/*------ 缩放控制点 ------*/}
                        {canResize && (
                            <div className='ctrl-point right-botom' onMouseDown={this.changeSize.bind(this)} />
                        )}
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
}

Element.defaultProps = {};

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(Element);
