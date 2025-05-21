import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Reducers
import { userReducer,  allUsersReducer } from '../reducers/userReducers';
import { matchReducer } from '../reducers/matchReducer';
import { planListReducer, planReducer } from '../reducers/planReducer';
import { transactionReducer } from '../reducers/transactionReducer';
import { coinReducer } from '../reducers/coinReducer';

// Combine reducers to form a root reducer
const rootReducer = combineReducers({
  allUsers: allUsersReducer,
  user: userReducer,
  coin: coinReducer,
  planList: planListReducer,
  planDetails: planReducer,
  transaction: transactionReducer,
  match: matchReducer,
});

// Initial state for the store (ensure any necessary data is populated here)
const initialState = {
  // Example:
  // user: { data: null, loading: false, error: null },
  // coin: { balance: 0 },
  // planList: [],
  // etc.
};

// Middleware for handling asynchronous actions
const middleware = [thunk];

// Create the store with rootReducer, initialState, and middleware
const store = createStore(
  rootReducer, // Root reducer that combines all individual reducers
  initialState, // Initial state object (you can populate this from localStorage or API responses)
  composeWithDevTools(applyMiddleware(...middleware)) // Enables Redux DevTools extension and apply middleware
);

export default store;
