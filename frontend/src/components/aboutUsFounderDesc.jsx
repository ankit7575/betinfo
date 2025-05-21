import React from "react";
import { Typography } from "antd";
import styled from "styled-components";
import founder from "../assets/aboutUs/founderImg.png"; // Ensure the correct path
import linkedinImg from "../assets/aboutUs/linkedin.png";
const { Title, Text } = Typography;

// Styled Components
const Section = styled.div`
  background: #3F8B98;
  display: flex;
  justify-content: center;
  padding: 70px 10% 0px;
  flex-wrap: wrap;
  gap: 20px;
  min-height: 500px;
  width: 100vw;
  position: relative;
  overflow: hidden;
  fontfamily: Benguiat;
`;

const TextContainer = styled.div`
  flex: 1;
  min-width: 350px;
`;

const ImageContainer = styled.div`
  flex: 1;
  min-width: 350px;
  text-align: center;
  z-index: 2;
  position: relative;
  top: 5px;
`;

const FounderImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 10px;
`;

// Full-width Background Text
const BackgroundText = styled.div`
  position: absolute;
  bottom: -12%;
  width: 100%;
  text-align: center;
  font-size: clamp(80px, 20vw, 400px); /* Scales based on screen width */
  font-weight: bold;
  color: rgba(255, 255, 255, 0.1);
  text-transform: uppercase;
  pointer-events: none;
  z-index: 1;
  user-select: none;

  @media (max-width: 768px) {
    font-size: 80px;
    bottom: 10%;
  }
`;

const FounderSection = () => {
  return (
    <Section>
      {/* Content */}
      <TextContainer>
        <Title
          level={1}
          style={{ color: "#FFF",     fontSize: "clamp(50px, 8vw, 106px)", fontFamily: 'ITC Benguiat Std', fontWeight: 100,  marginBottom: "16px", lineHeight: 0, marginTop: 50,     whiteSpace: "nowrap", // Ensures it stays in one line
          }}
        >
          Tarun Soni
        </Title>
        <Text strong style={{ color: "#FFF", fontSize: "29px" }}>
          <div style={{ display: 'flex', alignItems: "center", marginTop: "25px" }}>
            Founder
            <a
              href="https://www.linkedin.com/in/tarun-astrafin/"
              target="_blank"
              rel="noopener noreferrer"
              // style={{paddingTop: "15px", paddingLeft: "8px"}}
              style={{paddingLeft: "8px", paddingTop: "12px"}}

            >
              <img
                src={linkedinImg}
                alt="LinkedIn Profile"
                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              />
            </a>
          </div>
        </Text>
        <p style={{ color: "#FFF", marginTop: "10px", fontSize: "18px" }}>
          At Astrafin, we are a tech-first organisation redefining asset leasing with data-driven insights, automation, and seamless digital solutions. We saw a gap, businesses needed smarter, more flexible leasing that keeps pace with their growth. By integrating technology into asset management, we make leasing faster, more transparent, and effortlessly scalable. We don’t just lease assets; we power businesses with intelligent, tech-enabled solutions that drive efficiency and long-term success.
        </p>
      </TextContainer>

      {/* Founder Image */}
      <ImageContainer>
        <FounderImage src={founder} alt="Founder" />
      </ImageContainer>

      {/* Full-width Background Text */}
      <BackgroundText>FOUNDER</BackgroundText>
    </Section>
  );
};

export default FounderSection;
