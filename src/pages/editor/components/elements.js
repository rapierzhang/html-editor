import React, { Component } from 'react';
import classNames from 'classnames';
import './element.scss'

class Element extends Component {
    constructor() {
        super(...arguments)
    }

    setEleAttr(id) {
        this.props.setEleAttr(id)
    }


    render() {
        const { item, active } = this.props;

        switch (item.element) {
            case 'div':
                return (
                    <div
                        id={item.id}
                        className={classNames('ele-div', item.className, { active })}
                        style={item.style}
                        onClick={this.setEleAttr.bind(this, item.id)}
                    >
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
