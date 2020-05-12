import React, { Component } from 'react';
import { listGet } from './actions';
import { ListItem } from './components';
import './list.scss';
import { utils } from '../../common';
import { Page } from '../../component/common';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: utils.defaultData,
        };
    }

    componentDidMount() {
        this.listGet();
    }

    listGet(pn = 1, ps = 5) {
        utils.fetchLoading(this, 'listData');
        listGet({ pn, ps })
            .then(listData => utils.fetchSucc(this, 'listData', listData))
            .catch(() => utils.fetchErr(this, 'listData'));
    }

    newHtml() {
        window.open('editor');
    }

    pageChange(index) {
        this.listGet(index);
    }

    render() {
        const { listData } = this.state;
        const {
            fetchStatus,
            data: { pageList = [], totalPage, pageNo },
        } = listData;

        return (
            <div className='page-list'>
                {/*------ 头部 ------*/}
                <div className='header'>
                    <div className='title'>页面生成器</div>
                    <div className='btn-box'>
                        <div className='button primary' onClick={this.newHtml.bind(this)}>
                            新建
                        </div>
                    </div>
                </div>
                {/*------ 内容 ------*/}
                <div className='content'>
                    {pageList.map((item, idx) => (
                        <ListItem key={`item-${idx}`} data={item} />
                    ))}
                </div>
                <div className='footer'>
                    <Page
                        className='classify-page'
                        pageCount={totalPage}
                        pageNo={pageNo}
                        onPageChange={this.pageChange.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

export default List;
