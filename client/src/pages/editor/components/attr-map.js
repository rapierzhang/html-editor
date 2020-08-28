import React from 'react';

// 属性列表
export const attrList = (that, item, data) => {
    const attrMap = {
        Root: [
            {
                text: '全局js',
                type: 'code',
                mode: 'javascript',
                updateFunc: 'onBlur',
                belong: 'js',
                value: 'initJs',
                column: true,
            },
        ],

        View: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
            {
                text: '扩展方法',
                type: 'code',
                updateFunc: 'obBlur',
                mode: 'javascript',
                belong: 'js',
                value: 'extraJs',
                column: true,
            },
        ],
        ScrollView: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
        ],
        Swiper: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
        ],

        Link: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
            {
                text: '跳转链接',
                type: 'input',
                belong: 'attr',
                value: 'href',
                updateFunc: 'onChange',
            },
            {
                text: '跳转去向',
                type: 'select',
                selectList: [
                    { text: '本页面', value: '_self' },
                    { text: '新页面', value: '_blank' },
                ],
                belong: 'attr',
                value: 'target',
                updateFunc: 'onChange',
            },
        ],
        Text: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
            {
                text: '文字',
                type: 'code',
                mode: 'text',
                updateFunc: 'onChange',
                belong: 'others',
                value: 'text',
                column: true,
            },
        ],

        Form: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
            {
                text: '接口路径',
                type: 'input',
                inputType: 'text',
                belong: 'others',
                value: 'url',
                updateFunc: 'onChange',
            },
            {
                text: '请求类型',
                type: 'select',
                selectList: ['post', 'get'],
                belong: 'others',
                value: 'fetchType',
            },
            {
                text: '头部',
                type: 'select',
                selectList: ['application/json', 'application/x-www-form-urlencoded'],
                belong: 'others',
                value: 'contentType',
            },
            {
                text: '上传成功',
                type: 'code',
                mode: 'javascript',
                updateFunc: 'obBlur',
                column: true,
                placeholder: 'res是返回数据',
                belong: 'js',
                value: 'onSucc',
            },
            {
                text: '上传失败',
                type: 'code',
                mode: 'javascript',
                updateFunc: 'obBlur',
                column: true,
                placeholder: 'err是返回数据',
                belong: 'js',
                value: 'onErr',
            },
        ],
        Input: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
            {
                text: 'name',
                type: 'input',
                inputType: 'text',
                belong: 'attr',
                value: 'name',
                updateFunc: 'onChange',
            },
            {
                text: 'type',
                type: 'select',
                selectList: [
                    { text: '文字', value: 'text' },
                    { text: '数字', value: 'number' },
                    { text: '密码', value: 'password' },
                    { text: '电话', value: 'tel' },
                ],
                belong: 'attr',
                value: 'type',
            },
            {
                text: '占位符',
                type: 'input',
                inputType: 'text',
                belong: 'attr',
                value: 'placeholder',
                updateFunc: 'onChange',
            },
            {
                text: '最大长度',
                type: 'input',
                inputType: 'number',
                belong: 'attr',
                value: 'maxLength',
                updateFunc: 'onChange',
            },
        ],
        Textarea: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
            {
                text: 'name',
                type: 'input',
                inputType: 'text',
                belong: 'attr',
                value: 'name',
                updateFunc: 'onChange',
            },
            {
                text: '占位符',
                type: 'input',
                inputType: 'text',
                belong: 'attr',
                value: 'placeholder',
                updateFunc: 'onChange',
            },
            {
                text: '最大长度',
                type: 'input',
                inputType: 'number',
                belong: 'attr',
                value: 'maxLength',
                updateFunc: 'onChange',
            },
        ],
        Radio: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
            {
                text: 'name',
                type: 'input',
                inputType: 'text',
                belong: 'attr',
                value: 'name',
                updateFunc: 'onChange',
            },
            {
                text: 'label',
                type: 'input',
                inputType: 'text',
                belong: 'others',
                value: 'label',
                updateFunc: 'onChange',
            },
        ],
        Checkbox: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
            {
                text: 'name',
                type: 'input',
                inputType: 'text',
                belong: 'attr',
                value: 'name',
                updateFunc: 'onChange',
            },
            {
                text: 'label',
                type: 'input',
                inputType: 'text',
                belong: 'others',
                value: 'label',
                updateFunc: 'onChange',
            },
        ],
        Select: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
            {
                text: 'name',
                type: 'input',
                inputType: 'text',
                belong: 'attr',
                value: 'name',
                updateFunc: 'onChange',
            },
            {
                text: '渲染方式',
                type: 'select',
                selectList: [
                    { text: '接口', value: 'api' },
                    { text: '列表', value: 'keyValueList' },
                ],
                belong: 'others',
                value: 'renderType',
            },
        ],
        Upload: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
            {
                text: '上传路径',
                type: 'input',
                inputType: 'text',
                belong: 'attr',
                value: 'url',
                updateFunc: 'onChange',
            },
            {
                text: '上传字段名',
                type: 'input',
                inputType: 'text',
                belong: 'attr',
                value: 'fileName',
                updateFunc: 'onChange',
            },
            {
                text: 'name',
                type: 'input',
                inputType: 'text',
                belong: 'attr',
                value: 'name',
                updateFunc: 'onChange',
            },
            {
                text: '上传展示',
                type: 'switch',
                belong: 'others',
                value: 'showUpload',
            },
            {
                text: '数据层级',
                type: 'floor',
                belong: 'others',
                value: 'apiList',
                column: true,
            },
            {
                text: '上传成功',
                type: 'code',
                mode: 'javascript',
                updateFunc: 'obBlur',
                placeholder: 'res是返回数据',
                belong: 'js',
                value: 'onSucc',
                column: true,
            },
            {
                text: '上传失败',
                type: 'code',
                mode: 'javascript',
                updateFunc: 'obBlur',
                placeholder: 'err是返回数据',
                belong: 'js',
                value: 'onErr',
                column: true,
            },
        ],
        Submit: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
            {
                text: '按钮文案',
                type: 'input',
                belong: 'others',
                value: 'text',
                updateFunc: 'onChange',
            },
        ],

        Image: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
            {
                text: '路径',
                type: 'image',
                belong: 'attr',
                value: 'src',
            },
        ],
        Video: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
            {
                text: '路径',
                type: 'input',
                inputType: 'text',
                belong: 'attr',
                value: 'src',
                updateFunc: 'onChange',
            },
            {
                text: '封面图',
                type: 'input',
                inputType: 'text',
                belong: 'attr',
                value: 'poster',
                updateFunc: 'onChange',
            },
            {
                text: '控制条',
                type: 'switch',
                belong: 'attr',
                value: 'controls',
            },
            {
                text: '循环播放',
                type: 'switch',
                belong: 'attr',
                value: 'loop',
            },
            {
                text: '自动播放',
                type: 'switch',
                belong: 'attr',
                value: 'autoPlay',
            },
            {
                text: '静音',
                type: 'switch',
                belong: 'attr',
                value: 'muted',
            },
        ],
        Audio: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
            {
                text: '路径',
                type: 'input',
                inputType: 'text',
                belong: 'attr',
                value: 'src',
                updateFunc: 'onChange',
            },
            {
                text: '控制条',
                type: 'switch',
                belong: 'attr',
                value: 'controls',
            },
            {
                text: '循环播放',
                type: 'switch',
                belong: 'attr',
                value: 'loop',
            },
            {
                text: '自动播放',
                type: 'switch',
                belong: 'attr',
                value: 'autoPlay',
            },
            {
                text: '静音',
                type: 'switch',
                belong: 'attr',
                value: 'muted',
            },
        ],
        Dialog: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
        ],
        Html: [
            {
                text: '组件名',
                type: 'input',
                belong: 'others',
                value: 'componentName',
                updateFunc: 'onChange',
            },
            {
                text: '自定义html',
                type: 'code',
                mode: 'html',
                updateFunc: 'onChange',
                belong: 'others',
                value: 'customHtml',
                column: true,
            },
            {
                text: '自定义css',
                type: 'code',
                mode: 'css',
                updateFunc: 'onChange',
                belong: 'others',
                value: 'customCss',
                column: true,
            },
            {
                text: '自定义js',
                type: 'code',
                mode: 'javascript',
                updateFunc: 'onChange',
                belong: 'others',
                value: 'customJs',
                column: true,
            },
        ],
        Iframe: [
            {
                text: 'name',
                type: 'input',
                belong: 'attr',
                value: 'name',
                updateFunc: 'onChange',
            },
            {
                text: 'src',
                type: 'input',
                belong: 'attr',
                value: 'src',
                updateFunc: 'onChange',
            },
            {
                text: '滚动',
                type: 'select',
                selectList: [
                    { text: '允许', value: 'yes' },
                    { text: '不允许', value: 'no' },
                    { text: '自动', value: 'auto' },
                ],
                belong: 'attr',
                value: 'scrolling',
                updateFunc: 'onChange',
            },
            {
                text: '限制',
                type: 'select',
                selectList: [
                    { text: '允许所有', value: '' },
                    { text: '允许iframe内容被视为与包含文档有相同的来源', value: 'allow-same-origin' },
                    { text: '允许iframe内容从包含文档导航（加载）内容', value: 'allow-top-navigation' },
                    { text: '允许表单提交', value: 'allow-forms' },
                    { text: '允许脚本执行', value: 'allow-scripts' },
                ],
                belong: 'attr',
                value: 'sandBox',
                updateFunc: 'onChange',
            },
        ],
        Map: [
            {
                text: '数据获取',
                type: 'select',
                selectList: [
                    { text: 'json', value: 'json' },
                    { text: '接口', value: 'interface' },
                ],
                belong: 'others',
                value: 'mapDataType',
                updateFunc: 'onChange',
            },
            ...(data.mapDataType === 'json'
                ? [
                      {
                          text: '数据',
                          type: 'code',
                          mode: 'json',
                          updateFunc: 'onBlur',
                          belong: 'others',
                          value: 'mapData',
                          column: true,
                      },
                  ]
                : [
                    {
                        text: '接口路径',
                        type: 'input',
                        inputType: 'text',
                        belong: 'others',
                        value: 'url',
                        updateFunc: 'onChange',
                    },
                    {
                        text: '请求类型',
                        type: 'select',
                        selectList: ['post', 'get'],
                        belong: 'others',
                        value: 'fetchType',
                    },
                    {
                        text: '头部',
                        type: 'select',
                        selectList: ['application/json', 'application/x-www-form-urlencoded'],
                        belong: 'others',
                        value: 'contentType',
                    },
                    {
                        text: '数据层级',
                        type: 'floor',
                        belong: 'others',
                        value: 'apiList',
                        column: true,
                    },
                ]),
            {
                text: '模板html',
                placeholder: 'item为子元素的数据节点',
                type: 'code',
                mode: 'html',
                updateFunc: 'onBlur',
                belong: 'others',
                value: 'mapHtml',
                column: true,
                // TODO ^^^^^^ 说明页面
                help: (
                    <div>
                        item为子元素的数据节点,详情请
                        <a href='https://www.baidu.com' target='_blank'>
                            查看
                        </a>
                    </div>
                ),
            },
            {
                text: '模板css',
                type: 'code',
                mode: 'css',
                updateFunc: 'onBlur',
                belong: 'others',
                value: 'mapCss',
                column: true,
            },
            {
                text: '模板方法',
                type: 'code',
                mode: 'javascript',
                updateFunc: 'onBlur',
                belong: 'others',
                value: 'mapJs',
                column: true,
            },
        ],
    };
    return attrMap[item.element] || [];
};

