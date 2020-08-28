import React from 'react';
import classNames from 'classnames';
import { utils } from '../../../common';
import './comp-item.scss';

export const CompItem = props => {
    const {
        data: { pid, title, desc, createTime, updateTime },
        row,
    } = props;

    const toDetail = pid => window.open(`editor?model=component&pid=${pid}`);

    return (
        <div className={classNames('comp-item', { row })} onClick={() => toDetail(pid)}>
            <div className='title ellipsis' title={title}>
                {title}
            </div>
            <div className='desc ellipsis' title={desc}>
                {desc}
            </div>
            <div className='time'>
                {typeof createTime === 'number' ? utils.dateFormat(createTime, 'yyyy-MM-dd hh:mm:ss') : createTime}
            </div>
            <div className='time'>
                {typeof createTime === 'number' ? utils.dateFormat(updateTime, 'yyyy-MM-dd hh:mm:ss') : updateTime}
            </div>
        </div>
    );
};

CompItem.defaultProps = {
    data: {
        title: '',
        desc: '',
        createTime: 0,
        updateTime: 0,
    },
};
