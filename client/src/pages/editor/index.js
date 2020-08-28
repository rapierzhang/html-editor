import React, { Component } from 'react';
import { connect } from 'react-redux';
import query from 'query-string';
import html2canvas from 'html2canvas';
import { Dialog } from '../../component/common';
import utils from '../../common/utils';
import { Element, SideBar, ComponentList, Setting } from './components';
import {
    SaveOutlined,
    DeleteOutlined,
    BuildOutlined,
    EyeOutlined,
    UploadOutlined,
    DownloadOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import QRCode from 'qrcode.react';
import { scriptListGet } from '../../actions';
import {
    pageInit,
    pidSet,
    canvasPositionSet,
    htmlTreeUpdate,
    htmlSave,
    htmlBuild,
    htmlOpen,
    htmlRelease,
    htmlDownload,
    htmlDelete,
    titleSet,
    descSet,
    dirNameSet,
    activeIdSet,
    isEditSet,
    listPreviewSave,
    iconListSet,
    attributeUpdate,
    ctrlListen,
    componentGet,
    componentSave,
    navHandle,
} from './actions';
import './editor.scss';

const componentDetaultData = {
    component: {
        id: 'component-root',
        element: 'ComponentRoot',
        children: [],
    },
};

const pageDefaultData = {
    root: {
        id: 'root',
        element: 'Root',
        children: [],
    },
};

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: '',
            model: '',

            deleteShow: false,
            deletePid: '',

            previewUrl: '',

            releaseListShow: false, // 脚本列表
            settingShow: false, // 页面设置

            scriptListData: utils.defaultData,
        };
    }

    componentDidMount() {
        setTimeout(() => this.ctxPosition(), 500);
        this.init();
        this.scriptListGet();

        // 禁止右击菜单
        document.oncontextmenu = () => false;

        this.listenAlt();
    }

    // 获取脚本列表
    scriptListGet() {
        utils.fetchLoading(this, 'scriptListData');
        scriptListGet().then(scriptListData => {
            utils.fetchSucc(this, 'scriptListData', scriptListData);
        });
    }

    // 初始化
    init() {
        const { pid, model } = query.parse(this.props.location.search);
        this.setState({ pid, model });
        const init = model === 'component' ? componentGet : pageInit;
        init({ pid })
            .then(res => {
                const { pid, title, desc, htmlTree, iconfontUrl, iconList, dirName } = res;
                this.props.dispatch(pidSet(pid));
                const tree = htmlTree ? htmlTree : model === 'component' ? componentDetaultData : pageDefaultData;
                this.props.dispatch(htmlTreeUpdate(tree));
                title && this.props.dispatch(titleSet(title));
                desc && this.props.dispatch(descSet(desc));
                dirName && this.props.dispatch(dirNameSet(dirName));
                // 设置iconfont
                if (iconfontUrl) {
                    this.props.dispatch(iconListSet(iconfontUrl, iconList));
                    const header = document.getElementById('iconfont');
                    header.setAttribute('href', iconfontUrl);
                }
                this.setGlobalStyle(htmlTree)
                // 设置参数但不跳转
                window.history.pushState(
                    null,
                    null,
                    `${location.origin}/editor?${model ? `model=${model}&` : ''}pid=${pid}`,
                );
            })
            .catch(err => {
                console.error(err);
            });
    }

    // 设置全局css
    setGlobalStyle(htmlTree) {
        let {
            root: { others: { globalCss } = {} },
        } = htmlTree;
        if (!globalCss) return;
        globalCss = globalCss.replace(/  /g, '');
        const $globalStyle = document.getElementById('global-style');
        let valueList = globalCss.split('\n');
        valueList = valueList.map(val => (val.indexOf('{') > -1 ? `#context ${val}` : val));
        $globalStyle.innerText = valueList.join('');
    }

    // 监听按住alt
    listenAlt() {
        document.onkeydown = event => {
            const e = event || window.event;
            if (e.keyCode === 18) this.props.dispatch(ctrlListen(true));
            const { altDown } = this.props.editorInfo;
            if (altDown === true) {
                switch (e.keyCode) {
                    case 83:
                        this.save();
                        break;
                    case 66:
                        this.build();
                        break;
                    case 80:
                        this.open();
                        break;
                    default:
                        return;
                }
            }
        };
        document.onkeyup = event => {
            const e = event || window.event;
            if (e.keyCode === 18) this.props.dispatch(ctrlListen(false));
        };
    }

    // 控制标题
    async handleTitle(status) {
        const { title } = this.props.editorInfo;
        const { model } = this.state;
        await this.setState({ titleEdit: status });
        if (status) {
            if (utils.has(['未命名页面', '未命名模块'], title)) this.props.dispatch(titleSet(''));
        } else {
            if (!title) this.props.dispatch(titleSet(model === 'component' ? '未命名模块' : '未命名页面'));
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

    // 获取画布位置
    ctxPosition() {
        const { offsetTop, offsetHeight, offsetLeft, offsetWidth } = this.refs.ctx || {};
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

    // 取消选中
    unSelect(e) {
        e.stopPropagation();
        this.props.dispatch(attributeUpdate({}));
        this.props.dispatch(isEditSet(false));
        this.props.dispatch(navHandle(0));
        // 双击取消选择元素
        if (!this.props.editorInfo.isEdit) this.props.dispatch(activeIdSet(false));
    }

    // 渲染画布中元素
    renderHtmlTree(htmlTree) {
        const { activeId } = this.props.editorInfo;
        const list = Object.values(htmlTree);
        return list.map((item, idx) => (
            <Element key={`item-${idx}`} item={item} active={activeId == item.id}>
                {item.children && this.renderHtmlTree(item.children)}
            </Element>
        ));
    }

    // 保存
    async save() {
        const { htmlTree, pid, title, desc } = this.props.editorInfo;
        let preview = '';
        // 生成截图
        await html2canvas(document.getElementById('root')).then(async canvas => {
            const base64Data = canvas.toDataURL('image/png');
            const blob = utils.dataURItoBlob(base64Data);
            const formData = new FormData();
            formData.append('file', blob);
            formData.append('pid', pid);
            // 保存截图
            preview = await listPreviewSave(formData);
        });
        await htmlSave({
            pid,
            title,
            desc,
            htmlTree,
            preview,
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
                console.error(err);
                if (err.code == 3001) {
                    utils.toast('请先保存数据');
                } else {
                    utils.toast('生成失败');
                }
            });
    }

    async saveBuild(e) {
        const { button } = e;
        if (button === 2) {
            await this.save();
            this.build();
        }
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
                console.error(err);
            });
    }

    // 移动端预览
    preview() {
        const { pid } = this.props.editorInfo;
        if (!this.state.previewUrl) {
            htmlOpen({ pid })
                .then(res => {
                    this.setState({ previewUrl: res.url });
                })
                .catch(err => {
                    utils.toast(err.msg);
                    console.error(err);
                });
        }
    }

    // 发布
    release(sid) {
        const { pid } = this.props.editorInfo;
        htmlRelease({ pid, sid })
            .then(res => {
                utils.toast('发布成功');
            })
            .catch(err => {
                utils.toast('发布失败');
                console.error(err);
            });
    }

    download() {
        const { pid } = this.props.editorInfo;
        htmlDownload({ pid })
            .then(res => {
                window.open(res.url);
            })
            .catch(err => {
                utils.toast(err.msg);
                console.error(err);
            });
    }

    // 删除弹窗控制
    deleteDialogHandle(deleteShow) {
        this.setState({ deleteShow });
    }

    delInputChange(e) {
        const deletePid = e.target.value;
        this.setState({ deletePid });
    }

    // 确认删除
    delConfirm() {
        const { pid } = this.props.editorInfo;
        const { deletePid } = this.state;
        if (deletePid === pid) {
            htmlDelete({ pid }).then(res => {
                if (res.result === true) {
                    utils.toast('删除成功 3秒后页面关闭');
                    setTimeout(() => window.close(), 3000);
                }
            });
            this.deleteDialogHandle(false);
        } else {
            utils.toast('请输入正确的pid');
        }
    }

    // 复制pid
    copyPid() {
        const { pid } = this.props.editorInfo;
        utils.copy(pid);
    }

    // 模板保存
    componentSave() {
        const { htmlTree, pid, title, desc } = this.props.editorInfo;
        componentSave({
            pid,
            title,
            desc,
            htmlTree,
        })
            .then(res => {
                utils.toast(res.result ? '保存成功' : '保存失败');
            })
            .catch(err => {
                utils.toast(['保存失败', err.msg]);
            });
    }

    componentDel() {}

    // 发布列表控制
    handleReleaseList(releaseListShow) {
        this.setState({ releaseListShow });
    }

    stop(e) {
        e.stopPropagation();
    }

    // ^^^^^^
    pageChange(page) {}

    // 页面设置
    settingHandle(settingShow) {
        this.setState({ settingShow });
    }

    render() {
        const {
            editorInfo: { pid, title, desc, htmlTree, activeEle },
        } = this.props;
        const { deleteShow, deletePid, model, scriptListData, releaseListShow, settingShow, previewUrl } = this.state;
        const {
            data: { pageList: scriptList = [] },
        } = scriptListData;

        return (
            <div className='editor'>
                <div className='header'>
                    {/*------ 标题 ------*/}
                    <div className='title-info'>
                        <input
                            type='text'
                            className='title-input'
                            value={title}
                            placeholder={model === 'component' ? '未命名模块' : '未命名页面'}
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
                    {model === 'component' ? (
                        <div className='btn-box'>
                            <div className='button' onClick={this.componentSave.bind(this)}>
                                <SaveOutlined />
                                保存
                            </div>
                            <div className='button' onClick={this.componentDel.bind(this)}>
                                <DeleteOutlined />
                                删除模板
                            </div>
                        </div>
                    ) : (
                        <div className='btn-box'>
                            <div className='button' onClick={this.settingHandle.bind(this, true)}>
                                <SettingOutlined />
                                页面设置
                            </div>
                            <div
                                className='button'
                                onClick={this.save.bind(this)}
                                onMouseDown={this.saveBuild.bind(this)}
                            >
                                <SaveOutlined />
                                保存
                            </div>
                            <div className='button' onClick={this.build.bind(this)}>
                                <BuildOutlined />
                                生成
                            </div>
                            <div className='page-preview' onMouseEnter={this.preview.bind(this)}>
                                <div className='button' onClick={this.open.bind(this)}>
                                    <EyeOutlined />
                                    预览
                                </div>
                                {previewUrl && (
                                    <div className='qr-box'>
                                        <QRCode value={previewUrl} size={120} fgColor='#000000' />
                                        <div className='trangle-outer'>
                                            <div className='trangle-inner' />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='page-release'>
                                <div className='button' onClick={this.handleReleaseList.bind(this, !releaseListShow)}>
                                    <UploadOutlined />
                                    发布
                                </div>
                                {releaseListShow && (
                                    <div className='script-list'>
                                        <div className='trangle-outer'>
                                            <div className='trangle-inner'></div>
                                        </div>
                                        {scriptList.map((item, idx) => (
                                            <div
                                                key={`item-${idx}`}
                                                className='script-item'
                                                title={item.desc}
                                                onClick={this.release.bind(this, item.sid)}
                                            >
                                                {item.title}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className='button' onClick={this.download.bind(this)}>
                                <DownloadOutlined />
                                下载
                            </div>
                            <div className='button' onClick={this.deleteDialogHandle.bind(this, true)}>
                                <DeleteOutlined />
                                删除页面
                            </div>
                        </div>
                    )}
                </div>
                <div className='content'>
                    {/*------ 元素列表 ------*/}
                    <ComponentList />
                    {/*------ 画布 ------*/}
                    <div id='table' className='table' onMouseDown={this.unSelect.bind(this)}>
                        <div id='context' className='context' ref='ctx'>
                            {this.renderHtmlTree(htmlTree)}
                        </div>
                        {/* ^^^^^^ TODO 是否可删除*/}
                        {activeEle.element === 'FullPage' && (
                            <div className='page-number' onClick={this.stop.bind(this)}>
                                {Object.values(activeEle.children).map((item, idx) => (
                                    <div key={`item-${idx}`} className='page-item' onClick={this.pageChange.bind(this)}>
                                        {idx + 1}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/*------ 属性 ------*/}
                    <SideBar />
                </div>
                {/*------ 删除弹窗 ------*/}
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
                    <p className='delete-key' onClick={this.copyPid.bind(this)}>
                        {pid}
                    </p>
                    <input
                        type='text'
                        className='delete-input'
                        placeholder='请粘贴上面的id入内删除'
                        value={deletePid}
                        onChange={this.delInputChange.bind(this)}
                    />
                </Dialog>
                {/*------ 设置弹窗 ------*/}
                {settingShow && <Setting onClose={this.settingHandle.bind(this)} />}
            </div>
        );
    }
}

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(Editor);
