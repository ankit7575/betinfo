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
} from "../constants/transactionConstants.js";

const initialState = {
  loading: false,
  success: false,
  error: null,
  message: null,
  transaction: null,
  transactions: [],
  allTransactions: [],
  isStatusUpdated: false,
};

export const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create Transaction
    case CREATE_TRANSACTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
        message: null, // Reset message on request
      };
    case CREATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        transaction: action.payload,
        message: "Transaction created successfully.",
      };
    case CREATE_TRANSACTION_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
        message: null, // Clear message on failure
      };

    // Update Transaction Status
    case UPDATE_TRANSACTION_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        isStatusUpdated: false,
        error: null,
        message: null, // Reset message on request
      };
    case UPDATE_TRANSACTION_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        isStatusUpdated: true,
        message: "Transaction status updated successfully.",
      };
    case UPDATE_TRANSACTION_STATUS_FAIL:
      return {
        ...state,
        loading: false,
        isStatusUpdated: false,
        error: action.payload,
        message: null, // Clear message on failure
      };

    // User Transactions
    case USER_TRANSACTIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        message: null, // Reset message on request
      };
    case USER_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        transactions: action.payload,
        message: "User transactions fetched successfully.",
      };
    case USER_TRANSACTIONS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: null, // Clear message on failure
      };

    // All User Transactions
    case ALL_USER_TRANSACTIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        message: null, // Reset message on request
      };
    case ALL_USER_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        allTransactions: action.payload,
        message: "All transactions fetched successfully.",
      };
    case ALL_USER_TRANSACTIONS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: null, // Clear message on failure
      };

    // Clear Errors
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        message: null,
      };

    default:
      return state;
  }
};
