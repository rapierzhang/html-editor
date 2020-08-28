import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { AttrList, Tree, StyleList } from './index';
import { CloseOutlined } from '@ant-design/icons';
import { activeIdSet, isEditSet, navHandle } from '../actions';
import './side-bar.scss';
import { utils } from '../../../common';

class SideBar extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            navIndex: 0,
        };
    }

    switchNav(navIndex) {
        this.props.dispatch(navHandle(navIndex));
    }

    // 关闭
    close() {
        this.props.dispatch(activeIdSet(false));
        this.props.dispatch(isEditSet(false));
        this.props.dispatch(navHandle(0));
    }

    render() {
        const { isEdit, navIndex, activeEle } = this.props.editorInfo;

        return (
            <div id='side-bar' className='editor-side-bar'>
                {isEdit ? (
                    <div className='side-bar-box'>
                        {/*------ nav ------*/}
                        <div className='nav'>
                            <div className='nav-item-box'>
                                <span
                                    className={classNames('nav-item', { actived: navIndex == 0 })}
                                    onClick={this.switchNav.bind(this, 0)}
                                >
                                    属性
                                </span>
                                {!utils.has(['Component', 'Html'], activeEle.element) && (
                                    <span
                                        className={classNames('nav-item', { actived: navIndex == 1 })}
                                        onClick={this.switchNav.bind(this, 1)}
                                    >
                                        样式
                                    </span>
                                )}
                            </div>
                            <div className='close' onClick={this.close.bind(this)}>
                                <CloseOutlined />
                            </div>
                        </div>
                        {/*------ 属性 ------*/}
                        {navIndex === 0 && <AttrList />}
                        {/*------ 样式 ------*/}
                        {navIndex === 1 && <StyleList />}
                    </div>
                ) : (
                    <Tree />
                )}
            </div>
        );
    }
}

SideBar.defaultProps = {};

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(SideBar);
