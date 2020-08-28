import React, { useState } from 'react';
import { utils } from '../../common';
import './search.scss';

export const Search = props => {
    const [searchText, setSearchText] = useState('');

    const searchChange = e => setSearchText(e.target.value);

    // 监听回车
    const enterPress = e => utils.enter(e).then(() => search());

    // 点击按钮
    const search = () => {
        props.onSearch(searchText);
        setSearchText('');
    };

    return (
        <div className='search-box'>
            <input
                className='search-input'
                type='text'
                placeholder='请输入标题或简介的关键字'
                value={searchText}
                onChange={searchChange}
                onKeyPress={enterPress}
            />
            <div className='search-btn' onClick={search}>
                搜索
            </div>
        </div>
    );
};

Search.defaultProps = {
    onSearch: () => {},
};
