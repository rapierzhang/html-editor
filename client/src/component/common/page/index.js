import React from 'react';
import classNames from 'classnames';
import './page.scss';

/*
 * pageCount              必传      int     总页数
 * pageNo                 必传      int     所在页码
 * onPageChange(index)    必传      int     页码更改
 * */

const Page = props => {
    const renderItem = (count, param, index) => {
        return Array.apply(null, { length: count }).map((i, j) => (
            <div
                className={classNames('page-item', { active: j + param === index })}
                key={j}
                onClick={() => changePage(j + param)}
            >
                {j + param}
            </div>
        ));
    };

    const renderMore = k => <div className='icon-page-more' key={k} />;

    const renderPage = (count, num) => {
        if (count <= 7) {
            return renderItem(count, 1, num);
        } else {
            if (num <= 5) {
                return [...renderItem(7, 1, num), renderMore(1)];
            } else if (num >= count - 2) {
                return [...renderItem(2, 1, num), renderMore(2), ...renderItem(5, count - 4, num)];
            } else {
                return [...renderItem(2, 1, num), renderMore(3), ...renderItem(5, num - 2, num), renderMore(4)];
            }
        }
    };

    const changePage = index => {
        props.onPageChange(index);
    };

    const prevPage = () => {
        const page = props.pageNo - 1;
        props.onPageChange(page);
    };

    const nextPage = () => {
        const page = props.pageNo + 1;
        props.onPageChange(page);
    };

    const { className, pageCount, pageNo } = props;

    return pageCount > 1 ? (
        <div className={classNames('page-box', className)}>
            {pageNo === 1 ? (
                <div className='page-btn disable'>上一页</div>
            ) : (
                <div className='page-btn' onClick={prevPage}>
                    上一页
                </div>
            )}
            {renderPage(pageCount, pageNo)}
            {pageNo === pageCount ? (
                <div className='page-btn disable'>下一页</div>
            ) : (
                <div className='page-btn' onClick={nextPage}>
                    下一页
                </div>
            )}
        </div>
    ) : (
        <div />
    );
};

Page.defaultProps = {
    className: '',
    pageCount: 0,
    pageNo: 0,
    onPageChange: () => {},
};

export default Page;
