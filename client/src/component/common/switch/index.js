import React, { Component } from 'react';
import classNames from 'classnames';
import './switch.scss';

class Switch extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            status: null,
            canClick: true,
        };
    }

    componentDidMount() {
        const { defaultValue } = this.props;
        if (defaultValue) {
            this.setState({
                status: defaultValue ? 'open' : 'close',
            });
        }
    }

    handleSwitch() {
        const { status, canClick } = this.state;
        if (!canClick) return;
        if (status === 'open') {
            this.setState({ status: 'closing', canClick: false });
            setTimeout(() => this.setState({ status: 'close', canClick: true }), 450);
            this.props.onChange(false);
        } else {
            this.setState({ status: 'opening', canClick: false });
            setTimeout(() => this.setState({ status: 'open', canClick: true }), 450);
            this.props.onChange(true);
        }
    }

    render() {
        const { status } = this.state;
        return (
            <div className={classNames('switch', status)} onClick={this.handleSwitch.bind(this)}>
                <div className='switch-inner'></div>
            </div>
        );
    }
}

Switch.defaultProps = {
    defaultValue: false,
    onChange: () => {},
};

export default Switch;