// 可控制大小的元素
export const canResizeList = [
    'View',
    'ScrollView',
    'Swiper',
    'Form',
    'Input',
    'Textarea',
    'Select',
    'Upload',
    'Submit',
    'Audio',
    'Video',
    'Image',
    'Iframe',
    'Map',
];

// 可移动列表
export const canMoveList = ['absolute', 'fixed', 'relative'];

export const cssPositionList = [
    {
        title: '没有定位',
        value: 'static',
    },
    {
        title: '父元素继承',
        value: 'initial',
    },
    {
        title: '父元素绝对定位',
        value: 'absolute',
    },
    {
        title: '窗口绝对定位',
        value: 'fixed',
    },
    {
        title: '相对定位',
        value: 'relative',
    },
];
export const cssDirectionList = ['zIndex', 'top', 'right', 'bottom', 'left'];

/*------ flex 相关 ------*/
const cssFlexDirectionList = [
    {
        title: '→',
        value: 'row',
    },
    {
        title: '↓',
        value: 'column',
    },
    {
        title: '←',
        value: 'row-reverse',
    },
    {
        title: '↑',
        value: 'column-reverse',
    },
];
const cssJustifyContentList = [
    {
        title: '头部对齐',
        value: 'flex-start',
    },
    {
        title: '末尾对齐',
        value: 'flex-end',
    },
    {
        title: '居中对齐',
        value: 'center',
    },
    {
        title: '两边对齐',
        value: 'space-between',
    },
    {
        title: '平均分布',
        value: 'space-around',
    },
];
const cssAlignItemsList = [
    {
        title: '头部对齐',
        value: 'flex-start',
    },
    {
        title: '尾部对齐',
        value: 'flex-end',
    },
    {
        title: '居中对齐',
        value: 'center',
    },
    {
        title: '文字基线对齐',
        value: 'baseline',
    },
    {
        title: '占满高度',
        value: 'stretch',
    },
];
const cssWrapList = [
    {
        title: '不换行',
        value: 'nowrap',
    },
    {
        title: '换行',
        value: 'wrap',
    },
    {
        title: '反向换行',
        value: 'wrap-reverse',
    },
];
export const flexList = [
    {
        name: '排列方向',
        attr: 'flexDirection',
        defaultVal: '→',
        list: cssFlexDirectionList,
    },
    {
        name: '轴向对齐',
        attr: 'justifyContent',
        defaultVal: '头部对齐',
        list: cssJustifyContentList,
    },
    {
        name: '垂直对齐',
        attr: 'alignItems',
        defaultVal: '占满高度',
        list: cssAlignItemsList,
    },
    {
        name: '折行',
        attr: 'flexWrap',
        defaultVal: '不折行',
        list: cssWrapList,
    },
];

