import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { utils } from '../../../common';
import axios from 'axios';
import { Button, Select, Switch, Input, Row, Col } from 'antd';
import { InputCode, Upload, Help } from '../../../component/common';
import { FloorCtrl, FuncBind } from './';
import { attrList } from './attr-map';
import Swiper from 'swiper';
import { compListGet } from '../../../actions';
import {
    activeIdSet,
    attributeUpdate,
    componentGet,
    htmlTreeUpdate,
    iconListSet,
    iconUpload,
    isEditSet,
    dialogHandle,
} from '../actions';
import './attr-list.scss';
import element from './element';

const imageUploadUrl = '/api/file/upload';

class AttrList extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            activeId: '',
            activeEle: {},

            iconfontUrl: '',
            funcName: '',
            funcText: '',
            globalCss: '',
            inMap: false,

            compData: utils.defaultData,
        };
    }

    componentDidMount() {
        const { activeId, activeEle, htmlTree } = this.props.editorInfo;
        if (activeEle.element === 'Component') {
            this.compListGet(1);
        }
        if (activeEle.element === 'Root') {
            const { globalCss } = activeEle.others;
            if (globalCss) this.setState({ globalCss });
        }
        const inMap = utils.isInFamily(htmlTree, activeId, 'element', 'Map');
        this.setState({ inMap });
    }

    static getDerivedStateFromProps(props, state) {
        const { activeId, activeEle } = props.editorInfo;
        if (activeId !== state.activeId) {
            const { bindJs } = activeEle.js;
            const keys = Object.keys(bindJs || {});
            if (keys.length === 0) {
                return {
                    activeId,
                    activeEle,
                };
            } else {
                /*return {
                    activeId,
                    activeEle,
                };*/
            }
        }
        if (JSON.stringify(props.activeEle) !== JSON.stringify(state)) {
            return { activeEle };
        }
    }

    initSwiper() {
        this.swiper = new Swiper('.swiper-container', {
            loop: true, // 循环模式选项

            // 如果需要分页器
            pagination: { el: '.swiper-pagination' },
        });
    }

    // 复制id
    copyActiveId(pid) {
        utils.copy(pid);
    }

    // 属性更改 {...item.func}中调用
    onAttrChange(belong, attrName, e) {
        // 判断是event传入的值还是组件传入的值
        const value = !!e.target ? e.target.value : e;
        const { htmlTree, activeId, activeEle: thisNode } = this.props.editorInfo;
        if (!thisNode[belong]) thisNode[belong] = {};
        thisNode[belong][attrName] = value;
        this.attrUpdate(htmlTree, activeId, thisNode);
    }

    // 上传成功
    onUploadSucc(data) {
        const { url } = data;
        this.onAttrChange('attr', 'src', url);
    }

    onUploadErr(err) {
        if (err.code === 3002) {
            utils.toast('请先生成此页面再上传！');
        } else {
            utils.toast('服务端错误，请重试');
        }
    }

    // 数组列表添加空行
    onListAdd(type, defaultRow) {
        const { activeEle: thisNode, activeId, htmlTree } = this.props.editorInfo;
        const { others } = thisNode;
        thisNode.others[type] = [...(others[type] || []), defaultRow];
        this.attrUpdate(htmlTree, activeId, thisNode);
    }

    // 数组列表删除行
    onListDel(type, idx) {
        const { activeEle: thisNode, activeId, htmlTree } = this.props.editorInfo;
        let thisList = thisNode.others[type];
        thisList.splice(idx, 1);
        thisNode.others[type] = thisList;
        this.attrUpdate(htmlTree, activeId, thisNode);
    }

    // 更改数组列表
    onListChange(key, idx, e) {
        const { htmlTree, activeId, activeEle: thisNode } = this.props.editorInfo;
        thisNode.others[key][idx] = e.target.value;
        this.attrUpdate(htmlTree, activeId, thisNode);
    }

    // 更改对象列表
    onKeyValListChange(idx, name, e) {
        const { htmlTree, activeId, activeEle: thisNode } = this.props.editorInfo;
        const { keyValList } = thisNode.others || [];
        keyValList[idx][name] = e.target.value;
        thisNode.others[keyValList] = keyValList;
        this.attrUpdate(htmlTree, activeId, thisNode);
    }

    // 更改thers属性
    othersAttrChange(key, e) {
        const { htmlTree, activeId, activeEle: thisNode } = this.props.editorInfo;
        thisNode.others[key] = e.target.value;
        this.attrUpdate(htmlTree, activeId, thisNode);
    }

    // 属性更新
    attrUpdate(htmlTree, activeId, newNode) {
        const newHtmlTree = utils.deepUpdate(htmlTree, { [activeId]: newNode });
        this.props.dispatch(htmlTreeUpdate(newHtmlTree));
        this.props.dispatch(attributeUpdate(newNode));
    }

    // 弹窗控制
    dialogHandle(id, state) {
        this.props.dispatch(dialogHandle(id, state));
    }

    // swiper上传成功
    onListUploadSucc(idx, data) {
        this.onListChange('imageList', idx, data.url);
    }

    // icon更改
    onIconChange(e) {
        this.setState({ iconfontUrl: e.target.value });
    }

    // iconfont上传
    uploadIcon() {
        const { pid } = this.props.editorInfo;
        const { iconfontUrl } = this.state;
        iconUpload({ pid, iconfontUrl })
            .then(res => {
                const { iconfontUrl, iconList } = res;
                const header = document.getElementById('iconfont');
                header.setAttribute('href', iconfontUrl);
                this.props.dispatch(iconListSet(iconfontUrl, iconList));
                utils.toast('上传成功');
            })
            .catch(err => {
                utils.toast('上传失败');
            });
    }

    // icon选中
    iconSelect(icon) {
        const { htmlTree, activeId, activeEle: thisNode } = this.props.editorInfo;
        const extClass = icon;
        thisNode.others.extClass = extClass;
        const newHtmlTree = utils.deepUpdate(htmlTree, { [activeId]: thisNode });
        this.props.dispatch(htmlTreeUpdate(newHtmlTree));
        this.props.dispatch(attributeUpdate(thisNode));
    }

    // 绑定方法
    onBindFuncChange(bindJs) {
        const { htmlTree, activeId, activeEle: thisNode } = this.props.editorInfo;
        if (!thisNode.js) thisNode.js = {};
        thisNode.js['bindJs'] = bindJs;
        const newHtmlTree = utils.deepUpdate(htmlTree, { [activeId]: thisNode });
        this.props.dispatch(htmlTreeUpdate(newHtmlTree));
        this.props.dispatch(attributeUpdate(thisNode));
    }

    // 自定义模板选择打开
    compListGet(pn = 1) {
        utils.fetchLoading(this, 'compData');
        compListGet({ pn, ps: 10 }).then(compData => {
            utils.fetchSucc(this, 'compData', compData);
        });
    }

    // 更换自定义模板
    onCompChange(pid, activeId) {
        componentGet({ pid }).then(res => {
            let { component } = res.htmlTree;
            // 将26进制id转为10进制id,然后与插入组件的每个id相加用以去重
            const decimalId = utils.letterToTen(activeId.replace(/-/g, ''));
            component.id = activeId;
            component.element = 'Component';
            // 更改children的key和id
            const children = utils.deepIdChange(component.children, id =>
                utils.splitByLine(utils.tenToLetter(utils.letterToTen(id.replace(/-/g, '')) + decimalId), 3, '-'),
            );
            component.children = children;
            const newHtmlTree = utils.deepUpdate(this.props.editorInfo.htmlTree, { [activeId]: component });
            this.props.dispatch(htmlTreeUpdate(newHtmlTree));
        });
    }

    // 新建模板
    toNewComponent() {
        window.open('editor?model=component');
    }

    // 删除元素
    removeEle() {
        const { htmlTree, activeId } = this.props.editorInfo;
        const newHtmlTree = utils.deepRemove(htmlTree, activeId);
        this.props.dispatch(htmlTreeUpdate(newHtmlTree));
        this.close();
    }

    close() {
        this.props.dispatch(activeIdSet(false));
        this.props.dispatch(isEditSet(false));
    }

    // 渲染attr
    renderAttr(item) {
        const { pid } = this.props.editorInfo;
        const { activeEle } = this.state;
        const { type, belong, value, inputType, selectList, placeholder, mode, updateFunc = 'onClick' } = item;
        const eleVal = activeEle[belong] ? activeEle[belong][value] : '';
        const { apiList } = activeEle.others || {};
        const func = { [updateFunc]: this.onAttrChange.bind(this, belong, value) };
        switch (type) {
            case 'input':
                return (
                    <Input
                        className='attr-input'
                        type={inputType}
                        value={eleVal}
                        size='large'
                        placeholder={placeholder}
                        {...func}
                    />
                );
            case 'textarea':
                return <textarea className='textarea' value={eleVal} placeholder={placeholder} {...func} />;
            case 'code':
                return (
                    <InputCode
                        className='code'
                        height='280px'
                        width='100%'
                        mode={mode}
                        placeholder={placeholder}
                        value={eleVal}
                        {...func}
                    />
                );
            case 'switch':
                return <Switch checked={eleVal} {...func} />;
            case 'select':
                return (
                    <Select
                        className='attr-button'
                        showArrow
                        size='large'
                        placeholder='请选择'
                        defaultValue={eleVal || '请选择'}
                        onChange={this.onAttrChange.bind(this, belong, value)}
                    >
                        {selectList.map((item, idx) =>
                            typeof item === 'string' ? (
                                <Select.Option key={`item-${idx}`} value={item}>
                                    {item}
                                </Select.Option>
                            ) : (
                                <Select.Option key={`item-${idx}`} value={item.value}>
                                    {item.text}
                                </Select.Option>
                            ),
                        )}
                    </Select>
                );
            case 'image':
                return (
                    <div className='upload-image'>
                        <Input size='large' type='text' value={eleVal} className='input' {...func} />
                        <Upload
                            className='upload-btn'
                            url={imageUploadUrl}
                            data={{ pid }}
                            fileName='file'
                            onUploadSucc={this.onUploadSucc.bind(this)}
                            onUploadErr={this.onUploadErr.bind(this)}
                        >
                            <Button type='primary'>上传</Button>
                        </Upload>
                    </div>
                );
            case 'floor':
                return (
                    <FloorCtrl
                        apiList={apiList}
                        onListAdd={this.onListAdd.bind(this)}
                        onListDel={this.onListDel.bind(this)}
                        onListChange={this.onListChange.bind(this)}
                    />
                );
            default:
                return '';
        }
    }

    // 图片列表
    renderImageList() {
        const { pid } = this.props.editorInfo;
        const { activeEle } = this.state;
        const { imageList = [] } = activeEle.others || {};
        return (
            <div className='image-list'>
                {imageList.map((row, idx) => (
                    <div key={`item-${idx}`} className='image-item'>
                        <Input
                            className='image-input'
                            type='text'
                            size='large'
                            value={row}
                            onChange={this.onListChange.bind(this, 'imageList', idx)}
                        />
                        <Upload
                            className='upload-btn'
                            url={imageUploadUrl}
                            data={{ pid }}
                            fileName='file'
                            onUploadSucc={this.onListUploadSucc.bind(this, idx)}
                        >
                            <Button>上传</Button>
                        </Upload>
                        <Button type='danger' onClick={this.onListDel.bind(this, 'imageList', idx)}>
                            -
                        </Button>
                    </div>
                ))}
                <Button className='add' onClick={this.onListAdd.bind(this, 'imageList', '')}>
                    +
                </Button>
            </div>
        );
    }

    // api列表
    renderApi() {
        const { activeEle } = this.state;
        const { apiList = [], apiText, apiValue, url, fetchType } = activeEle.others || {};
        return (
            <div className='api-box'>
                <Row className='row attr-text'>接口请求</Row>
                <Row className='row'>
                    <Col className='attr-text' span={5}>
                        src:
                    </Col>
                    <Col span={19}>
                        <Input
                            className='attr-input'
                            size='large'
                            type='text'
                            value={url}
                            onChange={this.othersAttrChange.bind(this, 'url')}
                        />
                    </Col>
                </Row>
                <Row className='row'>
                    <Col className='attr-text' span={5}>
                        请求方法
                    </Col>
                    <Col span={19}>
                        <Select
                            className='attr-select'
                            showArrow
                            size='large'
                            placeholder='请选择'
                            defaultValue={fetchType || '请选择'}
                            onChange={this.onAttrChange.bind(this, 'others', 'fetchType')}
                        >
                            <Select.Option value='post'>post</Select.Option>
                            <Select.Option value='get'>get</Select.Option>
                        </Select>
                    </Col>
                </Row>
                <Row className='attr-text'>层级</Row>
                <FloorCtrl
                    apiList={apiList}
                    onListAdd={this.onListAdd.bind(this)}
                    onListDel={this.onListDel.bind(this)}
                    onListChange={this.onListChange.bind(this)}
                />
                <Row className='row'>
                    <Col className='attr-text' span={5}>
                        文字
                    </Col>
                    <Col span={19}>
                        <Input
                            type='text'
                            size='large'
                            value={apiText}
                            onChange={this.othersAttrChange.bind(this, 'apiText')}
                        />
                    </Col>
                </Row>
                <Row className='row'>
                    <Col className='attr-text' span={5}>
                        值
                    </Col>
                    <Col span={19}>
                        <Input
                            size='large'
                            type='text'
                            value={apiValue}
                            onChange={this.othersAttrChange.bind(this, 'apiValue')}
                        />
                    </Col>
                </Row>
            </div>
        );
    }

    // key,value列表
    renderKeyValList() {
        const { activeEle } = this.state;
        const { keyValList = [] } = activeEle.others || {};
        return (
            <div className='key-val-list'>
                <Row className='row attr-text'>列表渲染</Row>
                {keyValList.map((item, idx) => (
                    <Row key={`item-${idx}`} className='item' align='middle'>
                        <Col span={3} className='attr-text'>
                            key:
                        </Col>
                        <Col span={7}>
                            <Input
                                size='large'
                                type='text'
                                value={item.text}
                                onChange={this.onKeyValListChange.bind(this, idx, 'text')}
                            />
                        </Col>
                        <Col span={1}></Col>
                        <Col span={3} className='attr-text'>
                            value:
                        </Col>
                        <Col span={7}>
                            <Input
                                size='large'
                                type='text'
                                value={item.value}
                                onChange={this.onKeyValListChange.bind(this, idx, 'value')}
                            />
                        </Col>
                        <Col span={1}></Col>
                        <Col span={2}>
                            <Button type='danger' onClick={this.onListDel.bind(this, 'keyValList', idx)}>
                                -
                            </Button>
                        </Col>
                    </Row>
                ))}
                <Button className='add' onClick={this.onListAdd.bind(this, 'keyValList', {})}>
                    +
                </Button>
            </div>
        );
    }

    slide(e) {
        console.error(e);
    }

    // 更改全局样式
    changeGlobalCss(value) {
        this.setState({ globalCss: value });
        const $globalStyle = document.getElementById('global-style');
        let valueList = value.split('\n');
        valueList = valueList.map(val => (val.indexOf('{') > -1 ? `#context ${val}` : val));
        $globalStyle.innerText = valueList.join('');
    }

    blurGlobalCss() {
        this.onAttrChange('others', 'globalCss', this.state.globalCss);
    }

    async mapTest() {
        const {
            activeEle: {
                others: { mapDataType, mapData, url, fetchType, contentType, apiList, mapHtml, mapCss },
            },
            activeId,
        } = this.state;
        const $id = document.getElementById(activeId);
        let list = [];
        /*------ 获取数据 ------*/
        if (mapDataType === 'json') {
            list = mapData;
        } else {
            const config = {
                header: {
                    'Content-Type': contentType,
                    'Access-Control-Max-Age': '2592000',
                },
                params: {
                    proxyUrl: url,
                },
            };
            await axios[fetchType]('http://localhost:3001/api/proxy', config)
                .then(res => res.data)
                .then(res => {
                    list = [res, ...apiList].reduce((x, y) => x[y]);
                });
        }
        /*------ 渲染数据 -------*/
        let html = '';
        list.forEach(item => {
            const cacheHtml = mapHtml.replace(/\$\{item\.(.*)\}/g, $1 => {
                return item[$1.match(/\$\{item\.(.*)\}/, '$1')[1]];
            });
            html += cacheHtml;
        });
        $id.innerHTML = html;

        /*------ 设置css ------*/
        const $style = document.createElement('style');
        $style.setAttribute('id', activeId);
        let valueList = mapCss.split('\n');
        valueList = valueList.map(val => (val.indexOf('{') > -1 ? `#context ${val}` : val));
        $style.innerText = valueList.join('');
        document.getElementsByTagName('head')[0].appendChild($style);
    }

    render() {
        const { activeId, activeEle = {}, iconfontUrl, compData, globalCss, inMap } = this.state;
        const { dialogMap, iconList = [], iconfontUrl: defaultIconUrl } = this.props.editorInfo;
        const dialogStatus = dialogMap[activeId];
        const {
            data: { pageList = [], pageNo = 1, totalPage = 1 },
        } = compData;
        const { others, element: activeElement, js: { bindJs } = {} } = activeEle;
        const { mapDataType } = others;
        const attrListData = { mapDataType };

        return (
            <div className='attr-list'>
                <div className='attr-card'>
                    <div className='card-content'>
                        {activeElement !== 'Component' && (
                            <Row className='row'>
                                <Col className='attr-text' span={6}>
                                    id:
                                </Col>
                                <Col className='pid' span={18} onClick={this.copyActiveId.bind(this, activeId)}>
                                    {activeId} (点击复制)
                                </Col>
                            </Row>
                        )}
                        {/*------ 属性列表 ------*/}
                        {attrList(this, activeEle, attrListData).map((item, idx) =>
                            item.column ? (
                                <Fragment key={`col-${idx}`}>
                                    <Row className='row' align='middle' justify='space-between'>
                                        <Col className='attr-text' span={20}>
                                            {item.text}:
                                        </Col>
                                        {item.help && (
                                            <Col span={1}>
                                                <Help text={item.help} position='top,right' />
                                            </Col>
                                        )}
                                    </Row>
                                    <Row>{this.renderAttr(item)}</Row>
                                </Fragment>
                            ) : (
                                <Row key={`row-${idx}`} className='row' align='middle'>
                                    <Col className='attr-text' span={6}>
                                        {item.text}:
                                    </Col>
                                    <Col span={18}>{this.renderAttr(item)}</Col>
                                </Row>
                            ),
                        )}
                        {/*------ 方法绑定 ------*/}
                        <FuncBind model={activeElement} bindJs={bindJs} onChange={this.onBindFuncChange.bind(this)} />
                        {/*------ Root ------*/}
                        {activeElement === 'Root' && (
                            <Fragment>
                                <Row className='row attr-text'>全局css</Row>
                                <Row>
                                    <InputCode
                                        className='code'
                                        height='280px'
                                        width='100%'
                                        mode='css'
                                        value={globalCss}
                                        onChange={this.changeGlobalCss.bind(this)}
                                        onBlur={this.blurGlobalCss.bind(this)}
                                    />
                                </Row>
                            </Fragment>
                        )}
                        {activeElement === 'Text' && inMap && (
                            <Row className='row' align='middle'>
                                <Col className='attr-text' span={4}>
                                    key:
                                </Col>
                                <Col span={20}>
                                    <Input type='text' onChange={this.onAttrChange('others', 'mapKey')} />
                                </Col>
                            </Row>
                        )}
                        {/*------ Swiper ------*/}
                        {activeElement === 'Swiper' && (
                            <Fragment>
                                <Row className='row attr-text' align='middle'>
                                    图片列表
                                </Row>
                                {this.renderImageList()}
                            </Fragment>
                        )}
                        {/*------ Icon ------*/}
                        {activeElement === 'Icon' && (
                            <Fragment>
                                <Row className='row'>
                                    <Col span={20}>
                                        <Input
                                            className='attr-input'
                                            type='text'
                                            size='large'
                                            placeholder={defaultIconUrl}
                                            value={iconfontUrl}
                                            onChange={this.onIconChange.bind(this)}
                                        />
                                    </Col>
                                    <Col span={4}>
                                        <Button
                                            className='attr-button'
                                            type='primary'
                                            size='large'
                                            onClick={this.uploadIcon.bind(this)}
                                        >
                                            上传
                                        </Button>
                                    </Col>
                                </Row>
                                <div className='icon-box'>
                                    {iconList.map((icon, idx) => (
                                        <div
                                            key={`icon-${idx}`}
                                            className='icon-item'
                                            onClick={this.iconSelect.bind(this, icon)}
                                        >
                                            <i className={classNames('iconfont', icon)} />
                                        </div>
                                    ))}
                                </div>
                            </Fragment>
                        )}
                        {/*------ Select ------*/}
                        {activeElement === 'Select' && (
                            <Fragment>
                                {others.renderType === 'api' && this.renderApi()}
                                {others.renderType === 'keyValueList' && this.renderKeyValList()}
                            </Fragment>
                        )}
                        {/*------ dialog ------*/}
                        {activeElement === 'Dialog' && (
                            <Row className='row' align='middle'>
                                <Col className='attr-text' span={5}>
                                    展示
                                </Col>
                                <Col span={19}>
                                    <Switch
                                        defaultChecked={dialogStatus}
                                        onChange={this.dialogHandle.bind(this, activeId)}
                                    />
                                </Col>
                            </Row>
                        )}
                        {/*------ Component ------*/}
                        {activeElement === 'Component' && (
                            <div className='comp-list-box'>
                                <div className='comp-list-title'>
                                    <span className='attr-text'>组件列表</span>
                                    <div className='ctrl-box'>
                                        <Button type='default' onClick={this.toNewComponent.bind(this)}>
                                            新建
                                        </Button>
                                        <Button type='primary' onClick={this.compListGet.bind(this, 1)}>
                                            刷新
                                        </Button>
                                    </div>
                                </div>
                                <div className='comp-list'>
                                    {pageList.map((row, idx) => (
                                        <div
                                            key={`row-${idx}`}
                                            className='comp-item'
                                            title={row.desc}
                                            onClick={this.onCompChange.bind(this, row.pid, activeId)}
                                        >
                                            {row.title}
                                        </div>
                                    ))}
                                </div>
                                <div className='comp-btn-box'>
                                    <Button disabled={pageNo === 1} onClick={this.compListGet.bind(this, pageNo - 1)}>
                                        前一页
                                    </Button>
                                    <div className='comp-page-num'>{pageNo}</div>
                                    <Button
                                        disabled={pageNo >= totalPage}
                                        onClick={this.compListGet.bind(this, pageNo + 1)}
                                    >
                                        后一页
                                    </Button>
                                </div>
                            </div>
                        )}
                        {/*------ Map ------*/}
                        {activeElement === 'Map' && (
                            <Row className='row' align='middle'>
                                <Button
                                    className='attr-button'
                                    size='large'
                                    type='primary'
                                    onClick={this.mapTest.bind(this)}
                                >
                                    测试
                                </Button>
                            </Row>
                        )}
                        {/*------ 删除节点 ------*/}
                        {activeId !== 'root' && (
                            <div className='row' style={{ marginTop: 30 }}>
                                <Button type='danger' size='large' block onClick={this.removeEle.bind(this)}>
                                    删除节点
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(AttrList);
