import {
  GET_MATCHES_REQUEST,
  GET_MATCHES_SUCCESS,
  GET_MATCHES_FAIL,

  GET_MATCH_BY_ID_REQUEST,
  GET_MATCH_BY_ID_SUCCESS,
  GET_MATCH_BY_ID_FAIL,

  // Tennis
  GET_TENNIS_MATCHES_REQUEST,
  GET_TENNIS_MATCHES_SUCCESS,
  GET_TENNIS_MATCHES_FAIL,

  // Soccer
  GET_SOCCER_MATCHES_REQUEST,
  GET_SOCCER_MATCHES_SUCCESS,
  GET_SOCCER_MATCHES_FAIL,

  GET_BETFAIR_ODDS_FOR_RUNNER_REQUEST,
  GET_BETFAIR_ODDS_FOR_RUNNER_SUCCESS,
  GET_BETFAIR_ODDS_FOR_RUNNER_FAIL,

  GET_SCOREBOARD_BY_EVENT_ID_REQUEST,
  GET_SCOREBOARD_BY_EVENT_ID_SUCCESS,
  GET_SCOREBOARD_BY_EVENT_ID_FAIL,

  GET_MATCH_DETAILS_WITH_TIP_REQUEST,
  GET_MATCH_DETAILS_WITH_TIP_SUCCESS,
  GET_MATCH_DETAILS_WITH_TIP_FAIL,

  MANAGE_USER_INVESTMENT_REQUEST,
  MANAGE_USER_INVESTMENT_SUCCESS,
  MANAGE_USER_INVESTMENT_FAIL,

  AUTO_CALCULATE_ADMIN_BETFAIR_ODDS_REQUEST,
  AUTO_CALCULATE_ADMIN_BETFAIR_ODDS_SUCCESS,
  AUTO_CALCULATE_ADMIN_BETFAIR_ODDS_FAIL,

  UPDATE_ADMIN_LAYING_DATA_REQUEST,
  UPDATE_ADMIN_LAYING_DATA_SUCCESS,
  UPDATE_ADMIN_LAYING_DATA_FAIL,

  VIEW_ADMIN_LAYING_DATA_FOR_RUNNER_LATEST_REQUEST,
  VIEW_ADMIN_LAYING_DATA_FOR_RUNNER_LATEST_SUCCESS,
  VIEW_ADMIN_LAYING_DATA_FOR_RUNNER_LATEST_FAIL,

  VIEW_ADMIN_LAYING_DATA_FOR_RUNNER_HISTORY_REQUEST,
  VIEW_ADMIN_LAYING_DATA_FOR_RUNNER_HISTORY_SUCCESS,
  VIEW_ADMIN_LAYING_DATA_FOR_RUNNER_HISTORY_FAIL,

  EDIT_ADMIN_LAYING_DATA_FOR_RUNNER_REQUEST,
  EDIT_ADMIN_LAYING_DATA_FOR_RUNNER_SUCCESS,
  EDIT_ADMIN_LAYING_DATA_FOR_RUNNER_FAIL,

  DELETE_ADMIN_LAYING_DATA_FOR_RUNNER_REQUEST,
  DELETE_ADMIN_LAYING_DATA_FOR_RUNNER_SUCCESS,
  DELETE_ADMIN_LAYING_DATA_FOR_RUNNER_FAIL,

  GENERATE_AUTO_ODDS_REQUEST,
  GENERATE_AUTO_ODDS_SUCCESS,
  GENERATE_AUTO_ODDS_FAIL,

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

  // Admin select/unselect and admin status
  UPDATE_MATCH_SELECTED_STATUS_REQUEST,
  UPDATE_MATCH_SELECTED_STATUS_SUCCESS,
  UPDATE_MATCH_SELECTED_STATUS_FAIL,

  UPDATE_MATCH_ADMIN_STATUS_REQUEST,
  UPDATE_MATCH_ADMIN_STATUS_SUCCESS,
  UPDATE_MATCH_ADMIN_STATUS_FAIL,

  CLEAR_ERRORS,
} from "../constants/matchConstants";

const initialState = {
  matches: [],
  match: null,
  odds: null,
  tennisMatches: [],
  soccerMatches: [],
  scoreboard: null,
  matchDetails: null,
  userInvestment: null,
  userOddsAndInvestment: null,
  adminBetfairOdds: null,
  layingDataForRunnerLatest: null,
  layingDataForRunnerHistory: null,
  loading: false,
  error: null,
};

