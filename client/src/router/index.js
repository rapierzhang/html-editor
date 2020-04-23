import React from 'react';
import { HashRouter, Route, Switch, useHistory, withRouter } from 'react-router-dom';
import List from '../pages/list/';
import Editor from '../pages/editor';

const RootRouter = () => (
    <HashRouter>
        <Switch>
            <Route path='/' component={Editor} />
            <Route path='/editor' component={Editor} />
        </Switch>
    </HashRouter>
);
export default RootRouter;
