import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import utils from '../../../common/utils';
import { attrList } from './attr-map';
import { Select, Switch, Upload } from '../../../component/common';
import { attributeUpdate, elementsUpdate } from '../actions';
import CONFIG from '../../../config'
import './attr-list.scss';

class AttrList extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            activeId: '',
            activeEle: {},
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { activeId, activeEle } = props.editorInfo;
        if (activeId !== state.activeId) {
            return {
                activeId,
                activeEle,
            };
        }
        if (JSON.stringify(props.activeEle) !== JSON.stringify(state)) {
            return { activeEle };
        }
    }

    // 属性更改 {...item.func}中调用
    onAttrChange(attrName, e) {
        // 判断是event传入的值还是组件传入的值
        const value = !!e.target ? e.target.value : e;
        const { elements, activeId, activeEle: thisNode } = this.props.editorInfo;
        const newNode = {
            ...thisNode,
            [attrName]: value,
        };
        const newElements = utils.deepUpdate(elements, { [activeId]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        this.props.dispatch(attributeUpdate(newNode));
    }

    // 上传成功
    onUploadSucc(data) {
        const { url } = data;
        this.onAttrChange('src', url);
    }

    onUploadErr(err) {
        if (err.code === 3001){
            utils.toast('请先生成此页面再上传！')
        } else {
            utils.toast('服务端错误，请重试');
        }
    }

    // 添加空行
    onListAdd(type, defaultRow) {
        const { activeEle: thisNode, activeId, elements } = this.props.editorInfo;
        const newNode = {
            ...thisNode,
            [type]: [...(thisNode[type] || []), defaultRow],
        };
        const newElements = utils.deepUpdate(elements, { [activeId]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        this.props.dispatch(attributeUpdate(newNode));
    }

    // 删除行
    onListDel(type, idx) {
        const { activeEle: thisNode, activeId, elements } = this.props.editorInfo;
        let thisList = thisNode[type];
        thisList.splice(idx, 1);
        const newNode = {
            ...thisNode,
            [type]: thisList,
        };
        const newElements = utils.deepUpdate(elements, { [activeId]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        this.props.dispatch(attributeUpdate(newNode));
    }

    // 更改swiper列表
    onListChange(idx, e) {
        const value = !!e.target ? e.target.value : e;
        const { elements, activeId, activeEle: thisNode } = this.props.editorInfo;
        const { imageList } = thisNode;
        imageList[idx] = value;
        const newNode = {
            ...thisNode,
            imageList,
        };
        const newElements = utils.deepUpdate(elements, { [activeId]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        this.props.dispatch(attributeUpdate(newNode));
    }

    // swiper上传成功
    onListUploadSucc(idx, data) {
        this.onListChange(idx, data.url);
    }

    onKeyValListChange(idx, name, e) {
        const { value } = e.target;
        const { elements, activeId, activeEle: thisNode } = this.props.editorInfo;
        const { keyValList } = thisNode;
        keyValList[idx][name] = value;
        const newNode = {
            ...thisNode,
            keyValList,
        };
        const newElements = utils.deepUpdate(elements, { [activeId]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        this.props.dispatch(attributeUpdate(newNode));
    }

    // 渲染attr
    renderAttr(item, activeEle) {
        const { type, value, inputType, list: selectList, placeholder } = item;
        const { imageList = [], keyValList = [] } = activeEle;
        const eleVal = activeEle[value];
        const onChange = {
            onChange: this.onAttrChange.bind(this, value),
        };
        const { imageUploadUrl } = CONFIG;
        switch (type) {
            case 'input':
                return <input type={inputType} value={eleVal} placeholder={placeholder} {...onChange} />;
            case 'textarea':
                return <textarea value={eleVal} placeholder={placeholder} {...onChange} />;
            case 'switch':
                return <Switch value={eleVal} {...onChange} />;
            case 'select':
                return <Select list={selectList} value={eleVal} titleShow {...onChange} />;
            case 'image':
                return (
                    <div className='upload-image'>
                        <input type='text' value={eleVal} {...onChange} />
                        <Upload
                            className='upload-btn'
                            url={imageUploadUrl}
                            data={{ pid: this.props.editorInfo.pid }}
                            fileName='file'
                            onUploadSucc={this.onUploadSucc.bind(this)}
                            onUploadErr={this.onUploadErr.bind(this)}
                        >
                            <span>上传</span>
                        </Upload>
                    </div>
                );
            case 'imageList':
                return (
                    <div className='image-list'>
                        {imageList.map((row, idx) => (
                            <div key={`item-${idx}`} className='image-item'>
                                <input
                                    className='image-input'
                                    type='text'
                                    value={row}
                                    onChange={this.onListChange.bind(this, idx)}
                                />
                                <Upload
                                    className='upload-btn'
                                    url={imageUploadUrl}
                                    data={{ pid: this.props.editorInfo.pid }}
                                    fileName='file'
                                    onUploadSucc={this.onListUploadSucc.bind(this, idx)}
                                >
                                    <span>上传</span>
                                </Upload>
                                <span className='delete' onClick={this.onListDel.bind(this, 'imageList', idx)}>
                                    -
                                </span>
                            </div>
                        ))}
                        <div className='add' onClick={this.onListAdd.bind(this, 'imageList', '')}>
                            +
                        </div>
                    </div>
                );
            case 'keyValList':
                return (
                    <div className='key-val-list'>
                        {keyValList.map((item, idx) => (
                            <div key={`item-${idx}`} className='item'>
                                <span>key: </span>
                                <input
                                    type='text'
                                    value={item.text}
                                    onChange={this.onKeyValListChange.bind(this, idx, 'text')}
                                />
                                <span>value: </span>
                                <input
                                    type='text'
                                    value={item.value}
                                    onChange={this.onKeyValListChange.bind(this, idx, 'value')}
                                />
                                <span className='delete' onClick={this.onListDel.bind(this, 'keyValList', idx)}>
                                    -
                                </span>
                            </div>
                        ))}
                        <div className='add' onClick={this.onListAdd.bind(this, 'keyValList', {})}>
                            +
                        </div>
                    </div>
                );
            default:
                return '';
        }
    }

    render() {
        const { activeEle = {} } = this.state;

        return attrList(this, activeEle).map((item, idx) => (
            <div key={`row-${idx}`} className={classNames(item.column ? 'column' : 'row')}>
                <span className='title'>{item.text}</span>
                {this.renderAttr(item, activeEle)}
            </div>
        ));
    }
}

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(AttrList);
