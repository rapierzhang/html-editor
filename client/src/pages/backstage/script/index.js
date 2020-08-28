import React, { Component } from 'react';
import classNames from 'classnames';
import query from 'query-string';
import { Select, Input, Button } from 'antd';
import { scriptGet, scriptSave, scriptDelete, scriptOpenSSH, initDir } from './actions';
import { FileAddOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { Dialog, InputCode } from '../../../component/common';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/theme-monokai';
import { scriptListGet } from '../../../actions';
import { utils } from '../../../common';
import './script.scss';

const rsyncList = [
    {
        key: 'title',
        text: '标题',
        type: 'text',
    },
    {
        key: 'desc',
        text: '简介',
        type: 'text',
    },
    {
        key: 'username',
        text: '用户名',
        type: 'text',
    },
    {
        key: 'host',
        text: 'host',
        type: 'text',
    },
    {
        key: 'password',
        text: '密码',
        type: 'password',
    },
];

class List extends Component {
    constructor() {
        super(...arguments);
        const { sid } = query.parse(this.props.location.search);
        this.state = {
            sid,

            title: '',
            desc: '',
            script: '',
            username: '',
            host: '',
            password: '',
            deployPath: '',

            modelType: '',

            scriptListData: utils.defaultData,
            sshOpenData: utils.defaultData,
            initDirData: utils.defaultData,

            deleteShow: false,
            deleteSid: '',
        };
    }

    componentDidMount() {
        this.scriptListGet();
    }

    // 脚本列表
    scriptListGet() {
        const { sid } = this.state;
        utils.fetchLoading(this, 'scriptListData');
        scriptListGet().then(scriptListData => {
            utils.fetchSucc(this, 'scriptListData', scriptListData);
            const { pageList } = scriptListData;
            if (sid) {
                this.selectSrcipt(sid);
            } else {
                if (pageList.length > 0) this.selectSrcipt(pageList[0].sid);
            }
        });
    }

    // 数据获取
    scriptGet(sid = '') {
        scriptGet({ sid }).then(res => {
            const { sid, title, desc, script, username, host, password, deployPath, modelType } = res;
            this.setState({
                sid,
                title,
                desc,
                script,
                username,
                host,
                password,
                deployPath,
                modelType,
            });
            window.history.pushState(null, null, `${location.origin}/backstage/script?sid=${sid}`);
        });
    }

    // 保存
    save() {
        const { sid, title, desc, script, username, host, password, deployPath, modelType } = this.state;
        scriptSave({ sid, title, desc, script, username, host, password, deployPath, modelType })
            .then(res => {
                if (res.result === true) {
                    this.scriptListGet();
                    utils.toast('保存成功');
                } else {
                    utils.toast('保存失败');
                }
            })
            .catch(() => {
                utils.toast('保存失败');
            });
    }

    // 删除弹窗控制
    deleteDialogHandle(deleteShow) {
        this.setState({ deleteShow });
    }

    // 复制Sid
    copySid() {
        const { sid } = this.state;
        utils.copy(sid);
    }

    delInputChange(e) {
        const deleteSid = e.target.value;
        this.setState({ deleteSid });
    }

    delConfirm() {
        const { sid, deleteSid } = this.state;
        if (sid === deleteSid) {
            scriptDelete({ sid })
                .then(res => {
                    if (res.result === true) {
                        utils.toast('删除成功');
                        this.setState({ sid: '' });
                        this.scriptListGet();
                        this.deleteDialogHandle(false);
                    } else {
                        utils.toast('删除失败');
                    }
                })
                .catch(err => utils.toast(err.msg));
        } else {
            utils.toast('请输入正确的sid');
        }
    }

    // 输入
    onTextChange(name, e) {
        const value = typeof e === 'object' ? e.target.value : e;
        this.setState({ [name]: value });
    }

    // 选择脚本
    selectSrcipt(sid) {
        this.scriptGet(sid);
    }

    // 新建脚本
    newScript() {
        this.scriptGet('');
    }

    onSelect(modelType) {
        this.setState({ modelType });
    }

    // 打通ssh
    openSsh() {
        const { username, host, password } = this.state;
        if (!username) {
            utils.toast('请填写服务器用户名');
            return;
        }
        if (!host) {
            utils.toast('请填写服务器host');
            return;
        }
        if (!password) {
            utils.toast('请填写服务器密码');
            return;
        }
        utils.fetchLoading(this, 'sshOpenData');
        scriptOpenSSH({
            username,
            host,
            password,
        }).then(res => {
            utils.fetchSucc(this, 'sshOpenData', res);
            if (res.result === true) {
                utils.toast('ssh已打通');
            } else {
                utils.toast('ssh打通失败，请重试或者尝试手动打通');
            }
        });
    }

    // 初始化目录
    initDir() {
        const { username, host, password, deployPath } = this.state;
        utils.fetchLoading(this, 'initDirData');
        initDir({ username, host, password, deployPath }).then(res => {
            utils.fetchSucc(this, 'initDirData', res);
            if (res.result === true) {
                utils.toast('文件初始化成功');
            } else {
                utils.toast('文件初始化失败，请重试或手动完成');
            }
        });
    }

    onEditorChange(value) {
        this.onTextChange('script', value);
    }

    render() {
        const {
            sid,
            deployPath,
            script,
            modelType,
            scriptListData,
            sshOpenData,
            initDirData,
            deleteShow,
            deleteSid,
        } = this.state;
        const { fetchStatus: sshOpenStatus } = sshOpenData;
        const { fetchStatus: initDirStatus } = initDirData;

        const {
            data: { pageList: scriptList = [] },
        } = scriptListData;
        return (
            <div className='script'>
                {/*------ 脚本列表 ------*/}
                <div className='script-list'>
                    {scriptList.map((row, idx) => (
                        <div
                            key={`row-${idx}`}
                            className={classNames('script-item', { active: sid === row.sid })}
                            title={row.desc}
                            onClick={this.selectSrcipt.bind(this, row.sid)}
                        >
                            {row.title}
                        </div>
                    ))}
                </div>
                <div className='script-box'>
                    {/*------ nav ------*/}
                    <div className='nav'>
                        <div className='title'>发布脚本配置</div>
                        <div className='btn-box'>
                            <div className='button primary' onClick={this.newScript.bind(this)}>
                                <FileAddOutlined />
                                新建
                            </div>
                            <div className='button success' onClick={this.save.bind(this)}>
                                <SaveOutlined />
                                保存
                            </div>
                            <div className='button danger' onClick={this.deleteDialogHandle.bind(this, true)}>
                                <DeleteOutlined />
                                删除
                            </div>
                        </div>
                    </div>
                    {/*------ 信息 ------*/}
                    <div className='script-scroll'>
                        {/*------ 表单信息 ------*/}
                        {rsyncList.map((item, idx) => (
                            <div className='row' key={`item-${idx}`}>
                                <span className='text'>{item.text}:</span>
                                {item.type === 'password' ? (
                                    <Input.Password
                                        size='large'
                                        className='input'
                                        value={this.state[item.key]}
                                        onChange={this.onTextChange.bind(this, item.key)}
                                    />
                                ) : (
                                    <Input
                                        size='large'
                                        className='input'
                                        value={this.state[item.key]}
                                        onChange={this.onTextChange.bind(this, item.key)}
                                    />
                                )}
                            </div>
                        ))}
                        <div className='row'>
                            <span className='text'>打通ssh:</span>
                            <Button
                                className='button'
                                type='primary'
                                size='large'
                                loading={sshOpenStatus === 'loading'}
                                onClick={this.openSsh.bind(this)}
                            >
                                打通ssh
                            </Button>
                        </div>
                        {/*------ 部署方式 ------*/}
                        <div className='row'>
                            <span className='text'>部署方式:</span>
                            <div>
                                <Select
                                    value={modelType}
                                    className='select'
                                    size='large'
                                    onChange={this.onSelect.bind(this)}
                                >
                                    <Select.Option value='rsync'>同步</Select.Option>
                                    <Select.Option value='script'>脚本</Select.Option>
                                </Select>
                            </div>
                        </div>

                        {modelType === 'rsync' && (
                            <div className='row'>
                                <span className='text'>初始化:</span>
                                <Button
                                    className='button'
                                    type='primary'
                                    size='large'
                                    loading={initDirStatus === 'loading'}
                                    onClick={this.initDir.bind(this)}
                                >
                                    初始化目录
                                </Button>
                            </div>
                        )}
                        {modelType === 'rsync' && (
                            <div className='row'>
                                <span className='text'>文件路径:</span>
                                <Input
                                    size='large'
                                    type='text'
                                    className='input'
                                    value={deployPath}
                                    onChange={this.onTextChange.bind(this, 'deployPath')}
                                />
                            </div>
                        )}
                        {modelType === 'script' && (
                            <div className='row'>
                                <span className='text'>脚本:</span>
                                <InputCode
                                    className='code'
                                    height='280px'
                                    width='100%'
                                    placeholder='参数$1为pid'
                                    mode='sh'
                                    value={script}
                                    onChange={this.onEditorChange.bind(this)}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <Dialog
                    title='删除确认'
                    show={deleteShow}
                    onClose={this.deleteDialogHandle.bind(this, false)}
                    renderFooter={
                        <div className='footer'>
                            <div className='button cancel' onClick={this.deleteDialogHandle.bind(this, false)}>
                                取消
                            </div>
                            <div className='button confirm' onClick={this.delConfirm.bind(this)}>
                                确认
                            </div>
                        </div>
                    }
                >
                    <p className='delete-key' onClick={this.copySid.bind(this)}>
                        {sid}
                    </p>
                    <input
                        type='text'
                        className='delete-input'
                        placeholder='请粘贴上面的sid入内删除'
                        value={deleteSid}
                        onChange={this.delInputChange.bind(this)}
                    />
                </Dialog>
            </div>
        );
    }
}

export default List;
