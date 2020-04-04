import React, { Component } from 'react';
import classNames from 'classnames';
import './attr-form.scss';
import utils from '../../../common/utils';

class ArrtForm extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            navIndex: 0,
        };
    }

    switchNav(navIndex) {
        this.setState({ navIndex });
    }

    removeEle() {
        const { activeKey } = this.props
    }

    // 属性更改
    onAttrChange(attr, e) {
        const { activeKey, elements } = this.props;
        const thisEle = utils.deepSearch(elements, activeKey);
        const val = e.target.value;
        const obj = {
            ...thisEle,
            [attr]: val,
        };
        this.props.onAttrChange(obj);
    }

    // 样式更改
    onStyleChange(attr, e) {
        const { activeKey, elements } = this.props;
        const thisEle = elements[activeKey];
        const thisStyle = thisEle.style;
        const val = e.target.value;
        const obj = {
            ...thisEle,
            style: { ...thisStyle, [attr]: val },
        };
        this.props.onAttrChange(obj);
    }

    // 关闭
    close() {
        this.props.clearActiveKey();
    }

    selectEle(key) {
        this.props.onSelectEle(key);
    }

    // 渲染树结构
    renderTree(elements, activeKey, floor = 0) {
        const arr = Object.values(elements);
        return arr.map((ele, idx) => {
            const key = `${idx}-${parseInt(Math.random() * 1e5)}`;
            const row = (
                <div
                    key={key}
                    className={classNames('tree-item', { active: ele.key === activeKey })}
                    style={{ paddingLeft: `${floor * 10}px` }}
                    onClick={this.selectEle.bind(this, ele.key)}
                >
                    |- {ele.element}
                </div>
            );
            if (ele.children) {
                return [row, this.renderTree(ele.children, activeKey, floor + 1)];
            } else {
                return row;
            }
        });
    }

    render() {
        const { activeKey, isEdit, elements } = this.props;
        const { navIndex } = this.state;
        const thisEle = elements[activeKey];

        return (
            <div>
                {isEdit ? (
                    <div className='attr-list'>
                        <div className='nav'>
                            <span
                                className={classNames('nav-item', { actived: navIndex == 0 })}
                                onClick={this.switchNav.bind(this, 0)}
                            >
                                属性
                            </span>
                            <span
                                className={classNames('nav-item', { actived: navIndex == 1 })}
                                onClick={this.switchNav.bind(this, 1)}
                            >
                                样式
                            </span>
                        </div>
                        <div className='blank' />
                        {navIndex == 0 && (
                            <div className='attr-box'>
                                <div className='attr-title'>
                                    <span>属性</span>
                                    <button className='close' onClick={this.close.bind(this)}>
                                        X
                                    </button>
                                </div>
                                <div className='attr-card'>
                                    <div className='card-title'>定位</div>
                                    <div className='card-content'>
                                        <div className="row">
                                            <button className='del-ele' onClick={this.removeEle.bind(this)}>删除节点</button>
                                        </div>
                                        <div className='row'>
                                            <span>文字 </span>
                                            <input type='text' onBlur={this.onAttrChange.bind(this, 'text')} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {navIndex == 1 && (
                            <div className='style-box'>
                                <div className='attr-title'>
                                    <span>样式</span>
                                    <button className='close' onClick={this.close.bind(this)}>
                                        close
                                    </button>
                                </div>

                                {/*------ 背景 ------*/}
                                <div className='attr-card'>
                                    <div className='card-title'>背景</div>
                                    <div className='card-content'>
                                        <div className='row'>
                                            <span>背景图: </span>
                                            <input
                                                type='text'
                                                onBlur={this.onStyleChange.bind(this, 'backgroundImage')}
                                            />
                                        </div>
                                        <div className='row'>
                                            <span>背景颜色: </span>
                                            <input
                                                type='text'
                                                onBlur={this.onStyleChange.bind(this, 'backgroundColor')}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/*------ 字体 ------*/}
                                <div className='attr-card'>
                                    <div className='card-title'>字体</div>
                                    <div className='card-content'>
                                        <div className='row'>
                                            <span>字号: </span>
                                            <input type='text' onBlur={this.onStyleChange.bind(this, 'fontSize')} />
                                        </div>
                                        <div className='row'>
                                            <span>颜色: </span>
                                            <input type='text' onBlur={this.onStyleChange.bind(this, 'color')} />
                                        </div>
                                        <div className='row'>
                                            <span>字体: </span>
                                            <input type='text' onBlur={this.onStyleChange.bind(this, 'fontFamily')} />
                                        </div>
                                    </div>
                                </div>
                                {/*------ 盒子模型 ------*/}
                                <div className='attr-card'>
                                    <div className='card-title'>盒子</div>
                                    <div className='card-content'>
                                        <div className='box-model'>
                                            <span className='tag'>margin</span>
                                            <input className='box-input' type='text' placeholder='-' />
                                            <div className='margin-inner'>
                                                <input className='box-input' type='text' placeholder='-' />
                                                <div className='border'>
                                                    <span className='tag'>border</span>
                                                    <input className='box-input' type='text' placeholder='-' />
                                                    <div className='border-inner'>
                                                        <input className='box-input' type='text' placeholder='-' />
                                                        <div className='padding'>
                                                            <span className='tag'>padding</span>

                                                            <input
                                                                className='padding-input'
                                                                type='text'
                                                                placeholder='-'
                                                            />
                                                            <div className='padding-inner'>
                                                                <input
                                                                    className='padding-input'
                                                                    type='text'
                                                                    placeholder='-'
                                                                />
                                                                <div className='entity'>
                                                                    <input
                                                                        className='entity-input'
                                                                        type='text'
                                                                        placeholder='width'
                                                                    />
                                                                    x
                                                                    <input
                                                                        className='entity-input'
                                                                        type='text'
                                                                        placeholder='height'
                                                                    />
                                                                </div>
                                                                <input
                                                                    className='padding-input'
                                                                    type='text'
                                                                    placeholder='-'
                                                                />
                                                            </div>
                                                            <input
                                                                className='padding-input'
                                                                type='text'
                                                                placeholder='-'
                                                            />
                                                        </div>
                                                        <input className='box-input' type='text' placeholder='-' />
                                                    </div>
                                                    <input className='box-input' type='text' placeholder='-' />
                                                </div>
                                                <input className='box-input' type='text' placeholder='-' />
                                            </div>
                                            <input className='box-input' type='text' placeholder='-' />
                                        </div>
                                    </div>
                                </div>
                                {/*------ 扩展 ------*/}
                                <div className='attr-card'>
                                    <div className='card-title'>扩展</div>
                                    <div className='card-content'>
                                        <textarea
                                            name=''
                                            id=''
                                            cols='30'
                                            rows='10'
                                            onBlur={this.onStyleChange.bind(this, 'extend')}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='tree'>{this.renderTree(elements, activeKey)}</div>
                )}
            </div>
        );
    }
}

export default ArrtForm;
