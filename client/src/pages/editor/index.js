import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { Element, ArrtForm } from './components';
import { utils } from '../../common';
import query from 'query-string';
import './editor.scss';
import {
    pageInit,
    indexIncrement,
    pidSet,
    canvasPositionSet,
    elementSelect,
    elementsUpdate,
    htmlSave,
    htmlBuild,
    htmlOpen,
    indexSet,
    titleSet,
    descSet,
} from './actions';

const eleList = ['View', 'ScrollView', 'Swiper'];

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

    componentDidMount() {
        setTimeout(() => this.ctxPosition(), 500);
        this.init();
    }

    // 初始化
    init() {
        const { pid } = query.parse(this.props.location.search);
        pageInit({ pid })
            .then(res => {
                const { pid, index, title, desc, htmlTree } = res;
                this.props.dispatch(pidSet(pid));
                index && this.props.dispatch(indexSet(index));
                htmlTree && this.props.dispatch(elementsUpdate(htmlTree));
                title && this.props.dispatch(titleSet(title));
                desc && this.props.dispatch(descSet(desc));
                location.href = `${location.origin}/#/editor?pid=${pid}`;
            })
            .catch(err => {
                console.error(222, err);
            });
    }

    // 控制标题
    async handleTitle(status) {
        await this.setState({ titleEdit: status });
        if (status) {
            this.props.dispatch(titleSet(''));
        } else {
            if (!this.props.editorInfo.title) this.props.dispatch(titleSet('未命名页面'));
        }
    }
    // 标题更改
    titleChange(e) {
        const title = e.target.value;
        this.props.dispatch(titleSet(title));
    }

    // 标题更改
    descChange(e) {
        const desc = e.target.value;
        this.props.dispatch(descSet(desc));
    }

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
            ctxHeight: offsetHeight,
            ctxWidth: offsetWidth,
        };
        this.props.dispatch(canvasPositionSet(canvasPosition));
    }

    // 开始拖拽
    msDown(ele, evt) {
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

    // 保存
    save() {
        const { elements, pid, index } = this.props.editorInfo;
        htmlSave({
            pid,
            index,
            title: '题目题目',
            desc: '测试简介',
            htmlTree: elements,
            // preview
        })
            .then(res => {
                 utils.toast(res.result ? '保存成功' : '保存失败');
            })
            .catch(err => {
                utils.toast(['保存失败', err.msg]);
            });
    }

    // 构建
    build() {
        const { pid } = this.props.editorInfo;
        htmlBuild({ pid })
            .then(res => {
                 utils.toast(res.result ? '生成成功' : '生成失败');
            })
            .catch(err => {
                utils.toast('生成失败');
            });
    }

    // 打开
    open() {
        const { pid } = this.props.editorInfo;
        htmlOpen({ pid })
            .then(res => {
                window.open(res.url);
            })
            .catch(err => {
                utils.toast('无法打开');
                console.error(222, err);
            });
    }

    render() {
        const {
            editorInfo: { title, desc, elements },
        } = this.props;
        const { isDown, dragName, movingX, movingY } = this.state;
        // console.error(activeKey, isEdit);

        return (
            <div className='editor'>
                {/*------ 拖拽虚拟元素 ------*/}
                <div className='header'>
                    {/*------ 标题 ------*/}
                    <div>
                        <input
                            type='text'
                            className='title-input'
                            value={title}
                            onChange={this.titleChange.bind(this)}
                            onFocus={this.handleTitle.bind(this, true)}
                            onBlur={this.handleTitle.bind(this, false)}
                        />
                        <input
                            type='text'
                            className='desc-input'
                            value={desc}
                            placeholder='请输入简介'
                            onChange={this.descChange.bind(this)}
                        />
                    </div>
                    {/*------ 按钮组 ------*/}
                    <div className='btn-box'>
                        <div className='button primary' onClick={this.save.bind(this)}>
                            保存
                        </div>
                        <div className='button warring' onClick={this.build.bind(this)}>
                            生成
                        </div>
                        <div className='button success' onClick={this.open.bind(this)}>
                            打开
                        </div>
                        <div className='button danger'>删除</div>
                    </div>
                </div>
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
