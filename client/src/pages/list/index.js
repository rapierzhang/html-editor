import React, { Component } from 'react';
import { listGet } from './actions';
import { utils } from '../../common';
import { Page } from '../../component/common';
import { ListItem } from './components';
import { Input } from 'antd';
import { BorderOutlined, FileAddOutlined, SettingOutlined, CloseOutlined } from '@ant-design/icons';
import './list.scss';

const defaultPageSize = 12;

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchingText: '',

            listData: utils.defaultData,
        };
    }

    componentDidMount() {
        this.listGet();
    }

    listGet(pn = 1, ps = defaultPageSize, text) {
        utils.fetchLoading(this, 'listData');
        listGet({ pn, ps, text })
            .then(listData => utils.fetchSucc(this, 'listData', listData))
            .catch(() => utils.fetchErr(this, 'listData'));
    }

    // 更改页码
    pageChange(index) {
        this.listGet(index, defaultPageSize, this.state.searchingText);
    }

    // 模糊查询
    onSearch(searchText) {
        this.setState({ searchingText: searchText });
        this.listGet(1, defaultPageSize, searchText);
    }

    // 取消查询
    unSearch() {
        this.setState({ searchingText: '' });
        this.listGet(1);
    }

    // 新建页面
    toNewPage() {
        window.open('editor');
    }

    toConfigPage() {
        window.open('backstage');
    }

    toComponentList() {
        window.open('component-list');
    }

    render() {
        const { listData, searchingText } = this.state;
        const {
            data: { pageList = [], totalPage, pageNo },
        } = listData;

        return (
            <div className='page-list'>
                {/*------ 头部 ------*/}
                <div className='header'>
                    <div className='title'>页面生成器</div>
                    <div className='right-box'>
                        <Input.Search
                            className='search'
                            placeholder=''
                            enterButton='搜索'
                            size='large'
                            onSearch={this.onSearch.bind(this)}
                        />
                        <div className='btn-box'>
                            <div className='button primary' onClick={this.toNewPage.bind(this)}>
                                <FileAddOutlined />
                                <span className='text'>新建</span>
                            </div>
                            <div className='button success' onClick={this.toComponentList.bind(this)}>
                                <BorderOutlined />
                                <span className='text'>组件</span>
                            </div>
                            <div className='button warrning' onClick={this.toConfigPage.bind(this)}>
                                <SettingOutlined />
                                <span className='text'>后台</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/*------ 搜索条目 ------*/}
                {searchingText && (
                    <div className='search-tag-box'>
                        <span className='text'>搜索：</span>
                        <span className='tag'>
                            {searchingText}
                            <CloseOutlined className='close' onClick={this.unSearch.bind(this)} />
                        </span>
                    </div>
                )}

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
