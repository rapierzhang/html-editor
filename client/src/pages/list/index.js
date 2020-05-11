import React, { Component } from 'react';
import { listGet } from './actions';
import { ListItem } from './components';
import './list.scss';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
        };
    }

    componentDidMount() {
        this.listGet();
    }

    listGet(pn = 1, ps = 10) {
        listGet({ pn, ps }).then(list => {
            this.setState({ list });
        });
    }

    newHtml() {
        window.open('editor');
    }

    render() {
        const { list } = this.state;

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
                    {list.map((item, idx) => (
                        <ListItem key={`item-${idx}`} data={item} />
                    ))}
                </div>
            </div>
        );
    }
}

export default List;
