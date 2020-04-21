import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import './public/css/base.scss';
import './public/font/iconfont.css';

import RootRouter from './router/index';
import reducers from './reducers/index';

const middlewares = [thunkMiddleware, composeWithDevTools]
const store = createStore(reducers, compose(applyMiddleware(...middlewares)));

ReactDOM.render(
    <Provider store={store}>
        <RootRouter />
    </Provider>,
    document.getElementById('root'),
);
