import React, { useEffect } from "react";
import LoginSection from "../components/admin/loginsention";

const Login = () => {
  useEffect(() => {
    const reloadKey = 'loginPageAutoReloaded';
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, 'true');
      window.location.reload();
    }
  }, []);

  return (
    <>
      <LoginSection />
    </>
  );
};

export default Login;
