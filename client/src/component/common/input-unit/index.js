import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Input, Select } from 'antd';
import { utils } from '../../../common';
import './input-unit.scss';

const unit = ['px', '%', 'em', 'rem', 'auto'];

const InputUnit = props => {
    let { value, size, placeholder, noUnit, className, style } = props;

    const [inputValue, setInputValue] = useState('');
    const [selectValue, setSelectValue] = useState(noUnit ? '' : 'px');

    useEffect(() => {
        if (typeof value !== 'string') value = String(value);
        const inputVal = parseFloat(value);
        const selectVal = utils.trimNumber(value);
        if (inputVal || inputVal === 0) setInputValue(inputVal);
        if (selectVal) setSelectValue(selectVal);
    }, [props.value]);

    const onInputChange = e => {
        const inputVal = e.target.value;
        setInputValue(inputVal);
        props.onChange(inputVal ? `${inputVal}${selectValue}` : '');
    };

    const onSelectChange = selectVal => {
        setSelectValue(selectVal);
        if (selectVal === 'auto') {
            props.onChange(selectVal);
        } else {
            props.onChange(`${inputValue}${selectVal}`);
        }
    };

    return (
        <div className={classNames('input-unit', className)} style={style}>
            {selectValue !== 'auto' && (
                <Input
                    className='unit-input'
                    type='number'
                    size={size}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={onInputChange}
                />
            )}
            {!noUnit && (
                <Select
                    className={classNames('unit-select', { fill: selectValue == 'auto' })}
                    size={size}
                    value={selectValue}
                    showArrow={false}
                    onChange={onSelectChange}
                >
                    {unit.map((row, idx) => (
                        <Select.Option key={`row-${idx}`} value={row}>
                            {row}
                        </Select.Option>
                    ))}
                </Select>
            )}
        </div>
    );
};

InputUnit.defaultProps = {
    className: '',
    style: {},
    value: '',
    placeholder: '',
    size: 'large',
    noUnit: false,
    onChange: () => {},
};

export default InputUnit;
