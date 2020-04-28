import React, { Component } from 'react';
import './select.scss';

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
        const { list } = this.props;
        const { listOpen, activeVal } = this.state;
        return (
            <div className='select'>
                <div className='active-option' onClick={this.openList.bind(this)}>
                    {activeVal || '请选择'}
                </div>
                {listOpen && (
                    <div className='select-list'>
                        {list.map((row, idx) => (
                            <div
                                key={`opt-${idx}`}
                                className='select-option'
                                onClick={this.optionSelect.bind(this, row)}
                            >
                                {row}
                            </div>
                        ))}
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
