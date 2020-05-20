import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { componentSelect, dialogHandle, elementSelect, elementsUpdate, indexIncrement } from '../actions';
import utils from '../../../common/utils';
import './component-list.scss';

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
            menuX: 0,
            menuY: 0,
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

    // 右击
    menuShow(activeComponent, e) {
        const { button, pageX, pageY } = e;
        if (button == 2) {
            this.setState({
                menuX: pageX,
                menuY: pageY,
            });
            this.props.dispatch(componentSelect(activeComponent));
        } else {
            this.props.dispatch(componentSelect(''));
        }
    }

    // 设置元素成功
    async eleInsert() {
        const { elements, index, activeId, activeEle, activeComponent: element, altDown } = this.props.editorInfo;
        const id = this.uniqueKey(index);
        let newElements;
        const defaultEle = {
            element,
            id,
            text: '',
            onClick: this.onNodeSelect.bind(this, id),
            ...(element === 'Submit' ? { formId: activeId } : {}),
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
        this.props.dispatch(componentSelect(''));
        await this.props.dispatch(elementsUpdate(newElements)); // 元素更新 必须await，否则因为树没更新导致下面的方法获取不到新的树
        if (!altDown) this.onNodeSelect(id); // 按住alt不选择
        console.error('set success!!!');
    }

    // 选中元素
    onNodeSelect(id) {
        const { activeId, elements } = this.props.editorInfo;
        this.props.dispatch(elementSelect(id, activeId, elements));
    }

    render() {
        const { menuX, menuY } = this.state;
        const { activeEle, activeComponent } = this.props.editorInfo;

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
                                onMouseDown={this.menuShow.bind(this, row.component)}
                            >
                                {row.component} {row.title}
                            </div>
                        ))}
                    </div>
                ))}
                {activeComponent &&(!activeEle.element || utils.has(containerElement, activeEle.element))  && (
                    <div className='ele-menu' style={{ left: menuX, top: menuY }}>
                        <div className='row' onClick={this.eleInsert.bind(this)}>
                            插入到{activeEle.element || 'Root'}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

ComponentList.defaultProps = {};

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(ComponentList);
