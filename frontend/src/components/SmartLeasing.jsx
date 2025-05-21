import { Col, Row } from "antd";
import styled from "styled-components";

const SmartLeasingSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px 20px;
  background: #fff;
  position: relative;
  overflow: hidden;
  text-align: center;

  @media (max-width: 1024px) {
    padding: 40px 15px;
  }

  @media (max-width: 768px) {
    padding: 30px 10px;
  }
`;

const Content = styled.div`
  max-width: 1064px;
  width: 100%;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const Heading = styled.h1`
  font-size: 210px;
  font-weight: 900;
  color: #8c6500;
  margin: 0;
  font-family: 'Montserrat Bold';

  @media (max-width: 1024px) {
    font-size: 7rem;
  }

  @media (max-width: 768px) {
    font-size: 5rem;
  }

  @media (max-width: 480px) {
    font-size: 3.5rem;
  }
`;

const Subheading = styled.h2`
  font-size: 32px;
  font-weight: 900;
  color: #8c6500;
  margin: 10px 0;
  font-family: 'Montserrat Bold';
  text-align: center;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Description = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.5;
  text-align: center;
  color: #8c6500;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

/* Ensure the entire scrolling section has no overflow issues */
const TagsContainer = styled.div`
  width: 100%;
  overflow: hidden;
  background: #fff;
  position: relative;
  padding-bottom: 60px;
`;

/* The moving row of tags */
const MarqueeRow = styled.div`
  display: flex;
  font-family: 'Montserrat Bold';
  gap: 10px;
  width: max-content;
  margin: 2%;
  white-space: nowrap;
  animation: ${({ $direction, $speed }) => `
    ${$direction === "left" ? "scrollLeft" : "scrollRight"} ${$speed}s linear infinite
  `};

  @keyframes scrollLeft {
    from { transform: translateX(0%); }
    to { transform: translateX(-40%); }
  }

  @keyframes scrollRight {
    from { transform: translateX(-40%); }
    to { transform: translateX(0%); }
  }
`;

/* Tag styling */
const Tag = styled.div`
  background: #3f8b98;
  color: #fff;
  padding: 10px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  opacity: ${({ $opacity }) => $opacity};
  width: fit-content;
  white-space: nowrap;
`;

/* Tag items */
const tagData = [
  "CNC Machines", "Robotic Arms", "Industrial Machinery", "Welding Machines", "3D Printers",
  "Assembly Lines", "Lathes", "Conveyors", "Cranes", "Bulldozers",
  "Excavators", "Concrete Mixers", "Scaffolding", "Road Pavers", "Drilling Rigs",
  "Commercial Vehicles", "Forklifts", "Cold Storage Units", "Fleet Management Systems", "Warehouse Equipment",
  "Servers", "Data Storage Systems", "Cloud Infrastructure", "Cybersecurity Systems", "AI Servers",
  "MRI Machines", "X-ray Machines", "Ultrasound Devices", "Ventilators", "Surgical Robots",
  "Tractors", "Harvesters", "Irrigation Systems", "Greenhouse Automation", "Drones for Crop Monitoring",
  "Generators", "Solar Panels", "Wind Turbines", "Battery Storage Solutions", "EV Charging Stations"
];

const rows = [
  tagData.slice(0, 10), // First 10 tags
  tagData.slice(10, 20), // Next 10 tags
  tagData.slice(20, 30), // Next 10 tags
  tagData.slice(30, 40)  // Last 10 tags
];

const SmartLeasing = () => {
  return (
    <>
      <SmartLeasingSection>
        <Content>
          <Row gutter={[16, 16]} align={"middle"}>
            <Col xs={24} sm={12}>
              <Heading>40+</Heading>
            </Col>
            <Col xs={24} sm={12}>
              <Subheading>Smart Leasing for Smarter Business</Subheading>
              <Description>
                Access the right equipment, right when you need it.
              </Description>
            </Col>
          </Row>
        </Content>
      </SmartLeasingSection>

      {/* Scrolling Tag Section */}
      <TagsContainer>
        {rows.map((row, index) => (
          <MarqueeRow
            key={index}
            $direction={index % 2 === 0 ? "left" : "right"}
            $speed={30}
          >
            {[...row, ...row].map((tag, i) => (
              <Tag key={`${tag}-${i}`} $opacity={1 - index * 0.2}>
                <b>{tag}</b>
              </Tag>
            ))}
          </MarqueeRow>
        ))}
      </TagsContainer>
    </>
  );
};

export default SmartLeasing;
