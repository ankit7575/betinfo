import React from 'react';
import Layout from "../../layouts/layout"; // Import your Layout component
import Section from "./section"
const AllUsers = () => {
 
  return (
  <>
    <Layout userRole="admin">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
          <Section/>
          </div>
        </div>
      </div>
    </Layout>
  </>
  );
};

export default AllUsers;

