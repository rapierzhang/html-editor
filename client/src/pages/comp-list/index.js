import React, { Component } from 'react';
import { Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { CompItem } from './components/comp-item';
import { compListGet } from '../../actions';
import { utils } from '../../common';
import { Page } from '../../component/common';
import './comp-list.scss';

const defaultPageSize = 10;

class CompList extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            searchingText: '',
            compList: utils.defaultData,
        };
    }

    componentDidMount() {
        this.compListGet(1, defaultPageSize);
    }

    compListGet(pn = 1, ps = defaultPageSize, text) {
        utils.fetchLoading(this, 'compList');
        compListGet({ pn, ps, text }).then(compList => {
            utils.fetchSucc(this, 'compList', compList);
        });
    }

    pageChange(index) {
        this.compListGet(index, defaultPageSize, this.state.searchingText);
    }

    // 模糊查询
    onSearch(searchText) {
        this.setState({ searchingText: searchText });
        this.compListGet(1, defaultPageSize, searchText);
    }

    newComponent() {
        window.open('/editor?model=component');
    }

    render() {
        const { compList } = this.state;
        const {
            data: { pageList = [], pageNo = 1, totalPage = 1 },
        } = compList;

        return (
            <div className='component-list'>
                <div className='header'>
                    <div className='title'>自定义组件列表</div>
                    <div className='btn-box'>
                        <Input.Search
                            className='search'
                            placeholder=''
                            enterButton='搜索'
                            size='large'
                            onSearch={this.onSearch.bind(this)}
                        />
                        <Button className='new' size='large' type='primary' onClick={this.newComponent.bind(this)}>
                            <PlusOutlined />
                            新建
                        </Button>
                    </div>
                </div>
                <div className='content'>
                    <CompItem data={{ title: '标题', desc: '简介', createTime: '创建时间', updateTime: '更新时间' }} />
                    {pageList.map((row, idx) => (
                        <CompItem key={`row-${idx}`} data={row} row />
                    ))}
                </div>
                <div className='footer'>
                    <Page
                        className='list-page'
                        pageCount={totalPage}
                        pageNo={pageNo}
                        onPageChange={this.pageChange.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

export default CompList;
