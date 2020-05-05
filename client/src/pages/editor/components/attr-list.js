import React, { Component } from 'react';
import utils from '../../../common/utils';
import { connect } from 'react-redux';
import { attrList } from './attr-map';
import { Select, Switch } from '../../../component/common';
import { attributeUpdate, elementsUpdate } from '../actions';

class AttrList extends Component {
    constructor() {
        super(...arguments);
    }

    // 属性更改
    onAttrChange(attrName, e) {
        // 判断是event传入的值还是组件传入的值
        const value = !!e.target ? e.target.value : e;
        const { elements, activeKey } = this.props.editorInfo;
        const thisNode = utils.deepSearch(elements, activeKey);
        const newNode = {
            ...thisNode,
            [attrName]: value,
        };
        const newElements = utils.deepUpdate(elements, { [activeKey]: newNode });
        this.props.dispatch(elementsUpdate(newElements));
        this.props.dispatch(attributeUpdate(newNode));
    }

    render() {
        const { activeEle = {} } = this.props.editorInfo;

        return attrList(this, activeEle).map((item, idx) => (
            <div key={`row-${idx}`} className='row'>
                <span>{item.text}</span>
                {item.element == 'input' && <input type={item.type} value={activeEle[item.value]} {...item.func} />}
                {item.element == 'textarea' && <textarea value={activeEle[item.value]} {...item.func} />}
                {item.element == 'switch' && <Switch value={activeEle[item.value]} {...item.func} />}
                {item.element == 'select' && <Select list={item.list} value={item.value || 'inherit'} {...item.func} />}
            </div>
        ));
    }
}

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(AttrList);
