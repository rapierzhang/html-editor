import React, { Component } from 'react';
import { Row, Col, Button, Input } from 'antd';
import './floor-ctrl.scss';

class FloorCtrl extends Component {
    constructor() {
        super(...arguments);
    }

    onListAdd(type, defaultRow) {
        this.props.onListAdd(type, defaultRow);
    }

    onListDel(type, idx) {
        this.props.onListDel(type, idx);
    }

    onListChange(key, idx, e) {
        this.props.onListChange(key, idx, e);
    }

    render() {
        const { apiList } = this.props;

        return (
            <Row className='floor' justify='flex-start' align='middle'>
                {apiList.map((item, idx) => (
                    <Col key={`item-${idx}`} className='floor-item' span={7}>
                        <Row align='middle'>
                            <Col className='split' span={2}>
                                /
                            </Col>
                            <Col span={22}>
                                <Input
                                    className='floor-input'
                                    size='large'
                                    type='text'
                                    value={item}
                                    onChange={this.onListChange.bind(this, 'apiList', idx)}
                                />
                            </Col>
                        </Row>
                        <div className='del' onClick={this.onListDel.bind(this, 'apiList', idx)}>
                            <i className='icon html-icon-close' />
                        </div>
                    </Col>
                ))}
                <Button className='add' onClick={this.onListAdd.bind(this, 'apiList', '')}>
                    +
                </Button>
            </Row>
        );
    }
}

FloorCtrl.defaultProps = {
    apiList: [],
    onListAdd: () => {},
    onListDel: () => {},
    onListChange: () => {},
};

export default FloorCtrl;
