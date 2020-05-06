import React, { Component } from 'react';
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
        const { elements, activeKey, activeEle: thisNode } = this.props.editorInfo;
        const newNode = {
            ...thisNode,
            [attrName]: value,
        };
        const newElements = utils.deepUpdate(elements, { [activeKey]: newNode });
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
        const { activeEle: thisNode, activeKey, elements } = this.props.editorInfo;
        const newNode = {
            ...thisNode,
            list: [...(thisNode.list || []), ''],
        };
        const newElements = utils.deepUpdate(elements, { [activeKey]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        this.props.dispatch(attributeUpdate(newNode));
    }

    // 更改swiper列表
    onListChange(idx, e) {
        const value = !!e.target ? e.target.value : e;
        const { elements, activeKey, activeEle: thisNode } = this.props.editorInfo;
        const { list } = thisNode;
        list[idx] = value;
        const newNode = {
            ...thisNode,
            list,
        };
        const newElements = utils.deepUpdate(elements, { [activeKey]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        this.props.dispatch(attributeUpdate(newNode));
    }

    // swiper上传成功
    onListUploadSucc(idx, data) {
        this.onListChange(idx, data.url);
    }

    render() {
        const { pid, activeEle = {} } = this.props.editorInfo;
        const { list = [] } = activeEle;

        return attrList(this, activeEle).map((item, idx) => (
            <div key={`row-${idx}`} className='row'>
                <span>{item.text}</span>
                {item.element === 'input' && <input type={item.type} value={activeEle[item.value]} {...item.func} />}
                {item.element === 'textarea' && <textarea value={activeEle[item.value]} {...item.func} />}
                {item.element === 'switch' && <Switch value={activeEle[item.value]} {...item.func} />}
                {item.element === 'select' && (
                    <Select list={item.list} value={item.value || 'inherit'} {...item.func} />
                )}
                {item.element === 'image' && (
                    <div className='upload-image'>
                        <input type='text' value={activeEle[item.value]} {...item.func} />
                        {/*^^^^^^*/}
                        <Upload
                            className='upload-btn'
                            url={'http://localhost:3000/api/file/upload'}
                            fileName='file'
                            data={{ pid }}
                            onUploadSucc={this.onUploadSucc.bind(this)}
                        >
                            <span>上传</span>
                        </Upload>
                    </div>
                )}
                {item.element === 'imageList' && (
                    <div className='image-list'>
                        {list.map((row, idx) => (
                            <div key={`item-${idx}`} className='image-item'>
                                <input type='text' value={row} onChange={this.onListChange.bind(this, idx)} />
                                {/*^^^^^^*/}
                                <Upload
                                    className='upload-btn'
                                    url={'http://localhost:3000/api/file/upload'}
                                    fileName='file'
                                    data={{ pid }}
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
                )}
            </div>
        ));
    }
}

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(AttrList);
