import React, { Component } from 'react';
import classNames from 'classnames';
import './element.scss'

class Element extends Component {
    constructor() {
        super(...arguments)
    }

    selectNode(key, e) {
        e.stopPropagation()
        this.props.onNodeSelect(key)
    }


    render() {
        const { item, active } = this.props;

        switch (item.element) {
            case 'div':
                return (
                    <div
                        id={item.key}
                        className={classNames('ele-div', item.key, { active })}
                        style={item.style}
                        onClick={this.selectNode.bind(this, item.key)}
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
}

export default Element;
