import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Dialog } from '../../component';
import { Element, SideBar, ComponentList } from './components';
import utils from '../../common/utils';
import query from 'query-string';
import html2canvas from 'html2canvas';
import './editor.scss';
import {
    pageInit,
    pidSet,
    canvasPositionSet,
    elementsUpdate,
    htmlSave,
    htmlBuild,
    htmlOpen,
    htmlRelease,
    indexSet,
    titleSet,
    descSet,
    activeIdSet,
    isEditSet,
    listPreviewSave,
    htmlDelete, iconListSet,
} from './actions';


class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: '',

            deleteShow: false,
            deletePid: '',
        };
    }

    componentDidMount() {
        setTimeout(() => this.ctxPosition(), 500);
        this.init();

        // 禁止右击菜单
        document.oncontextmenu = () => false;

        //禁止鼠标选中文本
        document.onselectstart = () => false;

        // ^^^^^^ 鼠标右击
        /*document.onmousedown = e => {
            const event = e || window.event;
            if (event.button == '2') {
                console.error(111, e)
            }
        };*/
    }

    // 初始化
    init() {
        const { pid } = query.parse(this.props.location.search);
        this.setState({ pid });
        pageInit({ pid })
            .then(res => {
                const { pid, index, title, desc, htmlTree, iconfontUrl, iconList } = res;
                this.props.dispatch(pidSet(pid));
                index && this.props.dispatch(indexSet(index));
                htmlTree && this.props.dispatch(elementsUpdate(htmlTree));
                title && this.props.dispatch(titleSet(title));
                desc && this.props.dispatch(descSet(desc));
                if (iconfontUrl) {
                    this.props.dispatch(iconListSet(iconfontUrl, iconList));
                    const header = document.getElementById('iconfont');
                    header.setAttribute('href', iconfontUrl);
                }
                // 设置参数但不跳转
                window.history.pushState(null, null, `${location.origin}/editor?pid=${pid}`);
            })
            .catch(err => {
                console.error(err);
            });
    }

    // 控制标题
    async handleTitle(status) {
        const { title } = this.props.editorInfo;
        await this.setState({ titleEdit: status });
        if (status) {
            if (title == '未命名页面') this.props.dispatch(titleSet(''));
        } else {
            if (!title) this.props.dispatch(titleSet('未命名页面'));
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
        this.props.dispatch(activeIdSet(false));
        this.props.dispatch(isEditSet(false));
    }

    // 渲染画布中元素
    renderElements(elements) {
        const { activeId } = this.props.editorInfo;
        const list = Object.values(elements);
        return list.map((item, idx) => {
            return (
                <Element key={`item-${idx}`} item={item} active={activeId == item.id}>
                    {item.children && this.renderElements(item.children)}
                </Element>
            );
        });
    }

    // 保存
    async save() {
        const { elements, pid, index, title, desc } = this.props.editorInfo;
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
        htmlSave({
            pid,
            index,
            title,
            desc,
            htmlTree: elements,
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
                console.error(err);
            });
    }

    // 发布
    release() {
        const { pid } = this.props.editorInfo;
        htmlRelease({ pid })
            .then(res => {
                utils.toast('发布成功');
            })
            .catch(err => {
                utils.toast('发布失败');
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
                    utils.toast('删除成功');
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


    render() {
        const {
            editorInfo: { pid, title, desc, elements },
        } = this.props;
        const { deleteShow, deletePid } = this.state;

        return (
            <div className='editor'>
                <div className='header'>
                    {/*------ 标题 ------*/}
                    <div className='title-info'>
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
                        <div className='button warrning' onClick={this.build.bind(this)}>
                            生成
                        </div>
                        <div className='button success' onClick={this.open.bind(this)}>
                            打开
                        </div>
                        <div className='button info' onClick={this.release.bind(this)}>
                            发布
                        </div>
                        <div className='button danger' onClick={this.deleteDialogHandle.bind(this, true)}>
                            删除
                        </div>
                    </div>
                </div>
                <div className='content'>
                    {/*------ 元素列表 ------*/}
                    <ComponentList />
                    {/*------ 画布 ------*/}
                    <div className='table' onClick={this.unSelect.bind(this)}>
                        <div id='context' className='context' ref='ctx'>
                            {this.renderElements(elements)}
                        </div>
                    </div>
                    {/*------ 属性 ------*/}
                    <SideBar />
                </div>
                {/*------ 删除弹窗 ------*/}
                <Dialog
                    title='删除确认'
                    show={deleteShow}
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
            </div>
        );
    }
}

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(Editor);
