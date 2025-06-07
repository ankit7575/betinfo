import axios from 'axios';
import {
  GET_MATCHES_REQUEST,
  GET_MATCHES_SUCCESS,
  GET_MATCHES_FAIL,
  GET_MATCH_BY_ID_REQUEST,
  GET_MATCH_BY_ID_SUCCESS,
  GET_MATCH_BY_ID_FAIL,
  GET_BETFAIR_ODDS_FOR_RUNNER_REQUEST,
  GET_BETFAIR_ODDS_FOR_RUNNER_SUCCESS,
  GET_BETFAIR_ODDS_FOR_RUNNER_FAIL,
  GET_SCOREBOARD_BY_EVENT_ID_REQUEST,
  GET_SCOREBOARD_BY_EVENT_ID_SUCCESS,
  GET_SCOREBOARD_BY_EVENT_ID_FAIL,
  GET_MATCH_DETAILS_WITH_TIP_REQUEST,
  GET_MATCH_DETAILS_WITH_TIP_SUCCESS,
  GET_MATCH_DETAILS_WITH_TIP_FAIL,
  ADD_ADMIN_BETFAIR_ODDS_REQUEST,
  ADD_ADMIN_BETFAIR_ODDS_SUCCESS,
  ADD_ADMIN_BETFAIR_ODDS_FAIL,
  GET_USER_MATCH_ODDS_INVESTMENT_REQUEST,
  GET_USER_MATCH_ODDS_INVESTMENT_SUCCESS,
  GET_USER_MATCH_ODDS_INVESTMENT_FAIL,
  USER_UPDATE_ODDS_REQUEST,
  USER_UPDATE_ODDS_SUCCESS,
  USER_UPDATE_ODDS_FAIL,
  USER_ADD_INVESTMENT_REQUEST,
  USER_ADD_INVESTMENT_SUCCESS,
  USER_ADD_INVESTMENT_FAIL,
  CLEAR_ERRORS,
      GET_TENNIS_MATCHES_REQUEST,
    GET_TENNIS_MATCHES_SUCCESS,
    GET_TENNIS_MATCHES_FAIL,
    
  GET_SOCCER_MATCHES_REQUEST,
  GET_SOCCER_MATCHES_SUCCESS,
  GET_SOCCER_MATCHES_FAIL,

  UPDATE_MATCH_SELECTED_STATUS_REQUEST,
  UPDATE_MATCH_SELECTED_STATUS_SUCCESS,
  UPDATE_MATCH_SELECTED_STATUS_FAIL,

  UPDATE_MATCH_ADMIN_STATUS_REQUEST,
  UPDATE_MATCH_ADMIN_STATUS_SUCCESS,
  UPDATE_MATCH_ADMIN_STATUS_FAIL,
} from '../constants/matchConstants';

const API_URL = process.env.REACT_APP_API_URL;

const getToken = () => localStorage.getItem('accessToken');

const getAuthConfig = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || 'An error occurred';

// ✅ 1. Get All Matches
export const getMatches = (sportId) => async (dispatch) => {
  try {
    dispatch({ type: GET_MATCHES_REQUEST });
    const { data } = await axios.get(`${API_URL}/matches/${sportId}`, getAuthConfig());
    dispatch({ type: GET_MATCHES_SUCCESS, payload: data?.data || [] });
  } catch (error) {
    dispatch({ type: GET_MATCHES_FAIL, payload: getErrorMessage(error) });
  }
};

export const getTennisMatches = () => async (dispatch) => {
  try {
    dispatch({ type: GET_TENNIS_MATCHES_REQUEST });
    const { data } = await axios.get(`${API_URL}/tennis`, getAuthConfig());
    dispatch({ type: GET_TENNIS_MATCHES_SUCCESS, payload: data?.data || [] });
  } catch (error) {
    dispatch({ type: GET_TENNIS_MATCHES_FAIL, payload: getErrorMessage(error) });
  }
};
// Get soccer matches
export const getSoccerMatches = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SOCCER_MATCHES_REQUEST });
    const { data } = await axios.get(`${API_URL}/soccer`, getAuthConfig());
    dispatch({ type: GET_SOCCER_MATCHES_SUCCESS, payload: data?.data || [] });
  } catch (error) {
    dispatch({ type: GET_SOCCER_MATCHES_FAIL, payload: error?.response?.data?.message || error.message });
  }
};

// Admin: update match selected/unselected
export const updateMatchSelectedStatus = ({ eventId, selected }) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_MATCH_SELECTED_STATUS_REQUEST });
    const { data } = await axios.post(
      `${API_URL}/update-selected`,
      { eventId, selected },
      getAuthConfig()
    );
    dispatch({ type: UPDATE_MATCH_SELECTED_STATUS_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: UPDATE_MATCH_SELECTED_STATUS_FAIL,
      payload: error?.response?.data?.message || error.message,
    });
  }
};

