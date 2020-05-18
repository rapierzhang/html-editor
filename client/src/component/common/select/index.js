import React, { Component } from 'react';
import classNames from 'classnames';
import './select.scss';

/*
* @params   list                [string] || [{title: '', value: ''}]    传入的list
* @params   value               string                                  展示的value
* @params   onChange(value)     func                                    更改传递value
*
* */

class Select extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            listOpen: false,
            activeVal: '',
        };
    }

    componentDidMount() {
        // 默认值
        const { value } = this.props;
        if (value) {
            this.setState({ activeVal: value });
        }
    }

    // 打开选项栏
    openList() {
        const { listOpen } = this.state;
        this.setState({ listOpen: !listOpen });
    }

    // 选择属性
    optionSelect(val) {
        this.setState({
            activeVal: val,
            listOpen: false,
        });
        this.props.onChange(val);
    }

    render() {
        const { list, titleShow, className } = this.props;
        const { listOpen, activeVal } = this.state;

        return (
            <div className={classNames('select', className)}>
                <div className='active-option' onClick={this.openList.bind(this)}>
                    {activeVal || '请选择'}
                </div>
                {listOpen && (
                    <div className='select-list'>
                        {list.map((row, idx) => {
                            return typeof row === 'string' ? (
                                <div
                                    key={`opt-${idx}`}
                                    className='select-option'
                                    onClick={this.optionSelect.bind(this, row)}
                                >
                                    {row}
                                </div>
                            ) : (
                                <div
                                    key={`opt-${idx}`}
                                    className='select-option'
                                    title={row.title}
                                    onClick={this.optionSelect.bind(this, row.value)}
                                >
                                    {`${row.value} ${titleShow ? ` (${row.title})` : ''}`}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        );
    }
}

Select.defaultProps = {
    list: [],
    value: '',
    onChange: () => {},
};

export default Select;
