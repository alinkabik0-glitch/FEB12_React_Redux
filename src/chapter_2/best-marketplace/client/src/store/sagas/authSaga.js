import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';
import { 
  LOGIN_REQUEST, 
  SIGNUP_REQUEST, 
  LOGOUT,
  CHECK_AUTH,
  loginSuccess, 
  loginFailure,
  signupSuccess,
  signupFailure,
} from '../actions/authActions';
import { clearCart, fetchCartRequest } from '../actions/cartActions';
import api from '../../api/api';

function* login(action) {
  try {
    const response = yield call(api.login, action.payload);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    yield put(loginSuccess(user));
    yield put(fetchCartRequest());
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    yield put(loginFailure(message));
  }
}

function* signup(action) {
  try {
    const response = yield call(api.signup, action.payload);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    yield put(signupSuccess(user));
    yield put(fetchCartRequest());
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    yield put(signupFailure(message));
  }
}

function* logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  yield put(clearCart());
}

function* checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (token && user) {
    try {
      const parsedUser = JSON.parse(user);
      yield put(loginSuccess(parsedUser));
      yield put(fetchCartRequest());
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
}

export default function* authSaga() {
  yield all([
    takeLatest(LOGIN_REQUEST, login),
    takeLatest(SIGNUP_REQUEST, signup),
    takeEvery(LOGOUT, logout),
    takeEvery(CHECK_AUTH, checkAuth),
  ]);
}