export const matchReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MATCHES_REQUEST:
    case GET_MATCH_BY_ID_REQUEST:
    case GET_BETFAIR_ODDS_FOR_RUNNER_REQUEST:
    case GET_SCOREBOARD_BY_EVENT_ID_REQUEST:
    case GET_MATCH_DETAILS_WITH_TIP_REQUEST:
    case MANAGE_USER_INVESTMENT_REQUEST:
    case AUTO_CALCULATE_ADMIN_BETFAIR_ODDS_REQUEST:
    case UPDATE_ADMIN_LAYING_DATA_REQUEST:
    case EDIT_ADMIN_LAYING_DATA_FOR_RUNNER_REQUEST:
    case DELETE_ADMIN_LAYING_DATA_FOR_RUNNER_REQUEST:
    case VIEW_ADMIN_LAYING_DATA_FOR_RUNNER_LATEST_REQUEST:
    case VIEW_ADMIN_LAYING_DATA_FOR_RUNNER_HISTORY_REQUEST:
    case GENERATE_AUTO_ODDS_REQUEST:
    case ADD_ADMIN_BETFAIR_ODDS_REQUEST:
    case GET_USER_MATCH_ODDS_INVESTMENT_REQUEST:
    case USER_UPDATE_ODDS_REQUEST:
    case USER_ADD_INVESTMENT_REQUEST:
    case GET_TENNIS_MATCHES_REQUEST:
    case GET_SOCCER_MATCHES_REQUEST:
    case UPDATE_MATCH_SELECTED_STATUS_REQUEST:
    case UPDATE_MATCH_ADMIN_STATUS_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_MATCHES_SUCCESS:
      return { ...state, loading: false, matches: action.payload };

    case GET_MATCH_BY_ID_SUCCESS:
      return { ...state, loading: false, match: action.payload };

    case GET_BETFAIR_ODDS_FOR_RUNNER_SUCCESS:
    case GENERATE_AUTO_ODDS_SUCCESS:
      return { ...state, loading: false, odds: action.payload };

    case GET_SCOREBOARD_BY_EVENT_ID_SUCCESS:
      return { ...state, loading: false, scoreboard: action.payload };

    case GET_MATCH_DETAILS_WITH_TIP_SUCCESS:
      return { ...state, loading: false, matchDetails: action.payload };

    case MANAGE_USER_INVESTMENT_SUCCESS:
    case USER_ADD_INVESTMENT_SUCCESS:
      return { ...state, loading: false, userInvestment: action.payload };

    case AUTO_CALCULATE_ADMIN_BETFAIR_ODDS_SUCCESS:
    case ADD_ADMIN_BETFAIR_ODDS_SUCCESS:
      return { ...state, loading: false, adminBetfairOdds: action.payload };

    case UPDATE_ADMIN_LAYING_DATA_SUCCESS:
    case EDIT_ADMIN_LAYING_DATA_FOR_RUNNER_SUCCESS:
      return { ...state, loading: false, layingDataForRunnerLatest: action.payload };

    case DELETE_ADMIN_LAYING_DATA_FOR_RUNNER_SUCCESS:
      return { ...state, loading: false, layingDataForRunnerLatest: null };

    case VIEW_ADMIN_LAYING_DATA_FOR_RUNNER_LATEST_SUCCESS:
      return { ...state, loading: false, layingDataForRunnerLatest: action.payload };

    case VIEW_ADMIN_LAYING_DATA_FOR_RUNNER_HISTORY_SUCCESS:
      return { ...state, loading: false, layingDataForRunnerHistory: action.payload };

    case GET_USER_MATCH_ODDS_INVESTMENT_SUCCESS:
      return { ...state, loading: false, userOddsAndInvestment: action.payload };

    case USER_UPDATE_ODDS_SUCCESS:
      return { ...state, loading: false };

    // Tennis Matches
    case GET_TENNIS_MATCHES_SUCCESS:
      return { ...state, loading: false, tennisMatches: action.payload };

    case GET_TENNIS_MATCHES_FAIL:
      return { ...state, loading: false, error: action.payload };

    // Soccer Matches
    case GET_SOCCER_MATCHES_SUCCESS:
      return { ...state, loading: false, soccerMatches: action.payload };

    case GET_SOCCER_MATCHES_FAIL:
      return { ...state, loading: false, error: action.payload };

    // Admin: select/unselect match
    case UPDATE_MATCH_SELECTED_STATUS_SUCCESS:
      // Optionally update state.matches if needed
      return { ...state, loading: false };
    case UPDATE_MATCH_SELECTED_STATUS_FAIL:
      return { ...state, loading: false, error: action.payload };

    // Admin: set admin status
    case UPDATE_MATCH_ADMIN_STATUS_SUCCESS:
      // Optionally update state.matches if needed
      return { ...state, loading: false };
    case UPDATE_MATCH_ADMIN_STATUS_FAIL:
      return { ...state, loading: false, error: action.payload };

    // Generic Fails
    case GET_MATCHES_FAIL:
    case GET_MATCH_BY_ID_FAIL:
    case GET_BETFAIR_ODDS_FOR_RUNNER_FAIL:
    case GET_SCOREBOARD_BY_EVENT_ID_FAIL:
    case GET_MATCH_DETAILS_WITH_TIP_FAIL:
    case MANAGE_USER_INVESTMENT_FAIL:
    case AUTO_CALCULATE_ADMIN_BETFAIR_ODDS_FAIL:
    case UPDATE_ADMIN_LAYING_DATA_FAIL:
    case EDIT_ADMIN_LAYING_DATA_FOR_RUNNER_FAIL:
    case DELETE_ADMIN_LAYING_DATA_FOR_RUNNER_FAIL:
    case VIEW_ADMIN_LAYING_DATA_FOR_RUNNER_LATEST_FAIL:
    case VIEW_ADMIN_LAYING_DATA_FOR_RUNNER_HISTORY_FAIL:
    case GENERATE_AUTO_ODDS_FAIL:
    case ADD_ADMIN_BETFAIR_ODDS_FAIL:
    case GET_USER_MATCH_ODDS_INVESTMENT_FAIL:
    case USER_UPDATE_ODDS_FAIL:
    case USER_ADD_INVESTMENT_FAIL:
      return { ...state, loading: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};
