import axios from "axios";
import {
  GET_ALL_PLANS_REQUEST,
  GET_ALL_PLANS_SUCCESS,
  GET_ALL_PLANS_FAIL,
  GET_PLAN_BY_ID_REQUEST,
  GET_PLAN_BY_ID_SUCCESS,
  GET_PLAN_BY_ID_FAIL,
  ADD_PLAN_REQUEST,
  ADD_PLAN_SUCCESS,
  ADD_PLAN_FAIL,
  EDIT_PLAN_REQUEST,
  EDIT_PLAN_SUCCESS,
  EDIT_PLAN_FAIL,
  DELETE_PLAN_REQUEST,
  DELETE_PLAN_SUCCESS,
  DELETE_PLAN_FAIL,
  SELECT_PLAN_REQUEST,
  SELECT_PLAN_SUCCESS,
  SELECT_PLAN_FAIL,
  CLEAR_EXPIRED_PLANS_REQUEST,
  CLEAR_EXPIRED_PLANS_SUCCESS,
  CLEAR_EXPIRED_PLANS_FAIL,
} from "../constants/planConstants.js";

const API_URL = process.env.REACT_APP_API_URL;

// Get token from localStorage
const getToken = () => localStorage.getItem("accessToken");

// Set headers
const getAuthConfig = () => ({
  headers: {
    Authorization: getToken() ? `Bearer ${getToken()}` : "",
    "Content-Type": "application/json",
  },
});

// Extract error message
const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "An unexpected error occurred";

// Get all plans
export const getAllPlans = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_PLANS_REQUEST });

    const { data } = await axios.get(`${API_URL}/plans`, getAuthConfig());

    dispatch({
      type: GET_ALL_PLANS_SUCCESS,
      payload: data.plans || data,
    });
  } catch (error) {
    dispatch({
      type: GET_ALL_PLANS_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// Get plan by ID
export const getPlanById = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_PLAN_BY_ID_REQUEST });

    const { data } = await axios.get(`${API_URL}/plans/${id}`, getAuthConfig());

    dispatch({
      type: GET_PLAN_BY_ID_SUCCESS,
      payload: data.plan || data,
    });
  } catch (error) {
    dispatch({
      type: GET_PLAN_BY_ID_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// Add a new plan
export const addPlan = (planData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_PLAN_REQUEST });

    const { name, description, price, totalCoins } = planData;

    if (!name || !description || !price || !totalCoins) {
      return dispatch({
        type: ADD_PLAN_FAIL,
        payload: "Please provide all required fields.",
      });
    }

    if (typeof totalCoins !== "number" || totalCoins <= 0) {
      return dispatch({
        type: ADD_PLAN_FAIL,
        payload: "Total coins must be a positive number.",
      });
    }

    const { data } = await axios.post(`${API_URL}/plans/add`, planData, getAuthConfig());

    dispatch({
      type: ADD_PLAN_SUCCESS,
      payload: data.plan || data,
    });
  } catch (error) {
    dispatch({
      type: ADD_PLAN_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// Edit a plan
export const editPlan = (id, planData) => async (dispatch) => {
  try {
    dispatch({ type: EDIT_PLAN_REQUEST });

    const { data } = await axios.put(`${API_URL}/plans/${id}`, planData, getAuthConfig());

    dispatch({
      type: EDIT_PLAN_SUCCESS,
      payload: data.plan || data,
    });
  } catch (error) {
    dispatch({
      type: EDIT_PLAN_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// Delete a plan
export const deletePlan = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PLAN_REQUEST });

    const { data } = await axios.delete(`${API_URL}/plans/${id}`, getAuthConfig());

    dispatch({
      type: DELETE_PLAN_SUCCESS,
      payload: data.message || id, // Use message if available
    });
  } catch (error) {
    dispatch({
      type: DELETE_PLAN_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// Select a plan
export const selectPlan = (planData) => async (dispatch) => {
  try {
    dispatch({ type: SELECT_PLAN_REQUEST });

    const { data } = await axios.post(`${API_URL}/plans/select`, planData, getAuthConfig());

    dispatch({
      type: SELECT_PLAN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SELECT_PLAN_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// Clear expired plans
export const clearExpiredPlans = () => async (dispatch) => {
  try {
    dispatch({ type: CLEAR_EXPIRED_PLANS_REQUEST });

    const { data } = await axios.delete(`${API_URL}/plans/clear-expired`, getAuthConfig());

    dispatch({
      type: CLEAR_EXPIRED_PLANS_SUCCESS,
      payload: data.message || data,
    });
  } catch (error) {
    dispatch({
      type: CLEAR_EXPIRED_PLANS_FAIL,
      payload: getErrorMessage(error),
    });
  }
};
