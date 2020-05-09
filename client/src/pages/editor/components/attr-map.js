export const attrList = (that, item) => {
    const attrMap = {
        Swiper: [
            {
                text: '图片地址',
                type: 'imageList',
            },
        ],

        Link: [
            {
                text: '跳转链接',
                type: 'input',
                value: 'href',
            },
            {
                text: '跳转去向',
                type: 'select',
                list: [
                    { title: '本页面', value: '_self' },
                    { title: '新页面', value: '_blank' },
                ],
                value: 'target',
            },
        ],
        Text: [
            {
                text: '文字',
                type: 'textarea',
                value: 'text',
            },
        ],

        Form: [
            {
                text: '接口路径',
                type: 'input',
                inputType: 'text',
                value: 'url',
            },
            {
                text: '请求类型',
                type: 'select',
                list: ['post', 'get'],
                value: 'fetchType',
            },
            {
                text: '头部',
                type: 'select',
                list: ['application/json', 'application/x-www-form-urlencoded'],
                value: 'contentType',
            },
        ],
        Input: [
            {
                text: 'name',
                type: 'input',
                inputType: 'text',
                value: 'name',
            },
            {
                text: 'type',
                type: 'select',
                list: [
                    { title: '文字', value: 'text' },
                    { title: '数字', value: 'number' },
                    { title: '密码', value: 'password' },
                    { title: '电话', value: 'tel' },
                ],
                value: 'type',
            },
            {
                text: 'placeholder',
                type: 'input',
                inputType: 'text',
                value: 'placeholder',
            },
            {
                text: 'maxLength',
                type: 'input',
                inputType: 'number',
                value: 'maxLength',
            },
        ],
        Textarea: [
            {
                text: 'name',
                type: 'input',
                inputType: 'text',
                value: 'name',
            },
            {
                text: 'placeholder',
                type: 'input',
                inputType: 'text',
                value: 'placeholder',
            },
            {
                text: 'maxLength',
                type: 'input',
                inputType: 'number',
                value: 'maxLength',
            },
        ],
        Checkbox: [
            {
                text: 'name',
                type: 'input',
                inputType: 'text',
                value: 'name',
            },
            {
                text: 'label',
                type: 'input',
                inputType: 'text',
                value: 'label',
            },
        ],
        Radio: [
            {
                text: 'name',
                type: 'input',
                inputType: 'text',
                value: 'name',
            },
            {
                text: 'label',
                type: 'input',
                inputType: 'text',
                value: 'label',
            },
        ],
        Upload: [
            {
                text: '上传路径',
                type: 'input',
                inputType: 'text',
                value: 'url',
            },
            {
                text: '上传字段名',
                type: 'input',
                inputType: 'text',
                value: 'fileName',
            },
            {
                text: 'name',
                type: 'input',
                inputType: 'text',
                value: 'name',
            },
            {
                text: 'onSucc',
                type: 'textarea',
                value: 'onSucc',
            },
            {
                text: 'onErr',
                type: 'textarea',
                value: 'onErr',
            },
        ],
        Submit: [
            {
                text: '按钮文案',
                type: 'input',
                value: 'text',
            },
        ],

        Image: [
            {
                text: '路径',
                type: 'image',
                value: 'src',
            },
        ],
        Video: [
            {
                text: '路径',
                type: 'input',
                inputType: 'text',
                value: 'src',
            },
            {
                text: '封面图',
                type: 'input',
                inputType: 'text',
                value: 'poster',
            },
            {
                text: '控制条',
                type: 'switch',
                value: 'controls',
            },
            {
                text: '循环播放',
                type: 'switch',
                value: 'loop',
            },
            {
                text: '自动播放',
                type: 'switch',
                value: 'autoPlay',
            },
            {
                text: '静音',
                type: 'switch',
                value: 'muted',
            },
        ],
        Audio: [
            {
                text: '路径',
                type: 'input',
                inputType: 'text',
                value: 'src',
            },
            {
                text: '控制条',
                type: 'switch',
                value: 'controls',
            },
            {
                text: '循环播放',
                type: 'switch',
                value: 'loop',
            },
            {
                text: '自动播放',
                type: 'switch',
                value: 'autoPlay',
            },
            {
                text: '静音',
                type: 'switch',
                value: 'muted',
            },
        ],
    };
    return attrMap[item.element] || [];
};

export const cssList = (that, item) => {
    const cssMap = {
        View: [
            {
                title: '定位',
                rows: [
                    {
                        text: 'name',
                        type: 'input',
                        inputType: 'text',
                        value: 'name',
                    },
                ],
            },
        ],
    };
};
