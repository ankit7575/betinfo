import React, { useEffect } from "react";
import SignupSection from "../components/admin/SignupSection";

const Signup = () => {
  useEffect(() => {
    const reloadKey = 'signupPageAutoReloaded';
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, 'true');
      window.location.reload();
    }
  }, []);

  return (
    <>
      <SignupSection />
    </>
  );
};

export default Signup;
