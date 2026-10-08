import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import rootReducer from './reducers';
import authSaga from './sagas/authSaga';
import productSaga from './sagas/productSaga';
import cartSaga from './sagas/cartSaga';
import orderSaga from './sagas/orderSaga';

function* rootSaga() {
  yield all([
    authSaga(),
    productSaga(),
    cartSaga(),
    orderSaga(),
  ]);
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export default store;