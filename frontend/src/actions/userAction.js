import axios from "axios";
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
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  UPDATE_USER_ROLE_REQUEST,
  UPDATE_USER_ROLE_SUCCESS,
  UPDATE_USER_ROLE_FAIL,
  SINGLE_USER_REQUEST,
  SINGLE_USER_SUCCESS,
  SINGLE_USER_FAIL,
  CLEAR_ERRORS,
} from "../constants/userConstants.js";

// Get the base URL from the environment variable
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

// LOGIN
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_USER_REQUEST });

    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post(`${API_URL}/login`, { email, password }, config);

    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
    } else {
      console.warn('accessToken not found in login response:', data);
    }

    dispatch({ type: LOGIN_USER_SUCCESS, payload: data.user });
  } catch (error) {
    const message = getErrorMessage(error) || 'Login failed';
    dispatch({ type: LOGIN_USER_FAIL, payload: message });

    // Important: Throw error so UI components can catch and show message
    throw new Error(message);
  }
};

// REGISTER Action
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(`${API_URL}/register`, userData, config);

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
    } else {
      console.warn("accessToken not found in registration response", data);
    }

    dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
  } catch (error) {
    const errorMessage = getErrorMessage(error); // Extract backend error message

    dispatch({
      type: REGISTER_USER_FAIL,
      payload: errorMessage,
    });

    throw new Error(errorMessage); // 🔥 Rethrow so component can catch
  }
};


// LOAD USER
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    const config = getAuthConfig();
    const { data } = await axios.get(`${API_URL}/me`, config);

    dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: LOAD_USER_FAIL, payload: getErrorMessage(error) });
  }
};

// LOGOUT
export const logout = () => async (dispatch) => {
  try {
    await axios.get(`${API_URL}/logout`);

    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common["Authorization"];

    dispatch({ type: LOGOUT_USER });
  } catch (error) {
    dispatch({ type: LOGOUT_USER_FAIL, payload: getErrorMessage(error) });
  }
};

// FORGOT PASSWORD
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post(`${API_URL}/password/forgot`, { email }, config);

    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({ type: FORGOT_PASSWORD_FAIL, payload: getErrorMessage(error) });
  }
};

// RESET PASSWORD
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.put(`${API_URL}/password/reset/${token}`, passwords, config);

    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: RESET_PASSWORD_FAIL, payload: getErrorMessage(error) });
  }
};

// UPDATE PROFILE
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const config = getAuthConfig();
    config.headers["Content-Type"] = "multipart/form-data"; // Special header for multipart data

    const { data } = await axios.put(`${API_URL}/me/update`, userData, config);

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: UPDATE_PROFILE_FAIL, payload: getErrorMessage(error) });
  }
};

// UPDATE PASSWORD
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });

    const config = getAuthConfig();

    const { data } = await axios.put(`${API_URL}/password/update`, passwords, config);

    dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: UPDATE_PASSWORD_FAIL, payload: getErrorMessage(error) });
  }
};

// get All Users
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USERS_REQUEST });
    const config = getAuthConfig();

    const { data } = await axios.get(`${API_URL}/admin/users`, config);

    dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });
  } catch (error) {
    dispatch({ type: ALL_USERS_FAIL, payload: error.response.data.message });
  }
};



// GET SINGLE USER (Admin)
export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: SINGLE_USER_REQUEST });

    const config = getAuthConfig();

    const { data } = await axios.get(`${API_URL}/admin/user/${id}`, config);

    dispatch({ type: SINGLE_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: SINGLE_USER_FAIL, payload: getErrorMessage(error) });
  }
};

// UPDATE USER ROLE (Admin)
export const updateUserRole = (id, roleData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_ROLE_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.put(`${API_URL}/admin/user/${id}`, roleData, config);

    dispatch({ type: UPDATE_USER_ROLE_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: UPDATE_USER_ROLE_FAIL, payload: getErrorMessage(error) });
  }
};

// DELETE USER (Admin)
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const config = getAuthConfig();
    const { data } = await axios.delete(`${API_URL}/admin/user/${id}`, config);

    dispatch({ type: DELETE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: DELETE_USER_FAIL, payload: getErrorMessage(error) });
  }
};

// CLEAR ERRORS
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
