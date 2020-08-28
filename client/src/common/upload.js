import axios from 'axios';
import CONFIG from '../config';

const uploadFile = opts => {
    let { url, formData } = opts;
    url = CONFIG.restDomain + url;
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };
    return new Promise((resolve, reject) => {
        axios
            .post(url, formData, config)
            .then(res => {
                const { data } = res;
                if (data.code === 200) {
                    resolve(data);
                } else {
                    reject(data);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
};

export default uploadFile;
