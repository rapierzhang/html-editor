import React, { Component } from 'react';
import classNames from 'classnames';
import utils from '../../../common/utils';
import { connect } from 'react-redux';
import { attrList } from './attr-map';
import { Select, Switch, Upload } from '../../../component/common';
import { attributeUpdate, elementsUpdate } from '../actions';
import './attr-list.scss';

class AttrList extends Component {
    constructor() {
        super(...arguments);
    }

    // 属性更改 {...item.func}中调用 ^^^^^^
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

    // 添加空行
    onListAdd() {
        const { activeEle: thisNode, activeId, elements } = this.props.editorInfo;
        const newNode = {
            ...thisNode,
            imageList: [...(thisNode.imageList || []), ''],
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

    // key value 列表增加
    onKeyValListAdd() {

    }

    // 渲染attr
    renderAttr(item, activeEle) {
        const { type, value, inputType, list: selectList, keyValList = [], placeholder } = item;
        const { imageList = [] } = activeEle;
        const eleVal = activeEle[value];
        const onChange = {
            onChange: this.onAttrChange.bind(this, value),
        };
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
                        {/*^^^^^^*/}
                        <Upload
                            className='upload-btn'
                            url={'http://localhost:3000/api/file/upload'}
                            fileName='file'
                            onUploadSucc={this.onUploadSucc.bind(this)}
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
                                <input type='text' value={row} onChange={this.onListChange.bind(this, idx)} />
                                {/*^^^^^^*/}
                                <Upload
                                    className='upload-btn'
                                    url={'http://localhost:3000/api/file/upload'}
                                    data={{pid: this.props.editorInfo.pid}}
                                    fileName='file'
                                    onUploadSucc={this.onListUploadSucc.bind(this, idx)}
                                >
                                    <span>上传</span>
                                </Upload>
                            </div>
                        ))}
                        <div className='add' onClick={this.onListAdd.bind(this)}>
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
                                <input type='text' value={item.key} />
                                <span>value: </span>
                                <input type='text' value={item.value} />
                                <span className='delete'>-</span>
                            </div>
                        ))}
                        <div className='add' onClick={this.onKeyValListAdd.bind(this)}>+</div>
                    </div>
                );
            default:
                return '';
        }
    }

    render() {
        const { activeEle = {} } = this.props.editorInfo;

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
