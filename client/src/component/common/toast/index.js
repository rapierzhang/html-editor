import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './toast.scss';

/**
 * 全局Toast
 * @param {string} msg    toast内容
 * @param {int} [timeout] 关闭延迟，选填，默认为3s
 */

class Toast extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            msg: '',
            show: false,
        };
        this.timer = null;
    }

    componentDidMount() {
        this.setState({ show: true });
        this.timer = setTimeout(() => {
            this.setState({ show: false });
            clearTimeout(this.timer);
        }, 3000);
    }

    render() {
        const { show } = this.state;
        const { msg } = this.props;
        return (
            <div className='toast-box' style={{ display: show ? 'block' : 'none' }}>
                {typeof msg === 'string' ? msg : msg.map((row, idx) => <div key={`row-${idx}`}>{row}</div>)}
            </div>
        );
    }
}

const createNotice = msg => ReactDOM.render(<Toast key={Math.random()} msg={msg} />, document.getElementById('toast'));

export default createNotice;
