import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from './actions/userAction';
import ProtectedRoute from './auth/ProtectedRoute';
// Lazily loaded pages/components
const Home = lazy(() => import('./pages/Home'));
const Demo = lazy(() => import('./pages/demo'));
const RedeemCoinPage = lazy(() => import('./pages/RedeemCoinPage'));
const TransactionPage = lazy(() => import('./pages/TransactionPage'));
const Scoreboard = lazy(() => import('./pages/Scoreboard.jsx'));

const BetfairData = lazy(() => import('./components/Matchdashboard/BetfairData'));
const Payment = lazy(() => import('./pages/Payments.jsx'));
const Aboutus = lazy(() => import('./pages/aboutUs'));
const Contact = lazy(() => import('./pages/Contact'));
const Join = lazy(() => import('./pages/joinus'));
const Login = lazy(() => import('./pages/login'));
const Account = lazy(() => import('./pages/account'));
const Signup = lazy(() => import('./pages/signup'));
const ActivationKey = lazy(() => import('./pages/ActivationKey'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Transactionsection = lazy(() => import('./components/account/section/Transactionsection'));
const MatchDataPage = lazy(() => import('./components/Matchdashboard/Matchdatapage.jsx'));
const PageNotFound = lazy(() => import('./pages/Pagenotfound.jsx'));
const ViewTip = lazy(() => import('./pages/ViewTip.jsx'));
const SoccerTip = lazy(() => import('./pages/SoccerTip.jsx'));
const TennisTip = lazy(() => import('./pages/TennisTip.jsx'));

const MatchOddsTable  = lazy(() => import('./pages/MatchOddsTable.jsx'));
// Betfair (Correct based on pages/betfair)
const Adddata = lazy(() => import('./components/dashboard/pages/ods/Adddata'));
const EditBetfair = lazy(() => import('./components/dashboard/pages/ods/Editbetfair'));
const ViewAllBetfair = lazy(() => import('./components/dashboard/pages/ods/Viewallbetfair'));
const ViewAllMatches = lazy(() => import('./components/dashboard/pages/ods/viewallmatches'));

// Keys & Coins (Correct based on pages/keys-coins)
const RedeemSharedUser = lazy(() => import('./components/dashboard/pages/keys-coins/redeemshareduser'));
const ViewUserKeysCoins = lazy(() => import('./components/dashboard/pages/keys-coins/ViewUserKeysCoins'));

// Management (Correct based on pages/management)
const AllUsers = lazy(() => import('./components/dashboard/pages/management/AllUsers'));

// Plans (Correct based on pages/plans)
const PlansData = lazy(() => import('./components/dashboard/pages/plans/PlansData'));

// Transactions (Correct based on pages/transactions)
const AllTransactions = lazy(() => import('./components/dashboard/pages/transactions/Alltransactions'));
// ---- LEGAL PAGES (add these!) ----
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
  }, [dispatch, user]);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
<Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/betfair-data/:marketId" element={<BetfairData />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<logout />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/activation-key" element={<ActivationKey />} />
          <Route path="/transaction" element={<Transactionsection />} />
          <Route path="/redeem" element={<RedeemCoinPage  />} />
          <Route path="/transaction-status" element={<TransactionPage  />} />
          
          <Route path="*" element={<PageNotFound />} />
          <Route path="/payment"  element={
              <ProtectedRoute isAdmin={false} requiredRole={['user, admin']}>
                <Payment />
              </ProtectedRoute>
            } />
             <Route path="/matchoddstable"  element={
              <ProtectedRoute isAdmin={false} requiredRole={['user, admin']}>
                <MatchOddsTable />
              </ProtectedRoute>
            } />
          
          {/* Protected User Routes */}
          <Route
            path="/account"
            element={
              <ProtectedRoute isAdmin={false} requiredRole={['user']}>
                <Account />
              </ProtectedRoute>
            }
          />
           <Route
            path="/scoreboard"
            element={
              <ProtectedRoute isAdmin={false} requiredRole={['user']}>
                <Scoreboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/match/:eventId"
            element={
              <ProtectedRoute isAdmin={false} requiredRole={['user']}>
                <MatchDataPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />

         {/* Dashboard: Betfair */}
<Route
  path="/dashboard/odds/add-data"
  element={
    <ProtectedRoute requiredRole={['admin']}>
      <Adddata />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/odds/edit/:id"
  element={
    <ProtectedRoute requiredRole={['admin']}>
      <EditBetfair />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/odds/view-all"
  element={
    <ProtectedRoute requiredRole={['admin']}>
      <ViewAllBetfair />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/odds/view-matches"
  element={
    <ProtectedRoute requiredRole={['admin']}>
      <ViewAllMatches />
    </ProtectedRoute>
  }
/>

{/* Dashboard: Management */}
<Route
  path="/dashboard/management/view-users"
  element={
    <ProtectedRoute requiredRole={['admin']}>
      <AllUsers />
    </ProtectedRoute>
  }
/>

{/* Dashboard: Plans */}
<Route
  path="/dashboard/plans/view-all"
  element={
    <ProtectedRoute requiredRole={['admin']}>
      <PlansData />
    </ProtectedRoute>
  }
/>

{/* Dashboard: Transactions */}
<Route
  path="/dashboard/transactions/view-all"
  element={
    <ProtectedRoute requiredRole={['admin']}>
      <AllTransactions />
    </ProtectedRoute>
  }
/>
{/* Dashboard: Transactions */}
<Route
  path="/dashboard/key/view-all-share-coin-user"
  element={
    <ProtectedRoute requiredRole={['admin']}>
      <RedeemSharedUser />
    </ProtectedRoute>
  }
/>
{/* Dashboard: Transactions */}
<Route
  path="/dashboard/key/view-all-coin-user"
  element={
    <ProtectedRoute requiredRole={['admin']}>
      <ViewUserKeysCoins />
    </ProtectedRoute>
  }
/>
<Route
            path="/viewtip"
            element={
              <ProtectedRoute isAdmin={false} requiredRole={['user']}>
                <ViewTip />
              </ProtectedRoute>
            }
          />
          <Route
            path="/soccertip"
            element={
              <ProtectedRoute isAdmin={false} requiredRole={['user']}>
                <SoccerTip />
              </ProtectedRoute>
            }
          />
                 <Route
            path="/tennisTip"
            element={
              <ProtectedRoute isAdmin={false} requiredRole={['user']}>
                <TennisTip />
              </ProtectedRoute>
            }
          />


        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
