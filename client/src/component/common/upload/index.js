import React, { Component } from 'react';
import { uploadFile } from '../../../common';

/*
 * @params   className      str | obj   class
 * @params   url            string      地址
 * @params   fileName       string      上传的key
 * @params   data           object      上传的参数
 * @params   children       jsx         子元素
 * @params   onUploadSucc   func        上传成功回调
 * @params   onUploadErr    func        上传失败回调
 * */

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
                formData.append(fileName, item);
            });
            for (let k in data) {
                formData.append(k, data[k]);
            }
            uploadFile({ url, formData })
                .then(res => this.props.onUploadSucc(res.data))
                .catch(err => this.props.onUploadErr(err));
        }
    }

    render() {
        const { className } = this.props;
        return (
            <div className={className} onClick={this.chooseFile.bind(this)}>
                {this.props.children}
                <input
                    type='file'
                    ref='refFile'
                    multiple
                    style={{ display: 'none' }}
                    onChange={this.uploadFile.bind(this)}
                />
            </div>
        );
    }
}

Upload.defaultProps = {
    className: {},
    url: '',
    fileName: '',
    data: {},
    onUploadSucc: () => {},
    onUploadErr: () => {},
};

export default Upload;
