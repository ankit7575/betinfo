import React, { useEffect } from "react";
import Layout from "../components/dashboard/layouts/layout"; // Import your Layout component
import Home from "../components/dashboard/home/home"

const Dashboard = () => {
  useEffect(() => {
    const reloadKey = 'dashboardPageAutoReloaded';
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, 'true');
      window.location.reload();
    }
  }, []);

  return (
    <Layout userRole="admin">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <Home/>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
