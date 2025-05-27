import React, { useState } from "react";
import SimpleStepsSection from "../components/SimpleStepsSection";
import TipTable from "../components/Home/TipTable";
import AppLayout from "../layout";
import Footer from "../components/Footer";
import BenefitsSection from "../components/Home/BenefitSection";
import BannerSlider from "../components/Home/BannerSlider";
import Solutionsbox from "../components/Product/Section/Solutionsbox";
import FAQ from "../components/Product/Section/FAQ";
import Banner2 from "../pages/banner2";
import Banner3 from "../pages/banner3";
import Banner4 from "../pages/banner4";
import ViewTennisMatch from './sections/ViewTennisMatch';
import ViewSoccerMatch from './sections/ViewSoccerMatch';
import { GiCricketBat, GiSoccerBall, GiTennisRacket } from "react-icons/gi";

const Home = () => {
  const [activeMatchType, setActiveMatchType] = useState("cricket");

  return (
    <>
      <AppLayout />
      <BannerSlider />

      {/* Sports Selector (Mobile Responsive) */}
      <div className="container-fluid px-2 pt-4 pb-1 mt-2 mb-3 text-center">
        <div className="live-tips-card2">
          <div className="row align-items-center">
            <div className="col-lg-4 mb-3 mb-lg-0 center">
              <h1 className="white mb-0" style={{ fontSize: "1.4rem" }}>
                Select Sports
              </h1>
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

      <div className="container-fluid px-1">
        {activeMatchType === "cricket" && <TipTable matchType="Cricket" sportId={4} />}
        {activeMatchType === "soccer" && <ViewSoccerMatch />}
        {activeMatchType === "tennis" && <ViewTennisMatch />}
      </div>

      {/* Other homepage sections */}
      <Banner2 />
      <Solutionsbox />
      <Banner3 />
      <BenefitsSection />
      <Banner4 />
      <FAQ />
      <SimpleStepsSection />
      <Footer />
    </>
  );
};

export default Home;
