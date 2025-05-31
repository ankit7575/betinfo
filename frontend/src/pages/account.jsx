import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../actions/userAction.js"; // Import the loadUser action
import AccountPage from "../components/account/AccountPage";
import AppLayout from "../layout";
import Footer from "../components/Footer";

const Account = () => {
  const dispatch = useDispatch();

  // Access user data from the Redux state
  const { loading, user, isAuthenticated, error } = useSelector((state) => state.user);

  // Debugging - log the current state
  // console.log("Redux State:", { loading, user, isAuthenticated, error });

  // Auto-refresh logic (runs only once per tab session)
  useEffect(() => {
    const reloadKey = 'accountPageAutoReloaded';
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, 'true');
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(loadUser()); // Dispatch loadUser if not authenticated
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your account.</div>;
  }

  return (
    <>
      <AppLayout />
      <AccountPage user={user} />
      <Footer />
    </>
  );
};

export default Account;
