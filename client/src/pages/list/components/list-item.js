import React, { Component } from 'react';
import { utils } from '../../../common';
import './list-item.scss';

class ListItem extends Component {
    constructor(props) {
        super(props);
    }

    jumpEditor(pid) {
        window.open(`/editor?pid=${pid}`)
    }

    render() {
        const {
            data: { pid, title, desc, preview, createTime, updateTime },
        } = this.props;

        return (
            <div className='list-item' onClick={this.jumpEditor.bind(this, pid)}>
                <div className='img-box'>
                    <img className='img' src={preview} />
                </div>
                <div className='title' title={title}>{title}</div>
                <div className='desc' title={desc}>{desc}</div>
                <div className='create-time'>
                    <p>创建时间：</p>
                    <p>{utils.dateFormat(createTime, 'yyyy-MM-dd hh:mm:ss')}</p>
                </div>
                <div className='update-time'>
                    <p>更改时间：</p>
                    <p>{utils.dateFormat(updateTime, 'yyyy-MM-dd hh:mm:s')}</p>
                </div>
            </div>
        );
    }
}

ListItem.defaultProps = {
    data: {},
};

export default ListItem;
