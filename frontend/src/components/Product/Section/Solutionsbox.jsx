import "./Section.css";
import icon1 from "../../../assets/product/icon1.png";
import icon2 from "../../../assets/product/icon2.png";
import icon3 from "../../../assets/product/icon3.png";

// New data for BetInfo.Live
const solutionsData = [
  {
    icon: icon1,
    title: "AI-Enhanced Predictions",
    description: "Utilizing cutting-edge AI technology to predict match outcomes with high accuracy.",
  },
  {
    icon: icon2,
    title: "Real-Time Alerts",
    description: "Stay ahead with instant notifications and updates on key match events.",
  },
  {
    icon: icon3,
    title: "Custom Betting Strategies",
    description: "Get personalized betting recommendations based on your preferences and data-driven insights.",
  },
];

const Solutionsbox = () => {
  return (
    <div className="container">
      <div className="Solutionsbox" id="sectionpadding">
        <div className="container">
          {/* Use flexbox to ensure equal height for both columns */}
          <div className="row align-items-stretch d-flex">
            {/* Left Section */}
            <div className="col-lg-4 d-flex flex-column">
              <h1>Bet Smarter with AI-Driven Insights</h1>
              <p>
                BetInfo.Live delivers precise and actionable sports betting advice for Cricket, Football, and Tennis. Powered by AI and expert analysis, we offer real-time insights that give you the edge to make smarter bets.
              </p>
              <button>
                <a
                  href="https://calendly.com/platform-astrafin/30min"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Contact Us
                </a>
              </button>
            </div>

            {/* Right Section (Boxes) */}
            <div className="col-lg-8 d-flex flex-column">
              <div className="row h-100">
                {solutionsData.map((solution, index) => (
                  <div className="col-lg-4 d-flex" key={index}>
                    <div className="box flex-grow-1">
                      <img src={solution.icon} alt={solution.title} />
                      <h1>{solution.title}</h1>
                      <p>{solution.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solutionsbox;
