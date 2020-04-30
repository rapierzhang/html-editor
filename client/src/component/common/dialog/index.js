import React, { Component } from 'react';
import './dialog.scss';

class Dialog extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            show: true,
        };
    }

    static getDerivedStateFromProps(props, state) {
        // console.error(props.editorInfo.activeEle)
        const { show } = props;
        return null;
    }

    close() {
        this.setState({ show: false });
        this.props.onClose();
    }

    render() {
        const { show } = this.state;
        const { title, children, renderFooter, hasClose } = this.props;
        console.error(renderFooter);
        return show ? (
            <div className='dialog'>
                <div className='title'>
                    {title}
                    {hasClose && (
                        <i className='icon close' onClick={this.close.bind(this)}>
                            x
                        </i>
                    )}
                </div>
                <div className='ctx'>{this.props.children}</div>
                {renderFooter && <div className='footer'>{renderFooter}</div>}
            </div>
        ) : null;
    }
}

Dialog.defaultProps = {
    title: '',
    children: null,
    renderFooter: null,
    hasClose: true,
    onClose: () => {},
};

export default Dialog;
