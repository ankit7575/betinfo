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
import CoinCountdown from '../pages/CoinCountdown';
import ViewTennisMatch from './sections/ViewTennisMatch';
import ViewSoccerMatch from './sections/ViewSoccerMatch';
import { GiCricketBat, GiSoccerBall, GiTennisRacket } from "react-icons/gi"; // Sports icons
const Home = () => {
  // Section control: "cricket" | "soccer" | "tennis"
  const [activeMatchType, setActiveMatchType] = useState("cricket");

  return (
    <>
      <AppLayout />
      <BannerSlider />

    {/* Toggle Section with Icons and Custom CSS */}
      <div className="container-fluid p-5 pb-0 mt-3 mb-4 text-center">
        <div className="live-tips-card2">
            <div className="row " >
          <div className="col-lg-4 center" >
            <h1 className="white " >
              Select Sports
            </h1>

          </div>
          <div className="col-lg-8" >
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

      <div className="container-fluid">
        {activeMatchType === "cricket" && <TipTable matchType="Cricket" sportId={4} />}
        {activeMatchType === "soccer" && <ViewSoccerMatch />}
        {activeMatchType === "tennis" && <ViewTennisMatch />}
      </div>
      {/* All other sections as before */}
      <Banner2 />
      <Solutionsbox />
      <Banner3 />
      <BenefitsSection />
      <Banner4 />
      <FAQ />
      <SimpleStepsSection />
      <CoinCountdown />
      <Footer />
    </>
  );
};

export default Home;
