import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Swiper from 'swiper';
import utils from '../../../common/utils';
import { attributeUpdate, elementSelect, htmlTreeUpdate, navHandle } from '../actions';
import { canResizeList, canMoveList } from './attr-map';
import { compMap } from '../../../../../common/component';
import './element.scss';

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

            width: '',
            widthUnit: 'px',
            height: '',
            heightUnit: 'px',

            customCss: undefined,

            top: '',
            left: '',
        };

        this.swiper = null;
    }

    componentDidMount() {
        const {
            item: { element, id, others },
        } = this.props;
        if (element === 'Swiper') {
            this.swiper = new Swiper('.swiper-container', {
                loop: true, // 循环模式选项

                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                },
            });
        }
        // 初始化自定义html的样式,写入样式在 @1中
        if (element === 'Html') {
            const head = document.getElementsByTagName('head')[0];
            const styleEle = document.createElement('style');
            styleEle.setAttribute('id', `${id}-style`);
            head.appendChild(styleEle);
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { id, element, css, others } = props.item;
        const { width, height } = css || {};
        const { customCss } = others || {};
        // 将customCss写入<head>内<style>标签中 @1
        if (element == 'Html' && customCss != state.customCss) {
            const styleEle = document.getElementById(`${id}-style`);
            if (!styleEle) return null;
            styleEle.innerText = customCss.replace(/[\n\r]/g, '').replace(/  /g, '');
            return { customCss };
        }

        if (!width && !height) return null;

        if (width != state.width && !state.isDown) {
            const widthUnit = utils.trimNumber(width);
            return { width, widthUnit };
        }
        if (height != state.height && !state.isDown) {
            const heightUnit = utils.trimNumber(height);
            return { height, heightUnit };
        }

        return null;
    }

    // 选择节点
    selectNode(id, e) {
        e.stopPropagation();
        const { activeId, htmlTree, altDown } = this.props.editorInfo;
        this.props.dispatch(elementSelect(id, activeId, htmlTree));
        if (altDown) this.props.dispatch(navHandle(1));

        // 展示元素位置
        const treeId = document.getElementById(`tree-${id}`);
        const eleTop = treeId && treeId.getBoundingClientRect().top;
        const tree = document.getElementById('tree');
        if (!tree) return;
        const treeTop = tree.scrollTop;
        tree.scrollTop = treeTop + eleTop - 180;
    }

    // 拖拽更改大小
    changeSize(evt) {
        this.setState({ isDown: true });
        const { widthUnit, heightUnit } = this.state;
        const { clientX: startX, clientY: startY } = evt;
        const refBox = this.refs.box;
        const {
            offsetWidth: boxWidth,
            offsetHeight: boxHeight,
            style: { left, marginLeft, marginRight },
        } = refBox;
        const boxLeft = parseInt(left || '0');
        const boxMarginLeft = parseFloat(marginLeft || '0');
        const boxMarginRight = parseFloat(marginRight || '0');

        // 拖拽中
        window.onmousemove = e => {
            if (!this.state.isDown) return;
            const { clientX: movingX, clientY: movingY } = e;
            // 计算宽高
            const height = boxHeight + (movingY - startY) * 2;
            const width = Math.min(boxWidth + (movingX - startX) * 2, 750 - boxLeft - (boxMarginLeft + boxMarginRight));
            this.setState({
                width: `${width}${widthUnit}`,
                height: `${height}${heightUnit}`,
            });
        };

        // 拖拽结束
        window.onmouseup = () => {
            const { width, height, isDown } = this.state;
            if (!isDown) return;
            this.setState({ isDown: false });
            // 结束时才更改树，要不会卡
            this.onStyleChange({ width, height });
        };
    }

    // 拖拽更改位置
    changePosition(evt) {
        this.setState({ isDown: true });
        const {
            canvasPosition: { ctxBottom },
        } = this.props.editorInfo;
        const refBox = this.refs.box;
        const { clientX: startX, clientY: startY } = evt;
        // 元素位置大小
        const { offsetTop: boxTop, offsetLeft: boxLeft, offsetWidth: boxWidth, offsetHeight: boxHeight } = refBox;

        // 拖拽中
        window.onmousemove = e => {
            if (!this.state.isDown) return;
            // 鼠标位置
            const { clientX: movingX, clientY: movingY } = e;
            // 改变值
            const changeX = (movingX - startX) * 2;
            const changeY = (movingY - startY) * 2;
            // 元素四边位置
            let top = Math.max(boxTop + changeY, 0); // 限制上侧
            const bottom = Math.max(top + boxHeight, ctxBottom - boxHeight);
            let left = Math.max(boxLeft + changeX, 0); // 限制左侧
            const right = Math.max(left + boxWidth, 750);
            if (right > 750) {
                // 超出右侧
                top = Math.min(top, ctxBottom - boxHeight - 20); // 超出下侧，限制top
                left = 750 - refBox.offsetWidth;
            } else if (bottom + 20 > ctxBottom) {
                // 超出下侧
                top = ctxBottom - boxHeight - 20;
                left = Math.min(left, 750); // 超出右侧，限制left
            }
            this.setState({ top, left });
        };

        // 拖拽结束
        window.onmouseup = () => {
            const { top, left, isDown } = this.state;
            if (!isDown) return;
            this.setState({ isDown: false });
            // 结束时才更改树，要不会卡
            this.onStyleChange({ top: `${top}px`, left: `${left}px` });
        };
    }

    // 样式更改
    onStyleChange(data) {
        const { htmlTree, activeId } = this.props.editorInfo;
        const thisNode = utils.deepSearch(htmlTree, activeId);
        const newNode = {
            ...thisNode,
            css: { ...thisNode.css, ...data },
        };
        const newHtmlTree = utils.deepUpdate(htmlTree, { [activeId]: newNode });
        this.props.dispatch(htmlTreeUpdate(newHtmlTree));
        this.props.dispatch(attributeUpdate(newNode));
    }

    rootElement(id, active, css) {
        return (
            <div id={id} className={classNames(id, { active })} style={css} onClick={this.selectNode.bind(this, id)}>
                {this.props.children}
            </div>
        );
    }

    stopPop(e) {
        e.stopPropagation();
    }

    render() {
        let { width, height, top, left } = this.state;
        const {
            key,
            item,
            editorInfo: {
                activeId,
                canvasPosition: { ctxWidth, ctxHeight },
                dialogMap,
            },
        } = this.props;
        const { id, css = {}, element } = item;
        const active = id == activeId;

        width = width || css.width;
        height = height || css.height;
        top = top === 0 ? 0 : top || parseInt(css.top) || 0;
        left = left || parseInt(css.left) || 0;
        const right = 750 - (parseInt(width) || 0) - parseInt(left) || 0;
        const ctrlPositionShow = utils.has(canMoveList, css.position) && active;
        // 元素可以更改大小
        const canResize = utils.has(canResizeList, element);
        const ctrlSizeShow = canResize && active;

        switch (element) {
            // 根节点
            case 'Root':
                return this.rootElement('root', active, css);
            case 'ComponentRoot':
                return this.rootElement('component-root', active, css);
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
                        {...(element === 'Component' && { id })}
                        onClick={this.selectNode.bind(this, id)}
                        onMouseDown={this.stopPop.bind(this)}
                        style={{
                            ...utils.cssFilter(css, true),
                            ...(width && { width }),
                            ...(height && { height }),
                            ...(top && { top }),
                            ...(left && { left }),
                        }}
                    >
                        {active && <div className='ele-name'>{element}</div>}
                        {/*------ 缩放控制点 ------*/}
                        {active && canResize && (
                            <div className='ctrl-point right-botom' onMouseDown={this.changeSize.bind(this)} />
                        )}

                        {/*------ 位置控制点 ------*/}
                        {ctrlPositionShow && (
                            <div className='ctrl-point center' onMouseDown={this.changePosition.bind(this)} />
                        )}
                        {/*------ 宽高数字显示 ------*/}
                        {ctrlSizeShow && <div className='width-num'>{width}</div>}
                        {ctrlSizeShow && <div className='height-num'>{height}</div>}
                        {/*------ top,left数字显示 ------*/}
                        {ctrlPositionShow && (
                            <div className='top-num' style={{ height: top, top: `${parseInt(top) * -1}px` }}>
                                <div className='top-line' style={{ height: top }} />
                                <div className='num'>{top}px</div>
                                <div className='top-line' style={{ height: top }} />
                            </div>
                        )}
                        {ctrlPositionShow && (
                            <div className='left-num' style={{ width: left, left: `${parseInt(left) * -1}px` }}>
                                <div className='line' />
                                <div className='num'>{left}px</div>
                                <div className='line' />
                            </div>
                        )}
                        {ctrlPositionShow && canResize && (
                            <div className='right-num' style={{ width: right, right: `${parseInt(right) * -1}px` }}>
                                <div className='line' />
                                <div className='num'>{right}px</div>
                                <div className='line' />
                            </div>
                        )}
                        {/*------ 选中展示边框 ------*/}
                        {compMap('edit', item, key, this.props.children)}
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
