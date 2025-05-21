import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { loadUser, logout } from "../actions/userAction";

const ProtectedRoute = ({ children, role }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  const triedToLoadUser = useRef(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token && !isAuthenticated && !triedToLoadUser.current) {
      triedToLoadUser.current = true;
      dispatch(loadUser())
        .catch(() => dispatch(logout()))
        .finally(() => setInitialCheckDone(true));
    } else {
      setInitialCheckDone(true);
    }
  }, [dispatch, isAuthenticated]);

  if (loading || !initialCheckDone) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  if (role && user?.role !== role) {
    return <Navigate to="/unauthorized" replace />; // optional: show access denied page
  }

  // Redirect authenticated users away from login page
  if (location.pathname === "/login") {
    if (user?.role === "admin") return <Navigate to="/dashboard" replace />;
    if (user?.role === "user") return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
