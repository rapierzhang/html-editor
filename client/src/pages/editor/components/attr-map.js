const inputTypeList = ['text', 'number', 'password', 'tel'];

export const attrList = (that, item) => {
    const attrMap =  {
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
        Image: [
            {
                text: '路径',
                element: 'input',
                type: 'text',
                value: 'src',
                func: {
                    onBlur: that.onAttrChange.bind(that, 'src'),
                },
            },
        ],
        Video: [
            {
                text: '路径',
                element: 'input',
                type: 'text',
                value: 'src',
                func: {
                    onBlur: that.onAttrChange.bind(that, 'src'),
                },
            },
            {
                text: '封面图',
                element: 'input',
                type: 'text',
                value: 'poster',
                func: {
                    onBlur: that.onAttrChange.bind(that, 'poster'),
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
                type: 'text',
                value: 'src',
                func: {
                    onBlur: that.onAttrChange.bind(that, 'src'),
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
        Input: [
            {
                text: 'name',
                element: 'input',
                type: 'text',
                value: 'name',
                func: {
                    onBlur: that.onAttrChange.bind(that, 'name'),
                },
            },
            {
                text: 'type',
                element: 'select',
                list: inputTypeList,
                type: 'text',
                value: 'type',
                func: {
                    onChange: that.onAttrChange.bind(that, 'type'),
                },
            },
            {
                text: 'placeholder',
                element: 'input',
                type: 'text',
                value: 'placeholder',
                func: {
                    onBlur: that.onAttrChange.bind(that, 'placeholder'),
                },
            },
            {
                text: 'maxLength',
                element: 'input',
                type: 'number',
                value: 'maxLength',
                func: {
                    onBlur: that.onAttrChange.bind(that, 'maxLength'),
                },
            },
        ],
        Textarea: [
            {
                text: 'name',
                element: 'input',
                type: 'text',
                value: 'name',
                func: {
                    onBlur: that.onAttrChange.bind(that, 'name'),
                },
            },
            {
                text: 'placeholder',
                element: 'input',
                type: 'text',
                value: 'placeholder',
                func: {
                    onBlur: that.onAttrChange.bind(that, 'placeholder'),
                },
            },
            {
                text: 'maxLength',
                element: 'input',
                type: 'number',
                value: 'maxLength',
                func: {
                    onBlur: that.onAttrChange.bind(that, 'maxLength'),
                },
            },
        ],
    }
    return attrMap[item.element] || []
};

export const cssList = (that, item) => {
    const cssMap  ={
        View: [
            {
                title: '定位',
                rows: [
                    {
                        text: 'name',
                        element: 'input',
                        type: 'text',
                        value: 'name',
                        func: {
                            onBlur: that.onAttrChange.bind(that, 'name'),
                        },
                    },
                ]
            }
        ]
    }
}
