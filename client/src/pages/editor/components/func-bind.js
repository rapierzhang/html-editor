import React, { Component, Fragment } from 'react';
import { Select, Row, Col, Button } from 'antd';
import { InputCode } from '../../../component/common';
import { CloseOutlined } from '@ant-design/icons';
import { utils } from '../../../common';

const viewFuncList = [
    {
        text: 'onClick 点击',
        value: 'click',
    },
    {
        text: 'onTouch 触摸',
        value: 'touch',
    },
];

const inputFuncList = [
    {
        text: 'onFocus 获取焦点',
        value: 'focus',
    },
    {
        text: 'onBlur 失去焦点',
        value: 'blur',
    },
    {
        text: 'onChange 更改',
        value: 'change',
    },
    {
        text: 'onInput 输入',
        value: 'input',
    },
];

const funcListMap = {
    Input: inputFuncList,
    View: viewFuncList,
    default: [],
};

class FuncBind extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            funcMap: {},
        };
    }

    componentDidMount() {
        const { bindJs } = this.props;
        this.setState({ funcMap: bindJs });
    }

    // 方法名字更改
    onFuncNameChange(key, name) {
        const { funcMap } = this.state;
        if (funcMap.hasOwnProperty(name)) {
            utils.toast('已经绑定过该方法，请重新选择!');
            return;
        } else if (key) {
            funcMap[name] = funcMap[key];
            delete funcMap[key];
        } else {
            funcMap[name] = '';
        }
        this.setState({ funcMap });
        this.props.onChange(funcMap);
    }

    // 方法内容失焦
    onFuncBlur(name, funcText) {
        const { funcMap } = this.state;
        funcMap[name] = funcText;
        this.setState({ funcMap });
        this.props.onChange(funcMap);
    }

    // 删除绑定方法
    funcDel(key) {
        const { funcMap } = this.state;
        delete funcMap[key];
        this.setState({ funcMap });
        this.props.onChange(funcMap);
    }

    render() {
        const { model } = this.props;
        const { funcMap } = this.state;
        const funcList = Object.keys(funcMap);
        const listLen = funcList.length;
        const activeFuncMap = funcListMap[model] || funcListMap.default;

        const bindElement = (key, idx) => (
            <Fragment key={`item-${idx}`}>
                {/*------ 绑定方法 ------*/}
                <Row className='row attr-text'>绑定方法{idx + 1}：</Row>
                <Row>
                    <Col span={20}>
                        <Select
                            className='attr-select'
                            showArrow
                            size='large'
                            placeholder='请选择'
                            value={key || '请选择'}
                            onChange={this.onFuncNameChange.bind(this, key)}
                        >
                            {activeFuncMap.map((row, i) => (
                                <Select.Option key={`row-${i}`} value={row.value}>
                                    {row.text}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={1} />
                    <Col span={3}>
                        <Button
                            className='attr-button'
                            type='primary'
                            size='large'
                            danger
                            disabled={!key}
                            onClick={this.funcDel.bind(this, key)}
                        >
                            <CloseOutlined />
                        </Button>
                    </Col>
                </Row>
                {funcMap.hasOwnProperty(key) && (
                    <Fragment>
                        <Row className='row attr-text'>方法内容：</Row>
                        <Row>
                            <InputCode
                                key={`cose-${idx}`}
                                className='textarea'
                                height='280px'
                                width='100%'
                                mode='javascript'
                                value={funcMap[key]}
                                onBlur={this.onFuncBlur.bind(this, key)}
                            />
                        </Row>
                    </Fragment>
                )}
            </Fragment>
        );

        return (
            <Fragment>
                {funcList.map((key, idx) => bindElement(key, idx))}
                {listLen < activeFuncMap.length && bindElement('', listLen)}
            </Fragment>
        );
    }
}

FuncBind.defaultProps = {
    model: 'View',
    bindJs: {},
    onChange: () => {},
};

export default FuncBind;
