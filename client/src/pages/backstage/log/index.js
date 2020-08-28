import React, { Component } from 'react';
import { InputNumber } from 'antd';
import { InputColor } from '../../../component/common';
import CONFIG from '../../../config'
import './log.scss';

class Log extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            msgStr: '',
            fontSize: 14,
            lineHeight: 1.5,
            color: '#262626',
            background: '#fff',
        };
    }

    componentDidMount() {
        this.connWs();
        this.styleInit();
    }

    styleInit() {
        const fontSize = parseInt(localStorage.getItem('fontSize'));
        const lineHeight = parseFloat(localStorage.getItem('lineHeight'));
        const color = localStorage.getItem('color');
        const background = localStorage.getItem('background');
        this.setState({
            ...(fontSize && { fontSize }),
            ...(lineHeight && { lineHeight }),
            ...(color && { color }),
            ...(background && { background }),
        });
    }

    connWs() {
        const ws = new WebSocket(CONFIG.wsDomain);
        const $content = document.getElementById('content');
        const $logList = document.getElementById('log-list');

        //当WebSocket创建成功时，触发onopen事件
        ws.onopen = () => {
            // ws.send("hello"); //将消息发送到服务端 ^^^^^^
        };

        // 接收到消息
        ws.onmessage = msg => {
            const { msgStr } = this.state;
            this.setState({ msgStr: msgStr + msg.data });
            if ($logList.offsetHeight - ($content.scrollTop + $content.offsetHeight) < 50) {
                $content.scrollTop = $logList.offsetHeight;
            }
        };
    }

    onStyleChange(attr, value) {
        this.setState({ [attr]: value });
        localStorage.setItem(attr, value);
    }

    render() {
        const { msgStr, fontSize, lineHeight, color, background } = this.state;
        const list = msgStr.split('\n');
        return (
            <div className='log-view' id='log-view'>
                <div className='control-bar'>
                    <div className='bar-item'>
                        <span className='text'>字号：</span>
                        <InputNumber
                            min={12}
                            step={1}
                            value={fontSize}
                            onChange={this.onStyleChange.bind(this, 'fontSize')}
                        />
                    </div>
                    <div className='bar-item'>
                        <span className='text'>行高：</span>
                        <InputNumber
                            min={0}
                            step={0.1}
                            value={lineHeight}
                            onChange={this.onStyleChange.bind(this, 'lineHeight')}
                        />
                    </div>
                    <div className='bar-item'>
                        <span className='text'>字体颜色：</span>
                        <InputColor
                            className='color'
                            value={color}
                            position='bottom,center'
                            onChange={this.onStyleChange.bind(this, 'color')}
                        />
                    </div>
                    <div className='bar-item'>
                        <span className='text'>背景颜色：</span>
                        <InputColor
                            className='color'
                            value={background}
                            position='bottom,center'
                            onChange={this.onStyleChange.bind(this, 'background')}
                        />
                    </div>
                </div>
                <div className='log-list' id='log-list' style={{ background }}>
                    {list.map((row, idx) => (
                        <div key={`row-${idx}`} className='log-row' style={{ fontSize, lineHeight, color }}>
                            {row}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Log;
