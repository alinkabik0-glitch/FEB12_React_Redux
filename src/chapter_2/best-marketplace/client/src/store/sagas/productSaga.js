import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCT_REQUEST,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductSuccess,
  fetchProductFailure,
} from '../actions/productActions';
import api from '../../api/api';

function* fetchProducts(action) {
  try {
    const response = yield call(api.getProducts, action.payload);
    yield put(fetchProductsSuccess(response.data));
  } catch (error) {
    yield put(fetchProductsFailure(error.message));
  }
}

function* fetchProduct(action) {
  try {
    const response = yield call(api.getProduct, action.payload);
    yield put(fetchProductSuccess(response.data));
  } catch (error) {
    yield put(fetchProductFailure(error.message));
  }
}

export default function* productSaga() {
  yield all([
    takeLatest(FETCH_PRODUCTS_REQUEST, fetchProducts),
    takeLatest(FETCH_PRODUCT_REQUEST, fetchProduct),
  ]);
}