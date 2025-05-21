// planReducer.js

import {
  ADD_PLAN_REQUEST,
  ADD_PLAN_SUCCESS,
  ADD_PLAN_FAIL,
  GET_ALL_PLANS_REQUEST,
  GET_ALL_PLANS_SUCCESS,
  GET_ALL_PLANS_FAIL,
  GET_PLAN_BY_ID_REQUEST,
  GET_PLAN_BY_ID_SUCCESS,
  GET_PLAN_BY_ID_FAIL,
  EDIT_PLAN_REQUEST,
  EDIT_PLAN_SUCCESS,
  EDIT_PLAN_FAIL,
  DELETE_PLAN_REQUEST,
  DELETE_PLAN_SUCCESS,
  DELETE_PLAN_FAIL,
  SELECT_PLAN_REQUEST,
  SELECT_PLAN_SUCCESS,
  SELECT_PLAN_FAIL,
  CHECK_PLAN_EXPIRATION_REQUEST,
  CHECK_PLAN_EXPIRATION_SUCCESS,
  CHECK_PLAN_EXPIRATION_FAIL,
  CLEAR_EXPIRED_PLANS_REQUEST,
  CLEAR_EXPIRED_PLANS_SUCCESS,
  CLEAR_EXPIRED_PLANS_FAIL,
} from "../constants/planConstants.js";

// Reducer to handle list of all plans (for UI like Plans.js)
export const planListReducer = (state = { plans: [], loading: false }, action) => {
  switch (action.type) {
    case GET_ALL_PLANS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_ALL_PLANS_SUCCESS:
      return { ...state, loading: false, plans: action.payload };
    case GET_ALL_PLANS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// General plan reducer to handle individual plan CRUD and extra actions
const initialState = {
  loading: false,
  plan: null,
  selectedPlan: null,
  isExpired: null,
  message: null,
  error: null,
  success: false,
  isDeleted: false,
  isUpdated: false,
};

export const planReducer = (state = initialState, action) => {
  switch (action.type) {
    // Requests
    case ADD_PLAN_REQUEST:
    case EDIT_PLAN_REQUEST:
    case DELETE_PLAN_REQUEST:
    case SELECT_PLAN_REQUEST:
    case CHECK_PLAN_EXPIRATION_REQUEST:
    case CLEAR_EXPIRED_PLANS_REQUEST:
    case GET_PLAN_BY_ID_REQUEST:
      return { ...state, loading: true, error: null, success: false, message: null };

    // Successes
    case ADD_PLAN_SUCCESS:
      return { ...state, loading: false, success: true, plan: action.payload, message: "Plan added successfully." };
    case GET_PLAN_BY_ID_SUCCESS:
      return { ...state, loading: false, plan: action.payload };
    case EDIT_PLAN_SUCCESS:
      return { ...state, loading: false, isUpdated: true, message: "Plan updated successfully." };
    case DELETE_PLAN_SUCCESS:
      return { ...state, loading: false, isDeleted: true, message: action.payload };
    case SELECT_PLAN_SUCCESS:
      return { ...state, loading: false, selectedPlan: action.payload };
    case CHECK_PLAN_EXPIRATION_SUCCESS:
      return { ...state, loading: false, isExpired: action.payload };
    case CLEAR_EXPIRED_PLANS_SUCCESS:
      return { ...state, loading: false, success: true, message: action.payload };

    // Fails
    case ADD_PLAN_FAIL:
    case EDIT_PLAN_FAIL:
    case DELETE_PLAN_FAIL:
    case SELECT_PLAN_FAIL:
    case CHECK_PLAN_EXPIRATION_FAIL:
    case CLEAR_EXPIRED_PLANS_FAIL:
    case GET_PLAN_BY_ID_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
