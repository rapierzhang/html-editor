import React, { useState, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons'
import './dialog.scss';
/*
* @params   show            bool        展示
* @params   title           string      标题
* @params   hasClose        bool        是否有关闭按钮
* @params   renderFooter    jsx         底部
* @params   children        jsx,string  子元素
* @params   onClose         func        关闭触发
* */

const Dialog = props =>{
    const { title, hasClose, renderFooter } = props;
    const [show, setShow] = useState(false);

    useEffect(() => setShow(props.show), [props.show])

    const close = () => {
        setShow(false);
        props.onClose();
    }

    return show ? (
        <div className='html-dialog'>
            {title && (
                <div className='title'>
                    {title}
                </div>
            )}
            {hasClose && (
                <i className='close' onClick={close}>
                    <CloseOutlined />
                </i>
            )}
            <div className='ctx'>{props.children}</div>
            {renderFooter}
        </div>
    ) : null;
}

Dialog.defaultProps = {
    title: '',
    children: null,
    renderFooter: null,
    hasClose: true,
    onClose: () => {},
};

export default Dialog;
