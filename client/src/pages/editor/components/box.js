import React, { Component } from 'react';
import utils from '../../../common/utils';

class Box extends Component {
    constructor() {
        super(...arguments);
    }

    onStyleChange(attrName, e) {
        this.props.onChange(attrName, e);
    }

    render() {
        const { css, activeEle } = this.props;

        return (
            <div className='attr-card'>
                <div className='card-title'>盒子</div>
                <div className='card-content'>
                    <div className='box-model'>
                        <span className='tag'>margin</span>
                        <input
                            className='box-input'
                            type='text'
                            placeholder='-'
                            onChange={this.onStyleChange.bind(this, 'marginLeft')}
                            value={css.marginLeft}
                        />
                        <div className='margin-inner'>
                            <input
                                className='box-input'
                                type='text'
                                placeholder='-'
                                onChange={this.onStyleChange.bind(this, 'marginTop')}
                                value={css.marginTop}
                            />
                            <div className='border'>
                                <span className='tag'>border</span>
                                <input
                                    className='box-input'
                                    type='text'
                                    placeholder='-'
                                    onChange={this.onStyleChange.bind(this, 'borderLeft')}
                                    value={css.borderLeft}
                                />
                                <div className='border-inner'>
                                    <input
                                        className='box-input'
                                        type='text'
                                        placeholder='-'
                                        onChange={this.onStyleChange.bind(this, 'borderTop')}
                                        value={css.borderTop}
                                    />
                                    <div className='padding'>
                                        <span className='tag'>padding</span>

                                        <input
                                            className='padding-input'
                                            type='text'
                                            placeholder='-'
                                            onChange={this.onStyleChange.bind(this, 'paddingLeft')}
                                            value={css.paddingLeft}
                                        />
                                        <div className='padding-inner'>
                                            <input
                                                className='padding-input'
                                                type='text'
                                                placeholder='-'
                                                onChange={this.onStyleChange.bind(this, 'paddingTop')}
                                                value={css.paddingTop}
                                            />
                                            {!utils.has(['Text', 'Link', 'Radio', 'Checkbox'], activeEle.element) ? (
                                                <div className='entity'>
                                                    <input
                                                        className='entity-input'
                                                        type='text'
                                                        placeholder='width'
                                                        onChange={this.onStyleChange.bind(this, 'width')}
                                                        value={css.width}
                                                    />
                                                    x
                                                    <input
                                                        className='entity-input'
                                                        type='text'
                                                        placeholder='height'
                                                        onChange={this.onStyleChange.bind(this, 'height')}
                                                        value={css.height}
                                                    />
                                                </div>
                                            ) : (
                                                <div className='entity' />
                                            )}
                                            <input
                                                className='padding-input'
                                                type='text'
                                                placeholder='-'
                                                onChange={this.onStyleChange.bind(this, 'paddingBottom')}
                                                value={css.paddingBottom}
                                            />
                                        </div>
                                        <input
                                            className='padding-input'
                                            type='text'
                                            placeholder='-'
                                            onChange={this.onStyleChange.bind(this, 'paddingRight')}
                                            value={css.paddingRight}
                                        />
                                    </div>
                                    <input
                                        className='box-input'
                                        type='text'
                                        placeholder='-'
                                        onChange={this.onStyleChange.bind(this, 'borderBottom')}
                                        value={css.borderBottom}
                                    />
                                </div>
                                <input
                                    className='box-input'
                                    type='text'
                                    placeholder='-'
                                    onChange={this.onStyleChange.bind(this, 'borderRight')}
                                    value={css.borderRight}
                                />
                            </div>
                            <input
                                className='box-input'
                                type='text'
                                placeholder='-'
                                onChange={this.onStyleChange.bind(this, 'marginBottom')}
                                value={css.marginBottom}
                            />
                        </div>
                        <input
                            className='box-input'
                            type='text'
                            placeholder='-'
                            onChange={this.onStyleChange.bind(this, 'marginRight')}
                            value={css.marginRight}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

Box.defaultProps = {
    css: {},
    element: {},
    onChange: () => {},
};

export default Box;
