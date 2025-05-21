import axios from "axios";
import {
  GET_ALL_USERS_KEYS_AND_COINS_REQUEST,
  GET_ALL_USERS_KEYS_AND_COINS_SUCCESS,
  GET_ALL_USERS_KEYS_AND_COINS_FAIL,
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
  CLEAR_EXPIRED_COIN_REQUEST,
  CLEAR_EXPIRED_COIN_SUCCESS,
  CLEAR_EXPIRED_COIN_FAIL,
} from "../constants/coinConstants";

const API_URL = process.env.REACT_APP_API_URL;

// Helper function to get the token from localStorage
const getToken = () => localStorage.getItem("accessToken");

// Helper function for constructing headers with Authorization token
const getAuthConfig = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
};

// Helper function for error handling
const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || "An error occurred";
};

// Get all users' keys and coins (admin)
export const getAllUsersKeysAndCoins = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_USERS_KEYS_AND_COINS_REQUEST });

    const { data } = await axios.get(`${API_URL}/keys-coins`, getAuthConfig());

    const now = new Date();

    const processedUsersData = data.usersData.map(user => {
      const updatedCoins = user.coins.map(coin => {
        const usedAtDate = coin.usedAt ? new Date(coin.usedAt) : null;

        return {
          ...coin,
          isRedeemedRecently:
            usedAtDate && (now.getTime() - usedAtDate.getTime() < 24 * 60 * 60 * 1000),
        };
      });

      return {
        ...user,
        coins: updatedCoins,
      };
    });

    dispatch({
      type: GET_ALL_USERS_KEYS_AND_COINS_SUCCESS,
      payload: processedUsersData,
    });
  } catch (error) {
    dispatch({
      type: GET_ALL_USERS_KEYS_AND_COINS_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// Get user's coins
export const getUserCoins = () => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_COINS_REQUEST });

    const { data } = await axios.get(`${API_URL}/coins`, getAuthConfig());

    dispatch({
      type: GET_USER_COINS_SUCCESS,
      payload: data.coins,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_COINS_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// Get user's keys
export const getUserKeys = () => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_KEYS_REQUEST });

    const { data } = await axios.get(`${API_URL}/coins/keys`, getAuthConfig());

    dispatch({
      type: GET_USER_KEYS_SUCCESS,
      payload: data.keys,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_KEYS_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// Redeem coin for all matches
export const redeemCoinForAllMatches = (coinId) => async (dispatch) => {
  try {
    dispatch({ type: REDEEM_COIN_FOR_ALL_MATCHES_REQUEST });

    const { data } = await axios.post(
      `${API_URL}/redeem/all-matches`,
      { coinId },
      getAuthConfig()
    );

    dispatch({
      type: REDEEM_COIN_FOR_ALL_MATCHES_SUCCESS,
      payload: data.redeemedCoin,
    });
  } catch (error) {
    dispatch({
      type: REDEEM_COIN_FOR_ALL_MATCHES_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// Redeem shared coin
export const redeemSharedCoin = (shareableCode) => async (dispatch) => {
  try {
    dispatch({ type: REDEEM_SHARED_COIN_REQUEST });

    const { data } = await axios.post(
      `${API_URL}/coins/redeem/shared`,
      { shareableCode },
      getAuthConfig()
    );

    dispatch({
      type: REDEEM_SHARED_COIN_SUCCESS,
      payload: data.redeemedCoin,
    });
  } catch (error) {
    dispatch({
      type: REDEEM_SHARED_COIN_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// Check coin expiry
export const checkCoinExpiry = () => async (dispatch) => {
  try {
    dispatch({ type: CHECK_COIN_EXPIRY_REQUEST });

    const { data } = await axios.post(
      `${API_URL}/coins/check/expiry`,
      {},
      getAuthConfig()
    );

    dispatch({
      type: CHECK_COIN_EXPIRY_SUCCESS,
      payload: data.remainingTime,
    });
  } catch (error) {
    dispatch({
      type: CHECK_COIN_EXPIRY_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// Clear expired coins
export const clearExpiredCoin = () => async (dispatch) => {
  try {
    dispatch({ type: CLEAR_EXPIRED_COIN_REQUEST });

    const { data } = await axios.post(
      `${API_URL}/coins/clear/expired`,
      {},
      getAuthConfig()
    );

    dispatch({
      type: CLEAR_EXPIRED_COIN_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: CLEAR_EXPIRED_COIN_FAIL,
      payload: getErrorMessage(error),
    });
  }
};
