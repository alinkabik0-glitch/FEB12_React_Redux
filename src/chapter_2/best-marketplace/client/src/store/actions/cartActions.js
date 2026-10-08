export const FETCH_CART_REQUEST = 'FETCH_CART_REQUEST';
export const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS';
export const FETCH_CART_FAILURE = 'FETCH_CART_FAILURE';

export const ADD_TO_CART_REQUEST = 'ADD_TO_CART_REQUEST';
export const ADD_TO_CART_SUCCESS = 'ADD_TO_CART_SUCCESS';
export const ADD_TO_CART_FAILURE = 'ADD_TO_CART_FAILURE';

export const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const CLEAR_CART = 'CLEAR_CART';

export const fetchCartRequest = () => ({
  type: FETCH_CART_REQUEST,
});

export const fetchCartSuccess = (cart) => ({
  type: FETCH_CART_SUCCESS,
  payload: cart,
});

export const fetchCartFailure = (error) => ({
  type: FETCH_CART_FAILURE,
  payload: error,
});

export const addToCartRequest = (productId, quantity = 1) => {
  console.log('Action: addToCartRequest', { productId, quantity });
  return {
    type: ADD_TO_CART_REQUEST,
    payload: { productId, quantity },
  };
};

export const addToCartSuccess = (cart) => ({
  type: ADD_TO_CART_SUCCESS,
  payload: cart,
});

export const addToCartFailure = (error) => ({
  type: ADD_TO_CART_FAILURE,
  payload: error,
});

export const updateCartItem = (productId, quantity) => ({
  type: UPDATE_CART_ITEM,
  payload: { productId, quantity },
});

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});

export const clearCart = () => ({
  type: CLEAR_CART,
});