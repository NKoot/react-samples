import React from 'react';
import { render } from 'react-dom';
import { Provider, ReactReduxContext } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import App from './App';
import { unregister } from './serviceWorker';
import history from './store/history';
import configureStore from './store/configureStore';
import './static/css/index.css';

const store = configureStore();

render(
    <Provider store={store} context={ReactReduxContext}>
        <ConnectedRouter history={history} context={ReactReduxContext}>
            <App/>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);

unregister();
