import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import classNames from 'classnames';
import { utils } from '../../../common';
import './input-color.scss';

/*
 * className     string      继承类名
 * value         string      色值
 * position      string      默认位置      top,right | top,left | bottom,right | bottom,left
 * size          string      大小         large | middle | small
 * onChange      func        色值更改
 * */

const InputColor = props => {
    const { className, value, position, size } = props;
    const [state, setState] = useState('none');
    const pos = utils.has(position, ',') ? position.split(',') : ['top', 'right'];

    // 展示选择器
    const pickerShow = () => {
        setState('show');
        document.onclick = hide;
    };

    // 选择颜色
    const onChange = e => props.onChange(e.hex);

    // 隐藏
    const hide = () => {
        setState('hide');
        document.onclick = null;
        setTimeout(() => setState('none'), 450);
    };

    // 阻止冒泡
    const stop = e => {
        e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation();
    };

    return (
        <div className={classNames('input-color-box', size, className)} onClick={pickerShow}>
            <div className='color-preview' style={{ background: value }} />
            <div
                className={classNames('color-box', state)}
                style={{
                    [pos[0]]: '-320px',
                    [pos[1]]: 0,
                }}
                onClick={stop}
            >
                <SketchPicker className={classNames('input-color', state)} color={value} onChange={onChange} />
            </div>
        </div>
    );
};

InputColor.defaultProps = {
    position: 'top,right',
    size: 'middle',
    className: '',
    value: '',
    onChange: () => {},
};

export default InputColor;
