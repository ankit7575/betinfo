import React, { useEffect } from "react";
import Plans from "../components/Plans";

const Payments = () => {
  useEffect(() => {
    const reloadKey = 'paymentsPageAutoReloaded';
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, 'true');
      window.location.reload();
    }
  }, []);

  return (
    <>
      <Plans />
    </>
  );
};

export default Payments;
