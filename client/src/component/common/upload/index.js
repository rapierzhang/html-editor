import React, { Component } from 'react';
import { uploadFile } from '../../../common'

class Upload extends Component {
    constructor() {
        super(...arguments);
    }

    // 选择文件
    chooseFile() {
        const inputEle = this.refs.refFile;
        inputEle.click();
    }

    // 上传文件
    uploadFile(e) {
        const { url, fileName, data } = this.props;
        let { files: targetFiles, value } = e.target;
        if (value) {
            const formData = new FormData();
            [...targetFiles].map(item => {
                formData.append(fileName, item)
            })
            for (let k in data) {
                formData.append(k, data[k])
            }
            uploadFile({ url, formData })
        }
    }

    render() {
        return (
            <div onClick={this.chooseFile.bind(this)}>
                {this.props.children}
                <input type='file' ref='refFile' multiple style={{ display: 'none' }} onChange={this.uploadFile.bind(this)} />
            </div>
        );
    }
}

export default Upload;
