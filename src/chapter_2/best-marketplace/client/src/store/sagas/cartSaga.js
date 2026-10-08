import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';
import {
  FETCH_CART_REQUEST,
  ADD_TO_CART_REQUEST,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  fetchCartSuccess,
  fetchCartFailure,
  addToCartSuccess,
  addToCartFailure,
} from '../actions/cartActions';
import api from '../../api/api';

function* fetchCart() {
  try {
    console.log('Saga: Fetching cart');
    const response = yield call(api.getCart);
    const cart = response.data.cart || [];
    localStorage.setItem('cart_backup', JSON.stringify(cart));
    console.log('Saga: Cart fetched', cart);
    yield put(fetchCartSuccess(cart));
  } catch (error) {
    console.error('Saga: Cart fetch error', error);
    const backup = localStorage.getItem('cart_backup');
    const backupCart = backup ? JSON.parse(backup) : [];
    yield put(fetchCartSuccess(backupCart));
  }
}

function* addToCart(action) {
  try {
    const { productId, quantity } = action.payload;
    console.log('Saga: Adding to cart', { productId, quantity });
    const response = yield call(api.addToCart, productId, quantity);
    const cart = response.data.cart || [];
    localStorage.setItem('cart_backup', JSON.stringify(cart));
    console.log('Saga: Cart updated', cart);
    yield put(addToCartSuccess(cart));
  } catch (error) {
    console.error('Saga: Add to cart error', error);
    yield put(addToCartFailure(error.message));
  }
}

function* updateCartItem(action) {
  try {
    const { productId, quantity } = action.payload;
    const response = yield call(api.updateCart, productId, quantity);
    const cart = response.data.cart || [];
    localStorage.setItem('cart_backup', JSON.stringify(cart));
    yield put(fetchCartSuccess(cart));
  } catch (error) {
    console.error('Saga: Update cart error', error);
  }
}

function* removeFromCart(action) {
  try {
    const productId = action.payload;
    const response = yield call(api.updateCart, productId, 0);
    const cart = response.data.cart || [];
    localStorage.setItem('cart_backup', JSON.stringify(cart));
    yield put(fetchCartSuccess(cart));
  } catch (error) {
    console.error('Saga: Remove from cart error', error);
  }
}

export default function* cartSaga() {
  yield all([
    takeLatest(FETCH_CART_REQUEST, fetchCart),
    takeLatest(ADD_TO_CART_REQUEST, addToCart),
    takeLatest(UPDATE_CART_ITEM, updateCartItem),
    takeLatest(REMOVE_FROM_CART, removeFromCart),
  ]);
}