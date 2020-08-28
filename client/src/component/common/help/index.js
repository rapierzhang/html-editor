import React, { useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { utils } from '../../../common';
import './help.scss';

const Help = props => {
    const { text, position } = props;
    const pos = utils.has(position, ',') ? position.split(',') : ['top', 'right'];

    const [state, setState] = useState('none');

    const handleShow = () => {
        setState('show');
        document.onclick = hide;
    };

    // 隐藏
    const hide = () => {
        setState('hide');
        document.onclick = null;
        setTimeout(() => setState('none'), 450);
    };

    const stop = e => e.stopPropagation();

    return (
        <div className='help'>
            <div className={classNames('help-content', state, pos[0], pos[1])} onClick={stop}>
                <div className='help-text'>{text}</div>
                <div className={classNames('arrow-bottom', pos[0], pos[1])}>
                    <div className='inner'/>
                </div>
                <div className={classNames('arrow-top', pos[0], pos[1])}>
                    <div className='inner' />
                </div>
            </div>
            <QuestionCircleOutlined className='help-icon' onClick={handleShow} />
        </div>
    );
};

Help.defaultProps = {
    text: '',
    position: 'top,center',
};

export default Help;
