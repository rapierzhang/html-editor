import React, { Component } from 'react';
import classNames from 'classnames';
import './select.css';

class Select extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            onSelect: false,
            activeVal: '',
        };
    }

    componentDidMount() {
        const { defaultVal } = this.props;
        if (defaultVal) {
            this.setState({
                activeVal: defaultVal,
            });
        }
    }

    render() {
        const { list } = this.props;
        const { onSelect, selectVal } = this.state;
        return (
            <div className='select'>
                {onSelect ? (
                    list.map((row, idx) => (
                        <div key={`opt-${idx}`} className='options'>
                            {row}
                        </div>
                    ))
                ) : selectVal ? (
                    <div>{selectVal}</div>
                ) : (
                    <div>请选择</div>
                )}
            </div>
        );
    }
}

Select.defaultProps = {
    list: [],
    defaultVal: '',
};

export default Select;