export const cssBgRepeatList = [
    {
        title: '重复',
        value: 'repeat',
    },
    {
        title: 'X轴重复',
        value: 'repeat-x',
    },
    {
        title: 'Y轴重复',
        value: 'repeat-y',
    },
    {
        title: '不重复',
        value: 'no-repeat',
    },
];
export const cssSizeList = [
    {
        title: '宽',
        value: 'width',
        placeholder: 'auto',
    },
    {
        title: '高',
        value: 'height',
        placeholder: 'auto',
    },
];
export const cssMarginList = [
    {
        title: '上',
        value: 'marginTop',
        placeholder: '0',
    },
    {
        title: '右',
        value: 'marginRight',
        placeholder: '0',
    },
    {
        title: '下',
        value: 'marginBottom',
        placeholder: '0',
    },
    {
        title: '左',
        value: 'marginLeft',
        placeholder: '0',
    },
];
export const cssPaddingList = [
    {
        title: '上',
        value: 'paddingTop',
        placeholder: '0',
    },
    {
        title: '右',
        value: 'paddingRight',
        placeholder: '0',
    },
    {
        title: '下',
        value: 'paddingBottom',
        placeholder: '0',
    },
    {
        title: '左',
        value: 'paddingLeft',
        placeholder: '0',
    },
];

