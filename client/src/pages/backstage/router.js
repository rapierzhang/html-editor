import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Script from './script';
import Log from './log';

class Router extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='backstage-wraper'>
                <Switch>
                    <Route path='/backstage/script' component={Script} />
                    <Route path='/backstage/log' component={Log} />
                </Switch>
            </div>
        );
    }
}

export default Router;
