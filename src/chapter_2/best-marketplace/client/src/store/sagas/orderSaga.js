import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';
import {
  FETCH_ORDERS_REQUEST,
  CREATE_ORDER_REQUEST,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  createOrderSuccess,
  createOrderFailure,
} from '../actions/orderActions';
import { clearCart } from '../actions/cartActions';
import api from '../../api/api';

function* fetchOrders(action) {
  try {
    const response = yield call(api.getOrders, action.payload);
    yield put(fetchOrdersSuccess(response.data));
  } catch (error) {
    yield put(fetchOrdersFailure(error.message));
  }
}

function* createOrder(action) {
  try {
    const response = yield call(api.createOrder, action.payload);
    yield put(createOrderSuccess(response.data));
    yield put(clearCart());
  } catch (error) {
    yield put(createOrderFailure(error.message));
  }
}

export default function* orderSaga() {
  yield all([
    takeLatest(FETCH_ORDERS_REQUEST, fetchOrders),
    takeLatest(CREATE_ORDER_REQUEST, createOrder),
  ]);
}