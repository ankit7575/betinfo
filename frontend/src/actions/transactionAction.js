import axios from "axios";
import {
  CREATE_TRANSACTION_REQUEST,
  CREATE_TRANSACTION_SUCCESS,
  CREATE_TRANSACTION_FAIL,
  UPDATE_TRANSACTION_STATUS_REQUEST,
  UPDATE_TRANSACTION_STATUS_SUCCESS,
  UPDATE_TRANSACTION_STATUS_FAIL,
  USER_TRANSACTIONS_REQUEST,
  USER_TRANSACTIONS_SUCCESS,
  USER_TRANSACTIONS_FAIL,
  ALL_USER_TRANSACTIONS_REQUEST,
  ALL_USER_TRANSACTIONS_SUCCESS,
  ALL_USER_TRANSACTIONS_FAIL,
  CLEAR_ERRORS,
} from "../constants/transactionConstants";

// Get the base URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

// Token helper
const getToken = () => localStorage.getItem("accessToken");

// Config helper with token
const getAuthConfig = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
};

// Error handler
const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "An error occurred";

// ======================
// CREATE TRANSACTION
// ======================
export const createTransaction = (transactionData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_TRANSACTION_REQUEST });

    const config = getAuthConfig();
    const { data } = await axios.post(`${API_URL}/transaction/create`, transactionData, config);

    dispatch({ type: CREATE_TRANSACTION_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CREATE_TRANSACTION_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// ================================
// UPDATE TRANSACTION STATUS (Admin)
// ================================
export const updateTransactionStatus = (transactionId, status) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TRANSACTION_STATUS_REQUEST });

    const config = getAuthConfig();
    const { data } = await axios.post(
      `${API_URL}/transaction/update-status`,
      { transactionId, status },
      config
    );

    dispatch({ type: UPDATE_TRANSACTION_STATUS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: UPDATE_TRANSACTION_STATUS_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// ==========================
// GET CURRENT USER TRANSACTIONS
// ==========================
export const getUserTransactions = () => async (dispatch) => {
  try {
    dispatch({ type: USER_TRANSACTIONS_REQUEST });

    const config = getAuthConfig();
    const { data } = await axios.get(`${API_URL}/transaction/user-transactions`, config);

    dispatch({ type: USER_TRANSACTIONS_SUCCESS, payload: data.transactions });
  } catch (error) {
    dispatch({
      type: USER_TRANSACTIONS_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// =======================
// GET ALL USER TRANSACTIONS (Admin)
// =======================
export const getAllUserTransactions = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USER_TRANSACTIONS_REQUEST });

    const config = getAuthConfig();
    const { data } = await axios.get(`${API_URL}/transaction/all-transactions`, config);

    dispatch({ type: ALL_USER_TRANSACTIONS_SUCCESS, payload: data.userTransactions });
  } catch (error) {
    dispatch({
      type: ALL_USER_TRANSACTIONS_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// ============
// CLEAR ERRORS
// ============
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
