import React, { Component } from 'react';
import { listGet } from './actions';
import { ListItem } from './components';
import { utils } from '../../common';
import { Page } from '../../component/common';
import './list.scss';

const defaultPageSize = 6;

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            searchingText: '',

            listData: utils.defaultData,
        };
    }

    componentDidMount() {
        this.listGet();
    }

    // ^^^^^^
    listGet(pn = 1, ps = defaultPageSize, text) {
        utils.fetchLoading(this, 'listData');
        listGet({ pn, ps, text })
            .then(listData => utils.fetchSucc(this, 'listData', listData))
            .catch(() => utils.fetchErr(this, 'listData'));
    }

    // 新建页面
    newPage() {
        window.open('editor');
    }

    // 更改页码
    pageChange(index) {
        this.listGet(index, defaultPageSize, this.state.searchingText);
    }

    // 输入搜索内容
    searchChange(e) {
        this.setState({
            searchText: e.target.value,
        });
    }

    // 模糊查询
    search() {
        const { searchText } = this.state;
        this.setState({
            searchingText: searchText,
            searchText: '',
        });
        this.listGet(1, defaultPageSize, searchText);
    }

    // 监听回车
    enterPress(e) {
        if (e.which == 13 || e.keyCode == 13) {
            this.search();
        }
    }

    // 取消查询
    unSearch() {
        this.setState({ searchingText: '' });
        this.listGet(1);
    }

    render() {
        const { listData, searchText, searchingText } = this.state;
        const {
            fetchStatus,
            data: { pageList = [], totalPage, pageNo },
        } = listData;

        return (
            <div className='page-list'>
                {/*------ 头部 ------*/}
                <div className='header'>
                    <div className='title'>页面生成器</div>
                    <div className='right-box'>
                        <div className='search-box'>
                            <input
                                className='search-input'
                                type='text'
                                placeholder='请输入标题或简介的关键字'
                                value={searchText}
                                onChange={this.searchChange.bind(this)}
                                onKeyPress={this.enterPress.bind(this)}
                            />
                            <div className='search-btn' onClick={this.search.bind(this)}>
                                搜索
                            </div>
                        </div>
                        <div className='btn-box'>
                            <div className='button primary' onClick={this.newPage.bind(this)}>
                                新建
                            </div>
                        </div>
                    </div>
                </div>
                {/*------ 搜索条目 ------*/}
                {searchingText && (
                    <div className='search-tag-box'>
                        <span>搜索：</span>
                        <span className='tag'>
                            {searchingText}{' '}
                            <span className='close' onClick={this.unSearch.bind(this)}>
                                x
                            </span>
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