export const cssBorderList = [
    {
        title: '总',
        attr: [
            {
                value: 'borderWidth',
                type: 'number',
                placeholder: '2',
            },
            {
                value: 'borderStyle',
                type: 'select',
                placeholder: 'none',
            },
            {
                value: 'borderColor',
                type: 'color',
                placeholder: '#xxxxxx',
            },
        ],
    },
    {
        title: '上',
        attr: [
            {
                value: 'borderTopWidth',
                type: 'number',
                placeholder: '2',
            },
            {
                value: 'borderTopStyle',
                type: 'select',
                placeholder: 'none',
            },
            {
                value: 'borderTopColor',
                type: 'color',
                placeholder: '#xxxxxx',
            },
        ],
    },
    {
        title: '下',
        attr: [
            {
                value: 'borderBottomWidth',
                type: 'number',
                placeholder: '2',
            },
            {
                value: 'borderBottomStyle',
                type: 'select',
                placeholder: 'none',
            },
            {
                value: 'borderBottomColor',
                type: 'color',
                placeholder: '#xxxxxx',
            },
        ],
    },
    {
        title: '左',
        attr: [
            {
                value: 'borderLeftWidth',
                type: 'number',
                placeholder: '2',
            },
            {
                value: 'borderLeftStyle',
                type: 'select',
                placeholder: 'none',
            },
            {
                value: 'borderLeftColor',
                type: 'color',
                placeholder: '#xxxxxx',
            },
        ],
    },
    {
        title: '右',
        attr: [
            {
                value: 'borderRightWidth',
                type: 'number',
                placeholder: '2',
            },
            {
                value: 'borderRightStyle',
                type: 'select',
                placeholder: 'none',
            },
            {
                value: 'borderRightColor',
                type: 'color',
                placeholder: '#xxxxxx',
            },
        ],
    },
];

export const cssBorderStyleList = [
    {
        title: '无',
        value: 'none',
    },
    {
        title: '实线',
        value: 'solid',
    },
    {
        title: '点线',
        value: 'dotted',
    },
    {
        title: '虚线',
        value: 'dashed',
    },
    {
        title: '双实线',
        value: 'double',
    },
];

export const fontSizeList = [
    'normal',
    'bold',
    'bolder',
    'lighter',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
];

export const fontFamilyList = [
    {
        name: '宋体',
        value: 'SimSun',
    },
    {
        name: '黑体',
        value: 'SimHei',
    },
    {
        name: '微软雅黑',
        value: 'Microsoft YaHei',
    },
    {
        name: '微软正黑体',
        value: 'Microsoft JhengHei',
    },
    {
        name: '新宋体',
        value: 'NSimSun',
    },
    {
        name: '新细明体',
        value: 'PMingLiU',
    },
    {
        name: '细明体',
        value: 'MingLiU',
    },
    {
        name: '标楷体',
        value: 'DFKai-SB',
    },
    {
        name: '仿宋',
        value: 'FangSong',
    },
    {
        name: '楷体',
        value: 'KaiTi',
    },
];
