import React from 'react';
import { Route, Switch, BrowserRouter, hashHistory } from 'react-router-dom';
import { List, Editor, ComponentList, Backstage } from '../pages';

const RootRouter = props => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={List} />
            <Route path='/list' component={List} />
            <Route path='/editor' component={Editor} />
            <Route path='/component-list' component={ComponentList} />
            <Route path='/backstage' component={Backstage} />
        </Switch>
    </BrowserRouter>
);
export default RootRouter;
