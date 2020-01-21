import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import createRootReducer from './reducers';
import history from './history';
import rootSaga from './saga';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default function configureStore(initialState = {}) {
    const store = createStore(
        createRootReducer(history),
        initialState,
        composeEnhancers(
            applyMiddleware(
                sagaMiddleware,
                thunk,
                routerMiddleware(history)
            )
        )
    );
    sagaMiddleware.run(rootSaga);
    window.store = store;
    return store;
}
