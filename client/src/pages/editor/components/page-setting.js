import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Help } from '../../../component/common';
import { Row, Col, Input, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { pageInit, htmlTreeUpdate, dirNameSave, dirNameSet } from '../actions';
import utils from '../../../common/utils';
import './page-setting.scss';

class Setting extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            copyId: '',
            dirName: '',
        };
    }

    componentDidMount() {
        const { dirName } = this.props.editorInfo;
        this.setState({ dirName });
    }

    onCopyIdChange(e) {
        this.setState({ copyId: e.target.value });
    }

    // 继承页面
    extendPage() {
        pageInit({ pid: this.state.copyId })
            .then(res => {
                const { htmlTree } = res;
                if (htmlTree) {
                    this.props.dispatch(htmlTreeUpdate(htmlTree));
                    utils.toast('拷贝成功');
                } else {
                    utils.toast('无此页面，请确认pid是否正确');
                }
            })
            .catch(err => utils.toast('拷贝失败，请重试'));
    }

    onDirNameChange(e) {
        this.setState({ dirName: e.target.value });
    }

    onDirNameSave() {
        const { dirName } = this.state;
        const { pid } = this.props.editorInfo;
        dirNameSave({ pid, dirName })
            .then(res => {
                if (res.result === true) {
                    utils.toast('保存成功');
                    this.props.dispatch(dirNameSet(dirName));
                } else {
                    utils.toast('保存失败');
                }
            })
            .catch(err => {
                utils.toast(err.msg);
            });
    }

    close() {
        this.props.onClose(false);
    }

    render() {
        const { dirName, copyId } = this.state;
        return (
            <div className='page-setting'>
                <div className='panel'>
                    <div className='setting-title'>页面设置</div>
                    <div className='setting-close' onClick={this.close.bind(this, false)}>
                        <CloseOutlined />
                    </div>
                    {/*------ 拷贝页面 ------*/}
                    <Row className='row' align='middle'>
                        <Col className='setting-text' span={6}>
                            拷贝页面
                        </Col>
                        <Col span={12}>
                            <Input
                                placeholder='请输入pid'
                                size='large'
                                value={copyId}
                                onChange={this.onCopyIdChange.bind(this)}
                            />
                        </Col>
                        <Col span={1} />
                        <Col span={3}>
                            <Button
                                className='setting-button'
                                size='large'
                                type='primary'
                                onClick={this.extendPage.bind(this)}
                            >
                                查询复制
                            </Button>
                        </Col>
                        <Col span={1} />
                        <Col span={1}>
                            <Help text='输入想要复制页面的pid，点击按钮即可复制页面' />
                        </Col>
                    </Row>
                    {/*------ 路径设置 ------*/}
                    <Row className='row' align='middle'>
                        <Col className='setting-text' span={6}>
                            路径设置
                        </Col>
                        <Col span={12}>
                            <Input
                                placeholder='请输入网页路径'
                                size='large'
                                onChange={this.onDirNameChange.bind(this)}
                                value={dirName}
                            />
                        </Col>
                        <Col span={1} />
                        <Col span={3}>
                            <Button
                                className='setting-button'
                                size='large'
                                type='primary'
                                onClick={this.onDirNameSave.bind(this)}
                            >
                                保存
                            </Button>
                        </Col>
                        <Col span={1} />
                        <Col span={1}>
                            <Help text='静态网页访问路径。更改时已生成的页面，会改为新的路径。' />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

Setting.defaultProps = {
    onClose: () => {},
};

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(Setting);