// Admin: update admin status for a match
export const updateMatchAdminStatus = ({ eventId, adminStatus }) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_MATCH_ADMIN_STATUS_REQUEST });
    const { data } = await axios.post(
      `${API_URL}/update-admin-status`, // <-- use correct endpoint!
      { eventId, adminStatus },
      getAuthConfig()
    );
    dispatch({ type: UPDATE_MATCH_ADMIN_STATUS_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: UPDATE_MATCH_ADMIN_STATUS_FAIL,
      payload: error?.response?.data?.message || error.message,
    });
  }
};

// ✅ 2. Get Match by ID
export const getMatchById = (eventId, userId) => async (dispatch) => {
  try {
    dispatch({ type: GET_MATCH_BY_ID_REQUEST });
    const { data } = await axios.get(`${API_URL}/match/${eventId}`, {
      ...getAuthConfig(),
      params: { userId }
    });
    dispatch({ type: GET_MATCH_BY_ID_SUCCESS, payload: data?.data || {} });
  } catch (error) {
    dispatch({ type: GET_MATCH_BY_ID_FAIL, payload: getErrorMessage(error) });
  }
};

// ✅ 1. Trigger Betfair Odds Streaming
export const getBetfairOddsForRunner = (eventId, userId) => async (dispatch) => {
  try {
    dispatch({ type: GET_BETFAIR_ODDS_FOR_RUNNER_REQUEST });

    // 🔁 Just trigger backend to start 0.5s emit loop
    const { data } = await axios.get(`${API_URL}/betfair-odds/${eventId}`, {
      ...getAuthConfig(),
      params: { userId }
    });

    dispatch({
      type: GET_BETFAIR_ODDS_FOR_RUNNER_SUCCESS,
      payload: { triggered: true, message: data?.message },
    });

    return { payload: data?.message };

  } catch (error) {
    dispatch({
      type: GET_BETFAIR_ODDS_FOR_RUNNER_FAIL,
      payload: getErrorMessage(error),
    });

    return { payload: null };
  }
};

// ✅ 2. Trigger Scoreboard Streaming
export const getScoreboardByEventId = (eventId) => async (dispatch) => {
  try {
    dispatch({ type: GET_SCOREBOARD_BY_EVENT_ID_REQUEST });

    // 🔁 Just trigger backend to start scoreboard interval
    const { data } = await axios.get(`${API_URL}/scoreboard/${eventId}`, getAuthConfig());

    dispatch({
      type: GET_SCOREBOARD_BY_EVENT_ID_SUCCESS,
      payload: { triggered: true, message: data?.message },
    });

  } catch (error) {
    dispatch({
      type: GET_SCOREBOARD_BY_EVENT_ID_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// ✅ 5. Get Match Details with Tips
export const getMatchDetailsWithTip = (eventId) => async (dispatch) => {
  try {
    dispatch({ type: GET_MATCH_DETAILS_WITH_TIP_REQUEST });
    const { data } = await axios.get(`${API_URL}/match-details/${eventId}`, getAuthConfig());
    dispatch({ type: GET_MATCH_DETAILS_WITH_TIP_SUCCESS, payload: data?.data || {} });
  } catch (error) {
    dispatch({ type: GET_MATCH_DETAILS_WITH_TIP_FAIL, payload: getErrorMessage(error) });
  }
};

// ✅ 6. Add Admin Betfair Odds
export const addAdminBetfairOdds = (eventId, selectionId, oddsData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_ADMIN_BETFAIR_ODDS_REQUEST });
    const { data } = await axios.post(
      `${API_URL}/admin/match/${eventId}/runner/${selectionId}/odds`,
      oddsData,
      getAuthConfig()
    );
    dispatch({ type: ADD_ADMIN_BETFAIR_ODDS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ADD_ADMIN_BETFAIR_ODDS_FAIL, payload: getErrorMessage(error) });
  }
};

// ✅ 7. Get User Match Odds and Investment
export const getUserMatchOddsAndInvestment = (eventId) => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_MATCH_ODDS_INVESTMENT_REQUEST });
    const { data } = await axios.get(`${API_URL}/match/${eventId}/my-odds`, getAuthConfig());
    dispatch({ type: GET_USER_MATCH_ODDS_INVESTMENT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_USER_MATCH_ODDS_INVESTMENT_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// ✅ 8. Update User Odds (Optional feature)
export const updateUserOddsWithHistory = (
  eventId,
  selectionId,
  newLayValue,
  newLayAmount,
  newLayProfit
) => async (dispatch) => {
  try {
    dispatch({ type: USER_UPDATE_ODDS_REQUEST });
    const { data } = await axios.post(
      `${API_URL}/match/${eventId}/my-odds`,
      { selectionId, newLayValue, newLayAmount, newLayProfit },
      getAuthConfig()
    );
    dispatch({ type: USER_UPDATE_ODDS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USER_UPDATE_ODDS_FAIL, payload: getErrorMessage(error) });
  }
};

// ✅ 9. Add User Investment
export const userAddInvestment = (eventId, amount) => async (dispatch) => {
  try {
    dispatch({ type: USER_ADD_INVESTMENT_REQUEST });
    const { data } = await axios.post(
      `${API_URL}/match/${eventId}/user/investment`,
      { amount },
      getAuthConfig()
    );
    dispatch({ type: USER_ADD_INVESTMENT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_ADD_INVESTMENT_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// ✅ 10. Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
