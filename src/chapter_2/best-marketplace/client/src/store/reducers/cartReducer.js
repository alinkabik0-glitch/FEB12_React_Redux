import {
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  CLEAR_CART,
} from '../actions/cartActions';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CART_REQUEST:
      return { ...state, loading: true };
      
    case FETCH_CART_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        items: Array.isArray(action.payload) ? action.payload : []
      };
      
    case ADD_TO_CART_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        items: Array.isArray(action.payload) ? action.payload : []
      };
      
    case FETCH_CART_FAILURE:
    case ADD_TO_CART_FAILURE:
      return { ...state, loading: false, error: action.payload };
      
    case UPDATE_CART_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
      
    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload),
      };
      
    case CLEAR_CART:
      return { ...state, items: [] };
      
    default:
      return state;
  }
};

export default cartReducer;