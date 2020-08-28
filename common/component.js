const React = require('react');

const filterObj = (obj, arr) => {
    const result = {};
    for (let key in obj) {
        if (!arr.includes(key)) result[key] = obj[key];
    }
    return result;
};

const cssStrToObj = (text = '') => {
    if (!text) return {};
    text = text.replace(/  /g, ''); //TODO box-shadow有问题
    text = text.replace(/\n/g, '');
    text = text.match(/\{(.*)\}/, '$1');
    let obj = {};
    const arr = text[1].split(';');
    arr.forEach(item => {
        if (!item) return;
        let [k, v] = item.split(':');
        k = k.replace(/([^-])(?:-+([^-]))/g, ($0, $1, $2) => $1 + $2.toUpperCase());
        obj[k] = v;
    });
    return obj;
};

// type list. edit, build
const compMap = (type, obj = {}, key, children) => {
    const { id = '', element, attr = {}, css = {}, others = {} } = obj;
    const filterList = [
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft',
        'margin',
        'top',
        'left',
        'right',
        'bottom',
        'position',
        'extra',
    ];
    let extra = {};
    try {
        extra = cssStrToObj(css.extra);
    } catch (e) {}
    const style = type === 'edit' ? { ...filterObj(css, filterList), ...extra } : {}; // 编辑模式直接渲染css
    const { imageList = [], extClass = '', label = '', showUpload = false, customHtml = '' } = others;
    const { name = '' } = attr;
    const map = {
        Root: {
            component: 'Root',
            hide: true,
            nesting: true,
            jsx: (
                <div key={key} id='root' className={`ele root ${id}`} style={style}>
                    {children}
                </div>
            ),
        },

        Label1: {
            title: '视图容器',
            label: true,
        },
        View: {
            component: 'View',
            title: '容器 □',
            nesting: true,
            jsx: (
                <div key={key} {...attr} id={id} className={`ele view ${id}`} style={style}>
                    {children}
                </div>
            ),
        },
        ScrollView: {
            component: 'ScrollView',
            title: '滚动容器 □',
            nesting: true,
            jsx: (
                <div key={key} {...attr} id={id} className={`ele scroll-view ${id}`} style={style}>
                    {children}
                </div>
            ),
        },
        Swiper: {
            component: 'Swiper',
            title: '滑动框',
            jsx: (
                <div key={key} {...attr} id={id} className={`swiper swiper-container ${id}`} style={style}>
                    <div className='swiper-wrapper'>
                        {imageList.map((url, idx) => (
                            <div key={`item-${idx}`} className='swiper-slide'>
                                <img className='swiper-image' src={url} alt='' />
                            </div>
                        ))}
                    </div>
                    <div className='swiper-pagination'></div>
                </div>
            ),
        },

        Label2: {
            title: '基础内容',
            label: true,
        },
        Text: {
            component: 'Text',
            title: '文字',
            jsx: (
                <span key={key} {...attr} id={id} className={`ele text ${id}`} style={style}>
                    {others.text}
                </span>
            ),
        },
        Link: {
            component: 'Link',
            title: '链接 □',
            nesting: true,
            jsx: (
                <a key={key} {...(type === 'build' ? attr : {})} id={id} className={`ele link ${id}`} style={style}>
                    {children}
                </a>
            ),
        },
        Icon: {
            component: 'Icon',
            title: '图标',
            jsx: (
                <i
                    key={key}
                    {...attr}
                    id={id}
                    className={`ele icon ${id} ${extClass.split('-')[0]} ${extClass}`}
                    style={style}
                />
            ),
        },

        Label3: {
            title: '表单组件',
            label: true,
        },
        Form: {
            component: 'Form',
            title: '表单 □',
            nesting: true,
            jsx: (
                <div key={key} {...attr} id={id} className={`ele form ${id}`} style={style}>
                    {children}
                </div>
            ),
        },
        Input: {
            component: 'Input',
            title: '单行输入框',
            jsx: <input key={key} {...attr} id={id} className={`ele input ${id}`} style={style} />,
        },
        Textarea: {
            component: 'Textarea',
            title: '多行输入框',
            jsx: <textarea key={key} {...attr} id={id} className={`ele textarea ${id}`} style={style} />,
        },
        Checkbox: {
            component: 'Checkbox',
            title: '多项选择',
            jsx: (
                <span key={key} className={`ele checkbox ${id}`} style={style}>
                    <input id={id} type='checkbox' name={name} value={label} />
                    <span className='checkbox-label'>{label}</span>
                </span>
            ),
        },
        Radio: {
            component: 'Radio',
            title: '单项选择',
            jsx: (
                <span key={key} className={`ele radio ${id}`} style={style}>
                    <input id={id} type='radio' name={name} value={label} />
                    <span className='radio-label'>{label}</span>
                </span>
            ),
        },
        Select: {
            component: 'Select',
            title: '选择框',
            jsx: (
                <div key={key} id={id} className={`ele select ${id}`} style={style}>
                    <span id={`${id}-text`}>请选择</span>
                    <input id={`${id}-input`} type='text' name={attr.name} />
                </div>
            ),
        },
        Upload: {
            component: 'Upload',
            title: '上传 □',
            nesting: true,
            jsx: (
                <div
                    key={key}
                    id={id}
                    className={`element upload ${id}`}
                    style={style}
                    url={attr.url}
                    filename={attr.fileName}
                >
                    <div id={`${id}-box`}>{children}</div>
                    {showUpload && <img id={`${id}-img`} className='upload-img none' />}
                    <input id={`${id}-file`} type='file' />
                    <input id={`${id}-url`} type='text' name={attr.name} />
                </div>
            ),
        },
        Submit: {
            component: 'Submit',
            title: '提交 □',
            nesting: true,
            jsx: (
                <div key={key} {...attr} id={id} className={`ele submit ${id}`} style={style}>
                    {children}
                </div>
            ),
        },

        Label4: {
            title: '媒体组件',
            label: true,
        },
        Image: {
            component: 'Image',
            title: '图片',
            jsx: <img key={key} {...attr} id={id} className={`ele image ${id}`} style={style} />,
        },
        Audio: {
            component: 'Audio',
            title: '音频',
            jsx: <audio key={key} {...attr} id={id} className={`ele audio ${id}`} style={style} />,
        },
        Video: {
            component: 'Video',
            title: '视频',
            jsx: <video key={key} {...attr} id={id} className={`ele video ${id}`} style={style} />,
        },

        Label5: {
            title: '其他',
            label: true,
        },
        Dialog: {
            component: 'Dialog',
            title: '弹窗 □',
            nesting: true,
            jsx: (
                <div key={key} {...attr} id={id} className={`ele dialog ${id}`} style={style}>
                    {children}
                </div>
            ),
        },
        Component: {
            component: 'Component',
            title: '自定义组件',
            jsx: <React.Fragment key={key}>{children}</React.Fragment>,
        },
        Html: {
            component: 'Html',
            title: '代码嵌入',
            jsx: (
                <div
                    key={key}
                    {...attr}
                    id={id}
                    className={`ele html ${id}`}
                    dangerouslySetInnerHTML={{ __html: customHtml }}
                />
            ),
        },
        Iframe: {
            component: 'Iframe',
            title: '网页嵌入',
            jsx: <iframe key={key} {...attr} id={id} className={`ele iframe ${id}`} style={style} frameBorder={0} />,
        },
        Map: {
            component: 'Map',
            title: '组件遍历',
            jsx: (
                <div key={key} {...attr} id={id} className={`ele map ${id}`} style={style} />
            ),
        },
    };
    if (type === 'list') {
        return Object.values(map);
    } else if (type === 'build' || type === 'edit') {
        return map[element].jsx;
    } else {
        return map[element][type];
    }
};

exports.compMap = compMap;
