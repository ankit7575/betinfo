import React from 'react';
import AdminPlanDashboard from './section/viewplan';
import AdminTransactionDashboard from './section/AdminTransactionDashboard';
 
const home = () => {
 
  return (
  <>
  <AdminPlanDashboard/>
  <AdminTransactionDashboard />
  </>
  );
};

export default home;
