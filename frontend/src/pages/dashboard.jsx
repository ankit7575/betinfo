import React from "react";
import Layout from "../components/dashboard/layouts/layout"; // Import your Layout component
import Home from "../components/dashboard/home/home"

const Dashboard = () =>{
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
