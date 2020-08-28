import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import AceEditor from 'react-ace';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/ext-language_tools'; // 代码提示
import './input-code.scss';

const CDN = 'https://cdn.jsdelivr.net/npm/ace-builds@1.4.12/src-min-noconflict';
ace.config.set('basePath', CDN);
ace.config.set('modePath', CDN);
ace.config.set('themePath', CDN);
ace.config.set('workerPath', CDN);

const InputCode = props => {
    const { width, height, placeholder, value, defaultValue, mode, className, useWorker } = props;
    const [maximize, setMaximize] = useState(false);
    const [codeValue, setCodeValue] = useState('');

    useEffect(() => setCodeValue(value), [value])

    const sizeHandle = () => setMaximize(!maximize);

    const onFocus = e => props.onFocus(e);

    const onChange = val => {
        setCodeValue(val);
        props.onChange(val);
    };

    const onBlur = e => props.onBlur(codeValue, e);

    return (
        <div className={classNames('input-code', { maximize })}>
            <div className='size-handle' onClick={sizeHandle}>
                {maximize ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            </div>
            <AceEditor
                className={classNames('ace-editor', className)}
                name={className}
                theme='monokai'
                mode={mode}
                width={maximize ? '100%' : width}
                height={maximize ? '100%' : height}
                fontSize='18px'
                placeholder={placeholder}
                defaultValue={defaultValue}
                value={codeValue}
                onFocus={onFocus}
                onChange={onChange}
                onBlur={onBlur}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    showPrintMargin: false,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 4,
                    highlightActiveLine: true,
                    showGutter: maximize,
                    useWorker,
                }}
            />
        </div>
    );
};

InputCode.defaultProps = {
    width: '100%',
    height: '',
    value: '',
    placeholder: '',
    defaultValue: '',
    mode: '',
    useWorker: true,
    onFocus: () => {},
    onChange: () => {},
    onBlur: () => {},
};

export default InputCode;
