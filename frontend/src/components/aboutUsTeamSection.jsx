import React, { useRef } from "react";
import { Typography } from "antd";
import "./aboutUsTeamSection.css" // Import custom CSS for hover effects
import team1 from "../assets/aboutUs/team1.png"
import team2 from "../assets/aboutUs/team5.png"
import team3 from "../assets/aboutUs/team3.png"
import team4 from "../assets/aboutUs/team4.png"
import { styled } from "styled-components";

const { Title, Text } = Typography;

const teamMembers = [
  {
    name: "WINSTON PINTO",
    role: "Business and Growth",
    img: team1,
  },
  {
    name: "RAHUL SHRINIVAS",
    role: "Founder's Office",
    img: team2,

  },
  {
    name: "CRUISE D'MELLO",
    role: "Growth",
    img: team3,
  },
  {
    name: "SHRAVAN",
    role: "Capital Markets",
    img: team4,
  },
];

const Card = styled.div`
  position: relative;
  width: 250px;
  height: 350px;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  overflow: hidden;
  filter: grayscale(100%);
  transition: filter 0.4s ease-in-out;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-shrink: 0; /* Prevent shrinking */

  &:hover {
    filter: grayscale(0%);
  }
`;
const IndustryGrid = styled.div`
  display: flex;
  gap: 50px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  // max-width: 90vw;
  white-space: nowrap;
  padding-bottom: 10px;
  // justify-content: center; /* Center align the cards */
  flex-wrap: wrap; /* Allow wrapping for better alignment */
`;



const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  opacity: 0;
  transition: opacity 0.4s ease-in-out;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const CardContent = styled.div`
  position: absolute;
  bottom: 20px;
  width: 90%;
  text-align: center;
  color: white;
  transform: translateY(20px);
  opacity: 0;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  padding: 10px;

  ${Card}:hover & {
    transform: translateY(0);
    opacity: 1;
  }

  h2 {
    margin: 0;
    font-size: 18px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
`;
const StyledDescription = styled.p`
  font-size: 14px;
  margin-top: 5px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  max-width: 100%;
  line-height: 1.4;
`;

const TeamSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  return (
    <div className="team-section">
        <Title level={2} className="team-title" style={{fontFamily: "ITC Benguiat Std Bold", color: "#3f8b98", fontSize: "50px"}}>
          About The Team
        </Title>
        <Text className="team-description">
          We are a young, dynamic, and diverse team with experience in building some of the largest fintech companies. At Astrafin, we believe the right leasing solutions can be the catalyst for business growth. That’s why we’ve assembled a team of industry experts and visionary leaders, all driven by a shared mission to empower Indian businesses with smarter, faster, and more efficient leasing solutions that fuel long-term success.
        </Text>
      <IndustryGrid ref={sliderRef}>
        {teamMembers.map((item, i) => (
          <Card key={i} style={{ backgroundImage: `url(${item.img})` }}>
            <GradientOverlay />
            <CardContent>
              <h2>{item.name}</h2>
              <StyledDescription>{item.role}</StyledDescription>
            </CardContent>
          </Card>
        ))}
      </IndustryGrid>
    </div>
  );
};

export default TeamSection;
