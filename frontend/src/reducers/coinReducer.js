import {
  GET_USER_COINS_REQUEST,
  GET_USER_COINS_SUCCESS,
  GET_USER_COINS_FAIL,
  GET_USER_KEYS_REQUEST,
  GET_USER_KEYS_SUCCESS,
  GET_USER_KEYS_FAIL,
  REDEEM_COIN_FOR_ALL_MATCHES_REQUEST,
  REDEEM_COIN_FOR_ALL_MATCHES_SUCCESS,
  REDEEM_COIN_FOR_ALL_MATCHES_FAIL,
  REDEEM_SHARED_COIN_REQUEST,
  REDEEM_SHARED_COIN_SUCCESS,
  REDEEM_SHARED_COIN_FAIL,
  CHECK_COIN_EXPIRY_REQUEST,
  CHECK_COIN_EXPIRY_SUCCESS,
  CHECK_COIN_EXPIRY_FAIL,
  GET_ALL_USERS_KEYS_AND_COINS_REQUEST,
  GET_ALL_USERS_KEYS_AND_COINS_SUCCESS,
  GET_ALL_USERS_KEYS_AND_COINS_FAIL,
  CLEAR_EXPIRED_COIN_REQUEST,
  CLEAR_EXPIRED_COIN_SUCCESS,
  CLEAR_EXPIRED_COIN_FAIL,
} from '../constants/coinConstants.js';

// Initial state for the coin reducer
const initialState = {
  loading: false,
  userCoins: [],
  userKeys: [],
  allUserCoinsAndKeys: [],
  expiredCoins: [],
  error: null,
  success: false,
  message: null,
};

export const coinReducer = (state = initialState, action) => {
  switch (action.type) {
    // User Coins
    case GET_USER_COINS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_USER_COINS_SUCCESS:
      return { ...state, loading: false, userCoins: action.payload, message: 'User coins fetched successfully.' };
    case GET_USER_COINS_FAIL:
      return { ...state, loading: false, error: action.payload, message: null }; // Clear message on failure

    // User Keys
    case GET_USER_KEYS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_USER_KEYS_SUCCESS:
      return { ...state, loading: false, userKeys: action.payload, message: 'User keys fetched successfully.' };
    case GET_USER_KEYS_FAIL:
      return { ...state, loading: false, error: action.payload, message: null }; // Clear message on failure

    // Redeem Coin for All Matches
    case REDEEM_COIN_FOR_ALL_MATCHES_REQUEST:
      return { ...state, loading: true, error: null, success: false };
    case REDEEM_COIN_FOR_ALL_MATCHES_SUCCESS:
      return { ...state, loading: false, success: true, message: 'Coins redeemed for all matches successfully.' };
    case REDEEM_COIN_FOR_ALL_MATCHES_FAIL:
      return { ...state, loading: false, error: action.payload, message: null }; // Clear message on failure

    // Redeem Shared Coin (Match Pass)
    case REDEEM_SHARED_COIN_REQUEST:
      return { ...state, loading: true, error: null, success: false };
    case REDEEM_SHARED_COIN_SUCCESS:
      return { ...state, loading: false, success: true, message: 'Shared coin redeemed successfully.' };
    case REDEEM_SHARED_COIN_FAIL:
      return { ...state, loading: false, error: action.payload, message: null }; // Clear message on failure

    // Check Coin Expiry
    case CHECK_COIN_EXPIRY_REQUEST:
      return { ...state, loading: true, error: null };
    case CHECK_COIN_EXPIRY_SUCCESS:
      return { ...state, loading: false, expiredCoins: action.payload, message: 'Coin expiry checked successfully.' };
    case CHECK_COIN_EXPIRY_FAIL:
      return { ...state, loading: false, error: action.payload, message: null }; // Clear message on failure

    // Get All Users' Keys and Coins (Admin)
    case GET_ALL_USERS_KEYS_AND_COINS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_ALL_USERS_KEYS_AND_COINS_SUCCESS:
      return { ...state, loading: false, allUserCoinsAndKeys: action.payload, message: 'All users\' keys and coins fetched successfully.' };
    case GET_ALL_USERS_KEYS_AND_COINS_FAIL:
      return { ...state, loading: false, error: action.payload, message: null }; // Clear message on failure

    // Clear Expired Coins
    case CLEAR_EXPIRED_COIN_REQUEST:
      return { ...state, loading: true, error: null };
    case CLEAR_EXPIRED_COIN_SUCCESS:
      return { ...state, loading: false, success: true, message: 'Expired coins cleared successfully.' };
    case CLEAR_EXPIRED_COIN_FAIL:
      return { ...state, loading: false, error: action.payload, message: null }; // Clear message on failure

    default:
      return state;
  }
};

export default coinReducer;
