import {
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGOUT_USER,
  LOGOUT_USER_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  SINGLE_USER_REQUEST,
  SINGLE_USER_SUCCESS,
  SINGLE_USER_FAIL,
  UPDATE_USER_ROLE_REQUEST,
  UPDATE_USER_ROLE_SUCCESS,
  UPDATE_USER_ROLE_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  CLEAR_ERRORS,
} from "../constants/userConstants.js";

const initialState = {
  user: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  message: null,
  isUserLoaded: false,
  isUpdated: false,
  isPasswordUpdated: false,
  isDeleted: false,
  users: [],
  totalPages: 0,
  selectedUser: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // Auth
    case REGISTER_USER_REQUEST:
    case LOGIN_USER_REQUEST:
    case LOAD_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
      };

    case REGISTER_USER_SUCCESS:
    case LOGIN_USER_SUCCESS:
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        isUserLoaded: true,
        error: null,
        message: null,
      };

    case REGISTER_USER_FAIL:
    case LOGIN_USER_FAIL:
    case LOAD_USER_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    case LOGOUT_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isUserLoaded: false,
        error: null,
        message: null,
        isUpdated: false,
        isPasswordUpdated: false,
      };

    case LOGOUT_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Profile & Password Update
    case UPDATE_PROFILE_REQUEST:
    case UPDATE_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
        isUpdated: false,
        isPasswordUpdated: false,
      };

    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: true,
        message: "Profile updated successfully.",
      };

    case UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        isPasswordUpdated: true,
        message: "Password updated successfully.",
      };

    case UPDATE_PROFILE_FAIL:
    case UPDATE_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Forgot & Reset Password
    case FORGOT_PASSWORD_REQUEST:
    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
      };

    case FORGOT_PASSWORD_SUCCESS:
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };

    case FORGOT_PASSWORD_FAIL:
    case RESET_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    
    // Admin: Single User
    case SINGLE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case SINGLE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedUser: action.payload,
      };

    case SINGLE_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Admin: Update/Delete User
    case UPDATE_USER_ROLE_REQUEST:
    case DELETE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        isUpdated: false,
        isDeleted: false,
      };

    case UPDATE_USER_ROLE_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: true,
        message: "User role updated successfully.",
      };

    case DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: true,
        message: action.payload?.message || "User deleted successfully.",
      };

    case UPDATE_USER_ROLE_FAIL:
    case DELETE_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
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



export const allUsersReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case ALL_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ALL_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };

    case ALL_USERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};