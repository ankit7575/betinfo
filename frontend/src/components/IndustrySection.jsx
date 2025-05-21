import { useRef } from "react";
import styled from "styled-components";
import img1 from "../assets/Image1.png";
import img2 from "../assets/Image2.png";
import img3 from "../assets/Image3.png";
import img4 from "../assets/Image4.png";
import img5 from "../assets/Image5.png";
import img6 from "../assets/Image6.png";
import img7 from "../assets/Image7.png";
import img8 from "../assets/Image8.png";
import img10 from "../assets/Image10.png";
import img11 from "../assets/Image11.png";
import img12 from "../assets/Image12.png";
import img13 from "../assets/Image13.png";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const IndustrySection = () => {
  const images = [
    { src: img1, title: "Manufacturing", description: "Reduce upfront costs, upgrade to advanced machinery without heavy capital investment." },
    { src: img2, title: "Infrastructure", description: "Access high-cost equipment for large projects without tying up capital in depreciating assets." },
    { src: img3, title: "Logistics", description: "Integrate fleet expansion and modernization without long-term financial burdens." },
    { src: img4, title: "IT and ITES", description: "Scale the technology infrastructure of your business affordably while keeping pace with innovation." },
    { src: img5, title: "Healthcare", description: "Access cutting-edge medical technology without large capital expenditures." },
    { src: img6, title: "Technology (Tech)", description: "Invest in the latest technology without upfront financial strain for startups and enterprise growth." },
    { src: img7, title: "Agriculture", description: "Access modern equipment to improve efficiency and yield without massive initial costs, for farmers." },
    { src: img8, title: "Energy and Utilities", description: "Invest in renewable energy solutions without the financial burden of ownership." },
    { src: img10, title: "Automotive and EV", description: "Accelerate the adoption of EV by making infrastructure more accessible and cost-effective." },
    { src: img11, title: "Food Processing", description: "Upgrade equipment and scale operations with minimal risk, for the food industry." },
    { src: img12, title: "Pharmaceuticals", description: "Invest in R&D and stable production while optimizing cash flow." },
    { src: img13, title: "Waste Management", description: "Implement waste management solutions affordably, for businesses and municipal corporations." },
  ];

  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <Container>
      <Title style={{ fontFamily: "ITC Benguiat Std Bold" }}>Powering Growth</Title>
      <Title style={{ paddingBottom: "30px", fontFamily: "ITC Benguiat Std Bold" }}>Across Industries</Title>

      <ScrollContainer>
        <IndustryGrid ref={sliderRef}>
          {images.map((item, i) => (
            <Card key={i} style={{ backgroundImage: `url(${item.src})` }}>
              <GradientOverlay />
              <CardContent>
                <h2>{item.title}</h2>
                <StyledDescription>{item.description}</StyledDescription>
              </CardContent>
            </Card>
          ))}
        </IndustryGrid>
      </ScrollContainer>

      <ButtonContainer>
        <Button shape="circle" icon={<LeftOutlined />} onClick={scrollLeft} />
        <Button shape="circle" icon={<RightOutlined />} onClick={scrollRight} />
      </ButtonContainer>
    </Container>
  );
};

export default IndustrySection;

const Container = styled.div`
  font-family: Arial, sans-serif;
  background-color: #3f8b98;
  color: #fff;
  padding-top: 70px;
  padding-left: 100px;
  padding-bottom: 70px;
`;

const Title = styled.h2`
  font-size: 40px;
  font-weight: bold;
  color: #cebf93;
  padding-left: 120px;
  font-family: 'ITC Benguiat Std', sans-serif;

  span {
    color: #3f8b98;
  }

  @media (max-width: 1024px) {
    font-size: 40px;
  }

  @media (max-width: 768px) {
    font-size: 30px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IndustryGrid = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  max-width: 100vw;
  white-space: nowrap;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

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
  flex-shrink: 0;

  &:hover {
    filter: grayscale(0%);
  }
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  padding-left: 120px;
  padding-top: 30px;
`;
