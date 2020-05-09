import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger  from 'redux-logger';
import './style/common.scss';

import RootRouter from './router/index';
import reducers from './reducers/index';

const middlewares = [thunkMiddleware, logger];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(...middlewares)),
);

ReactDOM.render(
    <Provider store={store}>
        <RootRouter />
    </Provider>,
    document.getElementById('page-root'),
);
