// actionTypes.js

// Action types for fetching all matches
export const GET_MATCHES_REQUEST = 'GET_MATCHES_REQUEST';  // Request to fetch all matches
export const GET_MATCHES_SUCCESS = 'GET_MATCHES_SUCCESS';  // Successful fetch of all matches
export const GET_MATCHES_FAIL = 'GET_MATCHES_FAIL';        // Failed attempt to fetch all matches

// Action types for fetching a match by its event ID
export const GET_MATCH_BY_ID_REQUEST = 'GET_MATCH_BY_ID_REQUEST';  // Request to fetch match by event ID
export const GET_MATCH_BY_ID_SUCCESS = 'GET_MATCH_BY_ID_SUCCESS';  // Successful fetch of match data by event ID
export const GET_MATCH_BY_ID_FAIL = 'GET_MATCH_BY_ID_FAIL';        // Failed attempt to fetch match by event ID

// Action types for fetching the status of a match
export const GET_MATCH_STATUS_REQUEST = 'GET_MATCH_STATUS_REQUEST';  // Request to fetch match status
export const GET_MATCH_STATUS_SUCCESS = 'GET_MATCH_STATUS_SUCCESS';  // Successful fetch of match status
export const GET_MATCH_STATUS_FAIL = 'GET_MATCH_STATUS_FAIL';        // Failed attempt to fetch match status

// Action types for fetching Betfair data for a runner (specific match selection)
export const GET_BETFAIR_DATA_REQUEST = 'GET_BETFAIR_DATA_REQUEST';  // Request to fetch Betfair data for a runner
export const GET_BETFAIR_DATA_SUCCESS = 'GET_BETFAIR_DATA_SUCCESS';  // Successful fetch of Betfair data for a runner
export const GET_BETFAIR_DATA_FAIL = 'GET_BETFAIR_DATA_FAIL';        // Failed attempt to fetch Betfair data for a runner

// Action types for fetching Betfair data by selection ID
export const GET_BETFAIR_DATA_BY_SELECTION_ID_REQUEST = 'GET_BETFAIR_DATA_BY_SELECTION_ID_REQUEST';  // Request to fetch Betfair data by selection ID
export const GET_BETFAIR_DATA_BY_SELECTION_ID_SUCCESS = 'GET_BETFAIR_DATA_BY_SELECTION_ID_SUCCESS';  // Successful fetch of Betfair data by selection ID
export const GET_BETFAIR_DATA_BY_SELECTION_ID_FAIL = 'GET_BETFAIR_DATA_BY_SELECTION_ID_FAIL';        // Failed attempt to fetch Betfair data by selection ID

// Action types for fetching match runner data by selection ID
export const GET_MATCH_RUNNER_BY_SELECTION_ID_REQUEST = 'GET_MATCH_RUNNER_BY_SELECTION_ID_REQUEST';
export const GET_MATCH_RUNNER_BY_SELECTION_ID_SUCCESS = 'GET_MATCH_RUNNER_BY_SELECTION_ID_SUCCESS';
export const GET_MATCH_RUNNER_BY_SELECTION_ID_FAIL = 'GET_MATCH_RUNNER_BY_SELECTION_ID_FAIL';

export const CLEAR_ERRORS = "CLEAR_ERRORS";