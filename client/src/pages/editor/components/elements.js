import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import './element.scss';

class Element extends Component {
    constructor() {
        super(...arguments);
    }

    selectNode(key, e) {
        e.stopPropagation();
        this.props.onNodeSelect(key);
    }

    renderElement(item) {
        const { activeKey } = this.props.editorInfo;
        const active = activeKey == item.id;
        switch (item.element) {
            case 'div':
                return (
                    <div
                        id={item.id}
                        className={classNames('ele-div', item.id, { active })}
                        style={item.style}
                        onClick={this.selectNode.bind(this, item.id)}
                    >
                        {this.props.children}
                        {item.text}
                    </div>
                );
            case 'input':
                return <input type='text' {...item} />;
            default:
                return <div>default</div>;
        }
    }

    render() {
        const {
            item,
            editorInfo: { activeKey },
        } = this.props;
        const active = item.id == activeKey;

        return (
            <div className={classNames('ele-box', { active })}>
                <div className='ctrl-point top' />
                <div className='ctrl-point right' />
                <div className='ctrl-point bottom' />
                <div className='ctrl-point left' />
                {this.renderElement(item)}
            </div>
        );
    }
}

export default connect(
    ({ editorInfo }) => ({ editorInfo }),
    dispatch => ({ dispatch }),
)(Element);
