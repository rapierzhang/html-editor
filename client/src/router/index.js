import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import List from '../pages/list/';
import Editor from '../pages/editor';

const RootRouter = () => (
    <BrowserRouter>
        <Switch>
            <Route path='/list' component={List} />
            <Route path='/editor' component={Editor} />
        </Switch>
    </BrowserRouter>
);
export default RootRouter;
