import React, { useState } from "react";
import { GiCricketBat, GiSoccerBall, GiTennisRacket } from "react-icons/gi";
import AdminCricketTable from "./AdminCricketTable"; // Your cricket admin table (see below)
import AdminSoccerTable from "./AdminSoccerTable";   // Your soccer admin table (see below)
import AdminTennisTable from "./AdminTennisTable";   // Your tennis admin table (see below)
import Layout from "../../layouts/layout";
import "./ViewAllMatches.css";

// Main Admin Page
const ViewAllMatchesAdmin = () => {
  const [activeMatchType, setActiveMatchType] = useState("cricket");

  return (
    <Layout userRole="admin">
      {/* Sports Toggle */}
    <div className="bgblack">
        <div className="container-fluid p-5 pb-0 mt-3 mb-4 text-center ">
        <div className="live-tips-card2">
          <div className="row">
            <div className="col-lg-4 center">
              <h1 className="white">Select Sports</h1>
            </div>
            <div className="col-lg-8">
              <div className="btn-group sport-btn-group" role="group" aria-label="Match Type Selector">
                <button
                  className={`btn sport-btn ${activeMatchType === "cricket" ? "selected" : ""}`}
                  onClick={() => setActiveMatchType("cricket")}
                >
                  <GiCricketBat className="sport-icon" />
                  <span className="sport-label">Cricket</span>
                </button>
                <button
                  className={`btn sport-btn ${activeMatchType === "soccer" ? "selected" : ""}`}
                  onClick={() => setActiveMatchType("soccer")}
                >
                  <GiSoccerBall className="sport-icon" />
                  <span className="sport-label">Soccer</span>
                </button>
                <button
                  className={`btn sport-btn ${activeMatchType === "tennis" ? "selected" : ""}`}
                  onClick={() => setActiveMatchType("tennis")}
                >
                  <GiTennisRacket className="sport-icon" />
                  <span className="sport-label">Tennis</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Match Table by Sport */}
      <div className="container-fluid">
        {activeMatchType === "cricket" && <AdminCricketTable sportId={4} />}
        {activeMatchType === "soccer" && <AdminSoccerTable sportId={1} />}
        {activeMatchType === "tennis" && <AdminTennisTable sportId={2} />}
      </div>
    </div>
    </Layout>
  );
};

export default ViewAllMatchesAdmin;
