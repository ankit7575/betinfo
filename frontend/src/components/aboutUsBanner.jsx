import React from "react";
import aboutImage from "../assets/aboutUs/aboutUsBanner.png"; // Ensure the image path is correct
import "./aboutUsBanner.css"; // Ensure the CSS file has correct styling

const AboutAstafin = () => {
  return (
   <>
    <div className="about-section">
      {/* Bootstrap Row and Columns */}
      <div className="row align-items-center">
        <div className="col-lg-6">
          <h2 className="about-title">
            <div className="title-wrapper">
              <div>
                <span>About</span>
              </div>
              <div>
                <span className="highlight">BetInfo.Live</span>
              </div>
            </div>
          </h2>

          <p className="about-description">
            Betting Made Smarter — Powered by Data & Expertise <br /> <br />
          </p>
          <p className="about-description">
            At BetInfo.Live, we provide accurate and data-driven sports betting tips for Cricket, Football, and Tennis. Using advanced AI algorithms combined with expert analysis, we deliver real-time insights to help users make confident betting decisions.
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="col-lg-6 image-container">
          <img src={aboutImage} alt="About BetInfo.Live" className="about-image" />
        </div>
      </div>
    </div></>
  );
};

export default AboutAstafin;
