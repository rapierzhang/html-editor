import axios from 'axios';

const uploadFile = opts => {
    const { url, formData } = opts;
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };
    return new Promise((resolve, reject) => {
        axios
            .post(url, formData, config)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export default uploadFile;
