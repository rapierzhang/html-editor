import React, { Component } from 'react';
import './component-list.scss';
import { connect } from 'react-redux';
import { dialogHandle, elementSelect, elementsUpdate, indexIncrement } from '../actions';
import utils from '../../../common/utils';
import classNames from 'classnames';

// 模板列表
const componentList = [
    {
        label: '视图容器',
        list: [
            {
                title: '容器 □',
                component: 'View',
            },
            {
                title: '滚动容器 □',
                component: 'ScrollView',
            },
            {
                title: '滑动框',
                component: 'Swiper',
            },
        ],
    },
    {
        label: '基础内容',
        list: [
            {
                title: '跳转 □',
                component: 'Link',
            },
            {
                title: '文字',
                component: 'Text',
            },
            {
                title: '图标',
                component: 'Icon',
            },
        ],
    },
    {
        label: '表单组件',
        list: [
            {
                title: '表单 □',
                component: 'Form',
            },
            {
                title: '单行文本框',
                component: 'Input',
            },
            {
                title: '多行文本框',
                component: 'Textarea',
            },
            {
                title: '单项选择',
                component: 'Radio',
            },
            {
                title: '多项选择',
                component: 'Checkbox',
            },
            {
                title: '下拉框',
                component: 'Select',
            },
            {
                title: '文件上传 □',
                component: 'Upload',
            },
            {
                title: '提交',
                component: 'Submit',
            },
        ],
    },
    {
        label: '媒体组件',
        list: [
            {
                title: '图片',
                component: 'Image',
            },
            {
                title: '视频',
                component: 'Video',
            },
            {
                title: '音频',
                component: 'Audio',
            },
        ],
    },
    {
        label: '其他',
        list: [
            {
                title: '弹窗 □',
                component: 'Dialog',
            },
        ],
    },
];
// 可嵌套组件
const containerElement = ['Root', 'View', 'ScrollView', 'Form', 'Upload', 'Link', 'Dialog'];

class ComponentList extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            isDown: false,
            dragName: '', // 移动中位置
            movingX: 0,
            movingY: 0,
        };
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
    setSucc(element) {
        const { elements, index, activeId, activeEle } = this.props.editorInfo;
        const id = this.uniqueKey(index);
        let newElements;
        const defaultEle = {
            element,
            id,
            text: '',
            onClick: this.onNodeSelect.bind(this, id),
            ...(element === 'Submit' ? { formId: activeId } : {}),
            ...utils.defaultJs(element, id, { formId: activeId }), // 组件自带的js
        };
        if (element === 'Dialog') {
            // dialog 放到最外层 并默认展示
            newElements = { ...elements, ...{ [id]: defaultEle } };
            this.props.dispatch(dialogHandle(id, true));
        } else if (activeId) {
            // 嵌套
            if (utils.has(containerElement, activeEle.element)) {
                newElements = utils.deepInsert(elements, activeId, { [id]: defaultEle });
            } else {
                utils.toast('只有容器元素可以容纳其他元素');
                return;
            }
        } else {
            // 普通插入
            newElements = utils.deepInsert(elements, 'root', { [id]: defaultEle });
        }
        this.props.dispatch(indexIncrement()); // 索引自增
        this.props.dispatch(elementsUpdate(newElements)); // 元素更新
        this.props.dispatch(elementSelect(id, activeId, this.props.editorInfo.elements)); // 选中元素 后面element得取更新过后的
        console.error('set success!!!');
    }

    // 设置元素失败
    setFail() {
        console.error('fail');
    }

    // 选中元素 ^^^^^^
    onNodeSelect(id) {
        const { activeId, elements } = this.props.editorInfo;
        this.props.dispatch(elementSelect(id, activeId, elements));
    }

    render() {
        const { isDown, dragName, movingX, movingY } = this.state;

        return (
            <div className='ele-list'>
                {componentList.map((item, idx) => (
                    <div key={`item-${idx}`} className='list-card'>
                        <div className='list-label'>{item.label}</div>
                        {item.list.map((row, i) => (
                            <div
                                key={`row-${i}`}
                                className='ele-item'
                                title={row.title}
                                onMouseDown={this.msDown.bind(this, row.component)}
                            >
                                {row.component} {row.title}
                            </div>
                        ))}
                    </div>
                ))}
                {/*------ 拖拽虚拟元素 ------*/}
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

ComponentList.defaultProps = {};

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(ComponentList);
