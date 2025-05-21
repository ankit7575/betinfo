import React from "react";
import { Button } from "antd";
import "./bookCallBanner.css";

const BookCallBanner = () => {
  return (
    <div className="call-to-action-1">
      <span style={{ fontSize: "1.5rem", fontWeight: "600", color: "#fffff" }}>
        Explore a world of financial freedom
      </span>
      <Button type="primary" shape="round" size="large"
      onClick={() => {
        window.open("/contact", "_blank", "noopener,noreferrer");
      }}
      >
       Contact us 
      </Button>
    </div>
  );
};

export default BookCallBanner;
