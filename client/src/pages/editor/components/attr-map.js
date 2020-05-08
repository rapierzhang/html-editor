// 输入类型
const inputTypeList = ['text', 'number', 'password', 'tel'];
// 请求类型
const fetchTypeList = ['post', 'get'];
// 请求头部
const fetchHeaderList = ['application/json', 'application/x-www-form-urlencoded']; // ^^^^^^

export const attrList = (that, item) => {
    const attrMap = {
        Swiper: [
            {
                text: '路径',
                element: 'imageList',
            },
        ],

        Link: [
            {
                text: '跳转链接',
                element: 'input',
                value: 'href',
                func: {
                    onChange: that.onAttrChange.bind(that, 'href'),
                },
            },
            {
                text: '跳转去向',
                element: 'select',
                list: ['_self', '_blank'],
                value: '_self',
                func: {
                    onChange: that.onAttrChange.bind(that, 'target'),
                },
            },
        ],
        Text: [
            {
                text: '文字',
                element: 'textarea',
                value: 'text',
                func: {
                    onChange: that.onAttrChange.bind(that, 'text'),
                },
            },
        ],

        Form: [
            {
                text: '接口路径',
                element: 'input',
                inputType: 'text',
                value: 'url',
                func: {
                    onChange: that.onAttrChange.bind(that, 'url'),
                },
            },
            {
                text: '请求类型',
                element: 'select',
                list: fetchTypeList,
                value: 'post',
                func: {
                    onChange: that.onAttrChange.bind(that, 'fetchType'),
                },
            },
            {
                text: '头部',
                element: 'select',
                list: fetchHeaderList,
                value: 'application/json',
                func: {
                    onChange: that.onAttrChange.bind(that, 'contentType'),
                },
            },
        ],
        Input: [
            {
                text: 'name',
                element: 'input',
                inputType: 'text',
                value: 'name',
                func: {
                    onChange: that.onAttrChange.bind(that, 'name'),
                },
            },
            {
                text: 'type',
                element: 'select',
                list: inputTypeList,
                value: 'type',
                func: {
                    onChange: that.onAttrChange.bind(that, 'type'),
                },
            },
            {
                text: 'placeholder',
                element: 'input',
                inputType: 'text',
                value: 'placeholder',
                func: {
                    onChange: that.onAttrChange.bind(that, 'placeholder'),
                },
            },
            {
                text: 'maxLength',
                element: 'input',
                inputType: 'number',
                value: 'maxLength',
                func: {
                    onChange: that.onAttrChange.bind(that, 'maxLength'),
                },
            },
        ],
        Textarea: [
            {
                text: 'name',
                element: 'input',
                inputType: 'text',
                value: 'name',
                func: {
                    onChange: that.onAttrChange.bind(that, 'name'),
                },
            },
            {
                text: 'placeholder',
                element: 'input',
                inputType: 'text',
                value: 'placeholder',
                func: {
                    onChange: that.onAttrChange.bind(that, 'placeholder'),
                },
            },
            {
                text: 'maxLength',
                element: 'input',
                inputType: 'number',
                value: 'maxLength',
                func: {
                    onChange: that.onAttrChange.bind(that, 'maxLength'),
                },
            },
        ],
        Checkbox: [
            {
                text: 'name',
                element: 'input',
                inputType: 'text',
                value: 'name',
                func: {
                    onChange: that.onAttrChange.bind(that, 'name'),
                },
            },
            {
                text: 'label',
                element: 'input',
                inputType: 'text',
                value: 'label',
                func: {
                    onChange: that.onAttrChange.bind(that, 'label'),
                },
            },
        ],
        Radio: [
            {
                text: 'name',
                element: 'input',
                inputType: 'text',
                value: 'name',
                func: {
                    onChange: that.onAttrChange.bind(that, 'name'),
                },
            },
            {
                text: 'label',
                element: 'input',
                inputType: 'text',
                value: 'label',
                func: {
                    onChange: that.onAttrChange.bind(that, 'label'),
                },
            },
        ],
        Upload: [
            {
                text: '上传路径',
                element: 'input',
                inputType: 'text',
                value: 'url',
                func: {
                    onChange: that.onAttrChange.bind(that, 'url'),
                },
            },
            {
                text: '上传字段名',
                element: 'input',
                inputType: 'text',
                value: 'fileName',
                func: {
                    onChange: that.onAttrChange.bind(that, 'fileName'),
                },
            },
            {
                text: 'name',
                element: 'input',
                inputType: 'text',
                value: 'name',
                func: {
                    onChange: that.onAttrChange.bind(that, 'name'),
                },
            },
            {
                text: 'onSucc',
                element: 'textarea',
                value: 'onSucc',
                func: {
                    onChange: that.onAttrChange.bind(that, 'onSucc'),
                },
            },
            {
                text: 'onErr',
                element: 'textarea',
                value: 'onErr',
                func: {
                    onChange: that.onAttrChange.bind(that, 'onErr'),
                },
            },
        ],
        Submit: [
            {
                text: '按钮文案',
                element: 'input',
                value: 'text',
                func: {
                    onChange: that.onAttrChange.bind(that, 'text'),
                },
            },
        ],

        Image: [
            {
                text: '路径',
                element: 'image',
                value: 'src',
                func: {
                    onChange: that.onAttrChange.bind(that, 'src'),
                },
            },
        ],
        Video: [
            {
                text: '路径',
                element: 'input',
                inputType: 'text',
                value: 'src',
                func: {
                    onChange: that.onAttrChange.bind(that, 'src'),
                },
            },
            {
                text: '封面图',
                element: 'input',
                inputType: 'text',
                value: 'poster',
                func: {
                    onChange: that.onAttrChange.bind(that, 'poster'),
                },
            },
            {
                text: '控制条',
                element: 'switch',
                value: 'controls',
                func: {
                    onChange: that.onAttrChange.bind(that, 'controls'),
                },
            },
            {
                text: '循环播放',
                element: 'switch',
                value: 'loop',
                func: {
                    onChange: that.onAttrChange.bind(that, 'loop'),
                },
            },
            {
                text: '自动播放',
                element: 'switch',
                value: 'autoPlay',
                func: {
                    onChange: that.onAttrChange.bind(that, 'autoPlay'),
                },
            },
            {
                text: '静音',
                element: 'switch',
                value: 'muted',
                func: {
                    onChange: that.onAttrChange.bind(that, 'muted'),
                },
            },
        ],
        Audio: [
            {
                text: '路径',
                element: 'input',
                inputType: 'text',
                value: 'src',
                func: {
                    onChange: that.onAttrChange.bind(that, 'src'),
                },
            },
            {
                text: '控制条',
                element: 'switch',
                value: 'controls',
                func: {
                    onChange: that.onAttrChange.bind(that, 'controls'),
                },
            },
            {
                text: '循环播放',
                element: 'switch',
                value: 'loop',
                func: {
                    onChange: that.onAttrChange.bind(that, 'loop'),
                },
            },
            {
                text: '自动播放',
                element: 'switch',
                value: 'autoPlay',
                func: {
                    onChange: that.onAttrChange.bind(that, 'autoPlay'),
                },
            },
            {
                text: '静音',
                element: 'switch',
                value: 'muted',
                func: {
                    onChange: that.onAttrChange.bind(that, 'muted'),
                },
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
                        element: 'input',
                        inputType: 'text',
                        value: 'name',
                        func: {
                            onChange: that.onAttrChange.bind(that, 'name'),
                        },
                    },
                ],
            },
        ],
    };
};
