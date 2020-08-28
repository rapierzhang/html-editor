import React, { Component } from 'react';
import classNames from 'classnames';
import Router from './router';
import './backstage.scss';

const sideBarList = [
    {
        name: '脚本发布配置',
        page: '/backstage/script',
    },
    {
        name: '日志',
        page: '/backstage/log',
    }
];

class Backstage extends Component {
    constructor() {
        super(...arguments);
        this.state = {};
    }

    toPage(url) {
        location.assign(url);
    }

    render() {
        const {
            location: { pathname },
        } = this.props;

        return (
            <div className='backstage'>
                <div className='header'>
                    <div className='title'>后台</div>
                </div>
                <div>
                    <div className='side-bar'>
                        {sideBarList.map((row, idx) => (
                            <div
                                key={`row-${idx}`}
                                className={classNames('side-bar-item', { active: pathname === row.page })}
                                onClick={this.toPage.bind(this, row.page)}
                            >
                                {row.name}
                            </div>
                        ))}
                    </div>
                    <div className='content' id='content'>
                        <Router />
                    </div>
                </div>
            </div>
        );
    }
}

export default Backstage;
