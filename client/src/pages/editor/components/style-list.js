import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Select, Switch, Input, Row, Col, Slider } from 'antd';
import { utils } from '../../../common';
import { Upload, InputColor, InputUnit, InputCode } from '../../../component/common';
import { DownOutlined, LeftOutlined } from '@ant-design/icons';
import { attributeUpdate, htmlTreeUpdate } from '../actions';
import {
    cssBgRepeatList,
    cssBorderList,
    cssBorderStyleList,
    cssDirectionList,
    cssMarginList,
    cssPaddingList,
    cssPositionList,
    cssSizeList,
    flexList,
    fontSizeList,
    fontFamilyList,
} from './attr-map';
import './style-list.scss';

class StyleList extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            activeId: '',
            activeEle: {},

            sizeOpen: true,
            pisitionOpen: true,
            flexOpen: true,
            backgroundOpen: true,
            textOpen: true,
            marginOpen: true,
            paddingOpen: true,
            borderOpen: true,
            othersOpen: true,
            extraOpen: true,
        };
    }

    componentDidMount() {
        const sizeOpen = localStorage.getItem('sizeOpen') != 'false';
        const pisitionOpen = localStorage.getItem('sizeOpen') != 'false';
        const flexOpen = localStorage.getItem('flexOpen') != 'false';
        const backgroundOpen = localStorage.getItem('backgroundOpen') != 'false';
        const textOpen = localStorage.getItem('textOpen') != 'false';
        const marginOpen = localStorage.getItem('marginOpen') != 'false';
        const paddingOpen = localStorage.getItem('paddingOpen') != 'false';
        const borderOpen = localStorage.getItem('borderOpen') != 'false';
        const othersOpen = localStorage.getItem('othersOpen') != 'false';
        const extraOpen = localStorage.getItem('extraOpen') != 'false';

        this.setState({
            sizeOpen,
            pisitionOpen,
            flexOpen,
            backgroundOpen,
            textOpen,
            marginOpen,
            paddingOpen,
            borderOpen,
            othersOpen,
            extraOpen,
        });
    }

    static getDerivedStateFromProps(props, state) {
        const { activeId, activeEle } = props.editorInfo;
        if (activeId != state.activeId) {
            return {
                activeId,
                activeEle,
            };
        }

        // 更新属性
        if (JSON.stringify(activeEle) != JSON.stringify(state.activeEle)) {
            // backgroundImage需要特殊处理url()
            const { css = {} } = activeEle;
            const { css: stateCss = {} } = state.activeEle;
            if (css.backgroundImage && css.backgroundImage != stateCss.backgroundImage) return null;

            return {
                activeId,
                activeEle,
            };
        }

        return null;
    }

    // 样式更改
    onStyleChange(attrName, e) {
        // if (e !== null) return; TODO 检查是否有错误
        let value = typeof e == 'object' ? e.target.value : e;
        const { htmlTree, activeId } = this.props.editorInfo;
        const thisNode = utils.deepSearch(htmlTree, activeId);
        if (!thisNode.css) thisNode.css = {};
        if (value) {
            thisNode.css[attrName] = value;
        } else {
            delete thisNode.css[attrName];
        }
        const newHtmlTree = utils.deepUpdate(htmlTree, { [activeId]: thisNode });
        this.props.dispatch(htmlTreeUpdate(newHtmlTree));
        this.props.dispatch(attributeUpdate(thisNode));
    }

    // 切换flex
    onFlexSwitch(status) {
        if (status) {
            this.onStyleChange('display', 'flex');
        } else {
            this.onStyleChange('display', 'block');
        }
    }

    // 背景相关
    bgImageFocus() {
        const { activeEle } = this.state;
        const {
            css: { backgroundImage = '' },
        } = activeEle;
        const bgImageMatch = backgroundImage.match(/url\((.*)\)/, '$1');
        if (bgImageMatch) {
            activeEle.css.backgroundImage = bgImageMatch[1];
            this.setState({ activeEle });
        }
    }

    bgImageChange(e) {
        const { activeEle } = this.state;
        activeEle.css.backgroundImage = e.target.value;
        this.setState({ activeEle });
    }

    bgImageBlur(e) {
        const urlRegExp = new RegExp('^url(.*)$');
        const { value } = e.target;
        const backgroundImage = e.target.value ? (!urlRegExp.test(value) ? `url(${value})` : value) : '';
        const { activeEle } = this.state;
        activeEle.css.backgroundImage = backgroundImage;
        this.setState({ activeEle });
        this.onStyleChange('backgroundImage', backgroundImage);
    }

    onBgUploadSucc(data) {
        const { url } = data;
        this.onStyleChange('backgroundImage', `url(${url})`);
    }

    onBgUploadErr() {
        utils.toast('上传失败');
    }

    // 切换手风琴
    switchStatus(status) {
        const nextStatus = !this.state[status];
        this.setState({
            [status]: nextStatus,
        });
        localStorage.setItem(status, String(nextStatus));
    }

    render() {
        const {
            activeId,
            activeEle: { css = {}, element: activeEleName },
            sizeOpen,
            pisitionOpen,
            flexOpen,
            backgroundOpen,
            textOpen,
            marginOpen,
            paddingOpen,
            borderOpen,
            othersOpen,
            extraOpen,
        } = this.state;
        const { pid } = this.props.editorInfo;

        return (
            <div className='style-box'>
                {/*------ 宽高 ------*/}
                {!utils.has(['Link', 'Text', 'Radio', 'Checkbox'], activeEleName) && (
                    <div className='style-card'>
                        <Row
                            className='style-title'
                            align='middle'
                            justify='space-between'
                            onClick={this.switchStatus.bind(this, 'sizeOpen')}
                        >
                            <Col className='style-text'>宽高</Col>
                            <Col>{sizeOpen ? <DownOutlined /> : <LeftOutlined />}</Col>
                        </Row>
                        {sizeOpen && (
                            <Fragment>
                                {cssSizeList.map((row, idx) => (
                                    <Row key={`row-${idx}`} className='row' align='middle'>
                                        <Col span={6} className='style-text'>
                                            {row.title}:
                                        </Col>
                                        <Col span={18}>
                                            <InputUnit
                                                className='style-input'
                                                size='large'
                                                value={css[row.value]}
                                                placeholder={row.placeholder}
                                                onChange={this.onStyleChange.bind(this, row.value)}
                                            />
                                        </Col>
                                    </Row>
                                ))}
                            </Fragment>
                        )}
                    </div>
                )}
                {/*------ 定位 ------*/}
                {!utils.has(['Root', 'Dialog'], activeEleName) && (
                    <div className='style-card'>
                        <Row
                            className='style-title'
                            align='middle'
                            justify='space-between'
                            onClick={this.switchStatus.bind(this, 'pisitionOpen')}
                        >
                            <Col className='style-text'>定位</Col>
                            <Col>{pisitionOpen ? <DownOutlined /> : <LeftOutlined />}</Col>
                        </Row>
                        {pisitionOpen && (
                            <Fragment>
                                <Row className='row' align='middle'>
                                    <Col span={6} className='style-text'>
                                        定位:
                                    </Col>
                                    <Col span={18}>
                                        <Select
                                            className='style-select'
                                            showArrow
                                            size='large'
                                            placeholder='请选择'
                                            defaultValue={css.position || 'static'}
                                            onChange={this.onStyleChange.bind(this, 'position')}
                                        >
                                            {cssPositionList.map((item, idx) => (
                                                <Select.Option key={`item-${idx}`} value={item.value}>
                                                    {item.title}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Col>
                                </Row>
                                {utils.has(['absolute', 'fixed', 'relative'], css.position) && (
                                    <Fragment>
                                        {cssDirectionList.map((row, idx) => (
                                            <Row key={`row-${idx}`} className='row' align='middle'>
                                                <Col span={6} className='style-text'>
                                                    {row}:
                                                </Col>
                                                <Col span={18}>
                                                    <InputUnit
                                                        className='style-input'
                                                        size='large'
                                                        noUnit={row === 'zIndex'}
                                                        value={css[row]}
                                                        onChange={this.onStyleChange.bind(this, row)}
                                                    />
                                                </Col>
                                            </Row>
                                        ))}
                                    </Fragment>
                                )}
                            </Fragment>
                        )}
                    </div>
                )}
                {/*------ 排列 ------*/}
                {utils.has(['Root', 'Component', 'View', 'ScrollView', 'Form', 'Upload'], activeEleName) && (
                    <div className='style-card'>
                        <Row
                            className='style-title'
                            align='middle'
                            justify='space-between'
                            onClick={this.switchStatus.bind(this, 'flexOpen')}
                        >
                            <Col className='style-text'>内部排列方式</Col>
                            <Col>{flexOpen ? <DownOutlined /> : <LeftOutlined />}</Col>
                        </Row>
                        {flexOpen && (
                            <Fragment>
                                <Row className='row' align='middle'>
                                    <Col span={6} className='style-text'>
                                        启用:
                                    </Col>
                                    <Col span={18}>
                                        <Switch
                                            onChange={this.onFlexSwitch.bind(this)}
                                            checked={css.display == 'flex'}
                                        />
                                    </Col>
                                </Row>
                                {css.display == 'flex' &&
                                    flexList.map((row, idx) => (
                                        <Row key={`row-${idx}`} className='row' align='middle'>
                                            <Col span={6} className='style-text'>
                                                {row.name}:
                                            </Col>
                                            <Col span={18}>
                                                <Select
                                                    className='style-select'
                                                    showArrow
                                                    size='large'
                                                    placeholder='请选择'
                                                    defaultValue={css[row.attr] || row.defaultVal}
                                                    onChange={this.onStyleChange.bind(this, row.attr)}
                                                >
                                                    {row.list.map((item, i) => (
                                                        <Select.Option key={`row-${i}`} value={item.value}>
                                                            {item.title}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Col>
                                        </Row>
                                    ))}
                            </Fragment>
                        )}
                    </div>
                )}
                {/*------ 背景 ------*/}
                {utils.has(['Root', 'View', 'ScrollView', 'Form', 'Upload', 'Submit'], activeEleName) && (
                    <div className='style-card'>
                        <Row
                            className='style-title'
                            align='middle'
                            justify='space-between'
                            onClick={this.switchStatus.bind(this, 'backgroundOpen')}
                        >
                            <Col className='style-text'>背景</Col>
                            <Col>{backgroundOpen ? <DownOutlined /> : <LeftOutlined />}</Col>
                        </Row>
                        {backgroundOpen && (
                            <Fragment>
                                <Row className='row' align='middle'>
                                    <Col span={6} className='style-text'>
                                        背景颜色:
                                    </Col>
                                    <Col span={18}>
                                        <InputColor
                                            className='style-input'
                                            value={css.backgroundColor}
                                            onChange={this.onStyleChange.bind(this, 'backgroundColor')}
                                        />
                                    </Col>
                                </Row>
                                <Row className='row' align='middle'>
                                    <Col span={6} className='style-text'>
                                        背景图:
                                    </Col>
                                    <Col span={18} className='upload-image'>
                                        <Input
                                            className='bac-input'
                                            type='style-text'
                                            placeholder='url(*****)'
                                            value={css.backgroundImage}
                                            onFocus={this.bgImageFocus.bind(this)}
                                            onChange={this.bgImageChange.bind(this)}
                                            onBlur={this.bgImageBlur.bind(this)}
                                        />
                                        <Upload
                                            className='upload-btn'
                                            url='/api/file/upload'
                                            fileName='file'
                                            data={{ pid }}
                                            onUploadSucc={this.onBgUploadSucc.bind(this)}
                                            onUploadErr={this.onBgUploadErr.bind(this)}
                                        >
                                            <Button type='primary' size='large'>
                                                上传
                                            </Button>
                                        </Upload>
                                    </Col>
                                </Row>
                                {css.backgroundImage && (
                                    <Fragment>
                                        {/*------ 背景重复 ------*/}
                                        <Row key={2} className='row' align='middle'>
                                            <Col span={6} className='style-text'>
                                                背景重复:
                                            </Col>
                                            <Col span={18}>
                                                <Select
                                                    className='style-select'
                                                    showArrow
                                                    size='large'
                                                    placeholder='请选择'
                                                    value={css.backgroundRepeat || 'repeat'}
                                                    onChange={this.onStyleChange.bind(this, 'backgroundRepeat')}
                                                >
                                                    {cssBgRepeatList.map((item, i) => (
                                                        <Select.Option key={`row-${i}`} value={item.value}>
                                                            {item.title}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Col>
                                        </Row>
                                        {/*------ 背景大小 ------*/}
                                        <Row className='row' align='middle' justify='space-between'>
                                            <Col span={6} className='style-text'>
                                                背景大小:
                                            </Col>
                                            <Col span={18}>
                                                <Select
                                                    className='style-select'
                                                    showArrow
                                                    size='large'
                                                    placeholder='请选择'
                                                    value={css.backgroundSize || 'auto'}
                                                    onChange={this.onStyleChange.bind(this, 'backgroundSize')}
                                                >
                                                    {['auto', 'cover', 'contain'].map((item, i) => (
                                                        <Select.Option key={`row-${i}`} value={item}>
                                                            {item}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Col>
                                        </Row>
                                        {/*------ 背景位置 ------*/}
                                        <Row className='style-text' align='middle'>
                                            背景位置:
                                        </Row>
                                        <Row className='row' align='middle' justify='space-between'>
                                            <Col span={2} className='style-text'>
                                                X:
                                            </Col>
                                            <Col span={9}>
                                                <InputUnit
                                                    size='large'
                                                    value={css.backgroundPositionX}
                                                    onChange={this.onStyleChange.bind(this, 'backgroundPositionX')}
                                                />
                                            </Col>
                                            <Col span={2} className='style-text'>
                                                Y:
                                            </Col>
                                            <Col span={9}>
                                                <InputUnit
                                                    size='large'
                                                    value={css.backgroundPositionY}
                                                    onChange={this.onStyleChange.bind(this, 'backgroundPositionY')}
                                                />
                                            </Col>
                                        </Row>
                                    </Fragment>
                                )}
                            </Fragment>
                        )}
                    </div>
                )}
                {/*------ 字体 ------*/}
                {utils.has(
                    ['Root', 'Text', 'Input', 'Textarea', 'Submit', 'Icon', 'Checkbox', 'Radio'],
                    activeEleName,
                ) && (
                    <div className='style-card'>
                        <Row
                            className='style-title'
                            align='middle'
                            justify='space-between'
                            onClick={this.switchStatus.bind(this, 'backgroundOpen')}
                        >
                            <Col className='style-text'>文字样式</Col>
                            <Col>{backgroundOpen ? <DownOutlined /> : <LeftOutlined />}</Col>
                        </Row>
                        {textOpen && (
                            <Fragment>
                                <Row className='row' align='middle'>
                                    <Col span={6} className='style-text'>
                                        字号:
                                    </Col>
                                    <Col span={18}>
                                        <InputUnit
                                            className='style-input'
                                            size='large'
                                            placeholder={24}
                                            value={css.fontSize}
                                            onChange={this.onStyleChange.bind(this, 'fontSize')}
                                        />
                                    </Col>
                                </Row>
                                <Row className='row' align='middle'>
                                    <Col span={6} className='style-text'>
                                        颜色:
                                    </Col>
                                    <Col span={18}>
                                        <InputColor
                                            className='style-input'
                                            value={css.color}
                                            onChange={this.onStyleChange.bind(this, 'color')}
                                        />
                                    </Col>
                                </Row>
                                <Row className='row' align='middle'>
                                    <Col span={6} className='style-text'>
                                        粗细:
                                    </Col>
                                    <Col span={18}>
                                        <Select
                                            className='style-select'
                                            size='large'
                                            value={css.fontWeight}
                                            defaultValue='normal'
                                            onChange={this.onStyleChange.bind(this, 'fontWeight')}
                                        >
                                            {fontSizeList.map((row, idx) => (
                                                <Select.Option key={`row-${idx}`} value={row}>
                                                    {row}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Col>
                                </Row>
                                <Row className='row' align='middle'>
                                    <Col span={6} className='style-text'>
                                        字体:
                                    </Col>
                                    <Col span={18}>
                                        <Select
                                            className='style-select'
                                            size='large'
                                            value={css.fontFamily}
                                            defaultValue='normal'
                                            onChange={this.onStyleChange.bind(this, 'fontFamily')}
                                        >
                                            {fontFamilyList.map((row, idx) => (
                                                <Select.Option key={`row-${idx}`} value={row.value}>
                                                    {row.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Col>
                                </Row>
                                <Row className='row' align='middle'>
                                    <Col span={6} className='style-text'>
                                        行高:
                                    </Col>
                                    <Col span={18}>
                                        <InputUnit
                                            className='style-input'
                                            value={css.lineHeight}
                                            onChange={this.onStyleChange.bind(this, 'lineHeight')}
                                        />
                                    </Col>
                                </Row>
                            </Fragment>
                        )}
                    </div>
                )}
                {/*------ margin ------*/}
                {!utils.has(['Dialog'], activeEleName) && (
                    <div className='style-card'>
                        <Row
                            className='style-title'
                            align='middle'
                            justify='space-between'
                            onClick={this.switchStatus.bind(this, 'marginOpen')}
                        >
                            <Col className='style-text'>外边距</Col>
                            <Col>{marginOpen ? <DownOutlined /> : <LeftOutlined />}</Col>
                        </Row>
                        {marginOpen && (
                            <Row align='middle'>
                                {cssMarginList.map((col, idx) => (
                                    <Col key={`col-${idx}`} span={12}>
                                        <Row key={`row-${idx}`} className='row' align='middle'>
                                            <Col span={4} className='style-text'>
                                                {col.title}:
                                            </Col>
                                            <Col span={19}>
                                                <InputUnit
                                                    className='style-input'
                                                    size='large'
                                                    value={css[col.value]}
                                                    placeholder={col.placeholder}
                                                    onChange={this.onStyleChange.bind(this, col.value)}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>
                )}
                {/*------ padding ------*/}
                {!utils.has(['Dialog'], activeEleName) && (
                    <div className='style-card'>
                        <Row
                            className='style-title'
                            align='middle'
                            justify='space-between'
                            onClick={this.switchStatus.bind(this, 'paddingOpen')}
                        >
                            <Col className='style-text'>内边距</Col>
                            <Col>{paddingOpen ? <DownOutlined /> : <LeftOutlined />}</Col>
                        </Row>
                        {paddingOpen && (
                            <Row align='middle'>
                                {cssPaddingList.map((col, idx) => (
                                    <Col key={`col-${idx}`} span={12}>
                                        <Row key={`row-${idx}`} className='row' align='middle'>
                                            <Col span={4} className='style-text'>
                                                {col.title}:
                                            </Col>
                                            <Col span={19}>
                                                <InputUnit
                                                    className='style-input'
                                                    size='large'
                                                    value={css[col.value]}
                                                    placeholder={col.placeholder}
                                                    onChange={this.onStyleChange.bind(this, col.value)}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>
                )}
                {/*------ border ------*/}
                {!utils.has(['Dialog'], activeEleName) && (
                    <div className='style-card'>
                        <Row
                            className='style-title'
                            align='middle'
                            justify='space-between'
                            onClick={this.switchStatus.bind(this, 'borderOpen')}
                        >
                            <Col className='style-text'>边框</Col>
                            <Col>{borderOpen ? <DownOutlined /> : <LeftOutlined />}</Col>
                        </Row>
                        {borderOpen && (
                            <Fragment>
                                {cssBorderList.map((row, idx) => {
                                    const { title, attr = [] } = row;
                                    return (
                                        <Row key={`row-${idx}`} className='row'>
                                            <Col span={4} className='style-text'>
                                                {title}
                                            </Col>
                                            {attr.map((col, i) => (
                                                <Col key={`col-${i}`} span={col.type === 'number' ? 6 : 7}>
                                                    {col.type === 'number' && (
                                                        <InputUnit
                                                            className='style-input'
                                                            style={{ width: '90%' }}
                                                            size='large'
                                                            value={css[col.value]}
                                                            placeholder={col.placeholder}
                                                            onChange={this.onStyleChange.bind(this, col.value)}
                                                        />
                                                    )}
                                                    {col.type === 'color' && (
                                                        <InputColor
                                                            className='style-input'
                                                            position='top,right'
                                                            value={css[col.value]}
                                                            onChange={this.onStyleChange.bind(this, col.value)}
                                                        />
                                                    )}
                                                    {col.type === 'select' && (
                                                        <Select
                                                            showArrow
                                                            size='large'
                                                            placeholder='请选择'
                                                            defaultValue={css[col.value] || 'none'}
                                                            onChange={this.onStyleChange.bind(this, col.value)}
                                                            style={{ width: '90%' }}
                                                        >
                                                            {cssBorderStyleList.map((item, idx) => (
                                                                <Select.Option key={`item-${idx}`} value={item.value}>
                                                                    {item.title}
                                                                </Select.Option>
                                                            ))}
                                                        </Select>
                                                    )}
                                                </Col>
                                            ))}
                                        </Row>
                                    );
                                })}
                            </Fragment>
                        )}
                    </div>
                )}
                {/*------ 其他 ------*/}
                {!utils.has(['Root', 'Dialog'], activeEleName) && (
                    <div className='style-card'>
                        <Row
                            className='style-title'
                            align='middle'
                            justify='space-between'
                            onClick={this.switchStatus.bind(this, 'othersOpen')}
                        >
                            <Col className='style-text'>其他</Col>
                            <Col>{othersOpen ? <DownOutlined /> : <LeftOutlined />}</Col>
                        </Row>
                        {othersOpen && (
                            <Fragment>
                                <Row className='row' align='middle'>
                                    <Col span={6} className='style-text'>
                                        圆角:
                                    </Col>
                                    <Col span={18}>
                                        <InputUnit
                                            className='style-input'
                                            size='large'
                                            value={css.borderRadius}
                                            onChange={this.onStyleChange.bind(this, 'borderRadius')}
                                        />
                                    </Col>
                                </Row>
                                <Row className='row' align='middle'>
                                    <Col span={6} className='style-text'>
                                        透明度:
                                    </Col>
                                    <Col span={18}>
                                        <Slider
                                            defaultValue={1}
                                            step={0.01}
                                            min={0}
                                            max={1}
                                            value={css.opacity}
                                            onChange={this.onStyleChange.bind(this, 'opacity')}
                                        />
                                    </Col>
                                </Row>
                            </Fragment>
                        )}
                    </div>
                )}
                {/*------ 扩展 ------*/}
                <div className='style-card'>
                    <Row
                        className='style-title'
                        align='middle'
                        justify='space-between'
                        onClick={this.switchStatus.bind(this, 'extraOpen')}
                    >
                        <Col className='style-text'>扩展</Col>
                        <Col>{extraOpen ? <DownOutlined /> : <LeftOutlined />}</Col>
                    </Row>
                    {extraOpen && (
                        <Row className='row'>
                            <InputCode
                                className='extra'
                                height='280px'
                                width='100%'
                                mode='css'
                                value={css.extra || `.${activeId} {\n\n}`}
                                onBlur={this.onStyleChange.bind(this, 'extra')}
                            />
                        </Row>
                    )}
                </div>
            </div>
        );
    }
}

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(StyleList);
