
import { Layout, Button, Row, Col, Grid } from "antd";
import styled from "styled-components";
import card1 from "../assets/home-top-1.png";
import card2 from "../assets/home-top-2.png";
import card3 from "../assets/home-top-3.png";
import card4 from "../assets/home-top-4.png";

const { Content } = Layout;

// 🟢 Moved styled-components outside of the component function
const StyledContent = styled(Content)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 50px;
  padding: 70px 30px 140px;
  background: linear-gradient(to top right, #ffffff 80%, #3F8B98 120%);

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
  }
`;

const TextSection = styled.div`
  max-width: 800px;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const Heading = styled.h1`
  font-size: 72px;
  font-weight: bold;
  color: #000;
  margin-bottom: 16px;
  font-family: 'ITC Benguiat Std Bold';

  span {
    color: #3F8B98;
  }

  @media (max-width: 1024px) {
    font-size: 60px;
  }

  @media (max-width: 768px) {
    font-size: 48px;
  }

  @media (max-width: 480px) {
    font-size: 36px;
  }
`;

const SubHeading = styled.p`
  font-style: italic;
  font-size: 26px;
  color: #333;
  margin-bottom: 50px;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 22px;
    text-align: center;
  }
`;

const Paragraph = styled.p`
  font-size: 24px;
  color: #333;
  margin-bottom: 50px;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 20px;
    text-align: center;
  }
`;

const StyledButton = styled(Button)`
  background: #3F8B98;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  border-radius: 20px;
  padding: 18px 20px;
  border: none;

  &:hover, &:focus {
    background: #3F8B98 !important;
    color: #fff !important;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SmartCapex = () => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const textColProps = {
    xs: 24,
    md: 14,
    lg: 16,
    push: screens.md ? 2 : 0, // Push only on medium and larger screens
  };

  const imageColProps = {
    xs: 24,
    md: 10,
    lg: 8,
    pull: screens.md ? 2 : 0, // Pull only on medium and larger screens
  };

  return (
    <StyledContent>
      <Row gutter={[32, 32]} align="middle" justify="center">
        {/* Left Section - Text */}
        <Col {...textColProps}>
          <TextSection>
            <Heading>
              <span>Smart</span> <span style={{ fontFamily: 'ITC Benguiat Std Book', color: "black" }}>Capex for</span> <br /> 
              <span style={{ fontFamily: 'ITC Benguiat Std Book', color: "black" }}>Smarter</span> <span>Growth</span>
            </Heading>
            <SubHeading>
              Unlock growth without owning assets. <br /> Lease smarter, save more.
            </SubHeading>
            <Paragraph>
              Access top-tier equipment, technology, or vehicles <br /> with 0 upfront costs. Start scaling today.
            </Paragraph>
            <StyledButton onClick={() => {
              window.open("https://calendly.com/platform-astrafin/30min", "_blank", "noopener,noreferrer");
            }}>Connect with us</StyledButton>
          </TextSection>
        </Col>

        {/* Right Section - Cards */}
        <Col {...imageColProps}>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={12} sm={12} md={12} style={{ marginTop: "40px", paddingRight: "15px" }}>
              <img src={card1} alt="card1" width="100%" height="auto" style={{ paddingBottom: "30px" }} />
              <img src={card4} alt="card2" width="100%" height="auto" />
            </Col>

            <Col xs={12} sm={12} md={12}>
              <img src={card2} alt="card3" width="100%" height="auto" style={{ paddingBottom: "30px" }}/>
              <img src={card3} alt="card4" width="100%" height="auto" />
            </Col>
          </Row>
        </Col>
      </Row>
    </StyledContent>
  );
};

export default SmartCapex;
