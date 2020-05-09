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
                func: {
                    onChange: that.onAttrChange.bind(that, 'href'),
                },
            },
            {
                text: '跳转去向',
                type: 'select',
                list: [
                    { title: '本页面', value: '_self' },
                    { title: '新页面', value: '_blank' },
                ],
                value: 'target',
                func: {
                    onChange: that.onAttrChange.bind(that, 'target'),
                },
            },
        ],
        Text: [
            {
                text: '文字',
                type: 'textarea',
                value: 'text',
                func: {
                    onChange: that.onAttrChange.bind(that, 'text'),
                },
            },
        ],

        Form: [
            {
                text: '接口路径',
                type: 'input',
                inputType: 'text',
                value: 'url',
                func: {
                    onChange: that.onAttrChange.bind(that, 'url'),
                },
            },
            {
                text: '请求类型',
                type: 'select',
                list: ['post', 'get'],
                value: 'fetchType',
                func: {
                    onChange: that.onAttrChange.bind(that, 'fetchType'),
                },
            },
            {
                text: '头部',
                type: 'select',
                list: ['application/json', 'application/x-www-form-urlencoded'],
                value: 'contentType',
                func: {
                    onChange: that.onAttrChange.bind(that, 'contentType'),
                },
            },
        ],
        Input: [
            {
                text: 'name',
                type: 'input',
                inputType: 'text',
                value: 'name',
                func: {
                    onChange: that.onAttrChange.bind(that, 'name'),
                },
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
                func: {
                    onChange: that.onAttrChange.bind(that, 'type'),
                },
            },
            {
                text: 'placeholder',
                type: 'input',
                inputType: 'text',
                value: 'placeholder',
                func: {
                    onChange: that.onAttrChange.bind(that, 'placeholder'),
                },
            },
            {
                text: 'maxLength',
                type: 'input',
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
                type: 'input',
                inputType: 'text',
                value: 'name',
                func: {
                    onChange: that.onAttrChange.bind(that, 'name'),
                },
            },
            {
                text: 'placeholder',
                type: 'input',
                inputType: 'text',
                value: 'placeholder',
                func: {
                    onChange: that.onAttrChange.bind(that, 'placeholder'),
                },
            },
            {
                text: 'maxLength',
                type: 'input',
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
                type: 'input',
                inputType: 'text',
                value: 'name',
                func: {
                    onChange: that.onAttrChange.bind(that, 'name'),
                },
            },
            {
                text: 'label',
                type: 'input',
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
                type: 'input',
                inputType: 'text',
                value: 'name',
                func: {
                    onChange: that.onAttrChange.bind(that, 'name'),
                },
            },
            {
                text: 'label',
                type: 'input',
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
                type: 'input',
                inputType: 'text',
                value: 'url',
                func: {
                    onChange: that.onAttrChange.bind(that, 'url'),
                },
            },
            {
                text: '上传字段名',
                type: 'input',
                inputType: 'text',
                value: 'fileName',
                func: {
                    onChange: that.onAttrChange.bind(that, 'fileName'),
                },
            },
            {
                text: 'name',
                type: 'input',
                inputType: 'text',
                value: 'name',
                func: {
                    onChange: that.onAttrChange.bind(that, 'name'),
                },
            },
            {
                text: 'onSucc',
                type: 'textarea',
                value: 'onSucc',
                func: {
                    onChange: that.onAttrChange.bind(that, 'onSucc'),
                },
            },
            {
                text: 'onErr',
                type: 'textarea',
                value: 'onErr',
                func: {
                    onChange: that.onAttrChange.bind(that, 'onErr'),
                },
            },
        ],
        Submit: [
            {
                text: '按钮文案',
                type: 'input',
                value: 'text',
                func: {
                    onChange: that.onAttrChange.bind(that, 'text'),
                },
            },
        ],

        Image: [
            {
                text: '路径',
                type: 'image',
                value: 'src',
                func: {
                    onChange: that.onAttrChange.bind(that, 'src'),
                },
            },
        ],
        Video: [
            {
                text: '路径',
                type: 'input',
                inputType: 'text',
                value: 'src',
                func: {
                    onChange: that.onAttrChange.bind(that, 'src'),
                },
            },
            {
                text: '封面图',
                type: 'input',
                inputType: 'text',
                value: 'poster',
                func: {
                    onChange: that.onAttrChange.bind(that, 'poster'),
                },
            },
            {
                text: '控制条',
                type: 'switch',
                value: 'controls',
                func: {
                    onChange: that.onAttrChange.bind(that, 'controls'),
                },
            },
            {
                text: '循环播放',
                type: 'switch',
                value: 'loop',
                func: {
                    onChange: that.onAttrChange.bind(that, 'loop'),
                },
            },
            {
                text: '自动播放',
                type: 'switch',
                value: 'autoPlay',
                func: {
                    onChange: that.onAttrChange.bind(that, 'autoPlay'),
                },
            },
            {
                text: '静音',
                type: 'switch',
                value: 'muted',
                func: {
                    onChange: that.onAttrChange.bind(that, 'muted'),
                },
            },
        ],
        Audio: [
            {
                text: '路径',
                type: 'input',
                inputType: 'text',
                value: 'src',
                func: {
                    onChange: that.onAttrChange.bind(that, 'src'),
                },
            },
            {
                text: '控制条',
                type: 'switch',
                value: 'controls',
                func: {
                    onChange: that.onAttrChange.bind(that, 'controls'),
                },
            },
            {
                text: '循环播放',
                type: 'switch',
                value: 'loop',
                func: {
                    onChange: that.onAttrChange.bind(that, 'loop'),
                },
            },
            {
                text: '自动播放',
                type: 'switch',
                value: 'autoPlay',
                func: {
                    onChange: that.onAttrChange.bind(that, 'autoPlay'),
                },
            },
            {
                text: '静音',
                type: 'switch',
                value: 'muted',
                func: {
                    onChange: that.onAttrChange.bind(that, 'muted'),
                },
            },
        ],
    };
    return attrMap[item.type] || [];
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
                        func: {
                            onChange: that.onAttrChange.bind(that, 'name'),
                        },
                    },
                ],
            },
        ],
    };
};
