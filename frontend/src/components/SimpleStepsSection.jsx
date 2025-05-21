import React from "react";
import { Button } from "antd";

const SimpleStepsSection = () => {
  return (
    <div className="p-5">
      <div className="call-to-action">
        <span style={{ fontWeight: "bold" }}>
         Explore a world of financial freedom
        </span>
        <Button
          style={{ fontWeight: "bold" }}
          type="primary"
          shape="round"
          size="large"
          onClick={() => {
            window.open(
              "/contact",
              "_blank",
              "noopener,noreferrer"
            );
          }}
        >
          Contact Us
        </Button>
      </div>
    </div>
  );
};

export default SimpleStepsSection;
