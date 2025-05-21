import React from "react";
import { Row, Col, Card, Typography } from "antd";

import bk1 from "../assets/aboutUs/bk1.png";
import bk2 from "../assets/aboutUs/bk2.png";
import bk7 from "../assets/aboutUs/bk3.png";
import bk4 from "../assets/aboutUs/bk4.png";
import bk5 from "../assets/aboutUs/bk5.png";
import bk9 from "../assets/aboutUs/bk9.png";
import bk1_1 from "../assets/aboutUs/bk1_1.png";
import bk1_2 from "../assets/aboutUs/bk2_2.png";
import bk1_3 from "../assets/aboutUs/bk3_3.png";
import bk1_4 from "../assets/aboutUs/bk4_4.png";
import bk1_5 from "../assets/aboutUs/bk5_5.png";
import bk1_6 from "../assets/aboutUs/bk6_6.png";


const { Title, Text } = Typography;

const investors = [
  { name: "Farooq Adam", company: "Fynd", image: bk7, img: bk1_5 },
  { name: "JS Gujral", company: "SGS Syrma", image: bk4, img: bk1_6 },
  { name: "Manish Taneja", company: "Purplle", image: bk1, img: bk1_2 },
  { name: "Nitin Saluja", company: "Chaayos", image: bk9, img: bk1_1 },
  { name: "Sameer Mehta", company: "boAt Lifestyle", image: bk2, img: bk1_3 },
  { name: "Saurabh Kumar", company: "BlinkIt", image: bk5, img: bk1_4 }
];

const stats = [
  { value: "40+", description: "Cumulative years in Financial services" },
  { value: "7K+ cr", description: "Debt Transactions Enabled" },
  { value: "50+", description: "Banks and NBFCs Partnerships" },
];

const BackedBySection = () => {
  return (
    <div className="ResponsiveCardAboutUS"
      style={{ padding: "50px 20px", textAlign: "center", background: "#fff" }}
    >
      <Row justify="center" style={{ paddingBottom: "60px", paddingTop: "45px" }}>
  <Col
    xs={24}
    sm={24}
    md={20}
    lg={18}
    className="responsive-col"
    style={{ margin: "0 auto" }}
  >
    <Card
      className="responsive-card"
      style={{
        textAlign: "center",
        padding: "40px",
        borderRadius: "16px",
        background: "transparent",
        boxShadow: "10px 10px 30px rgba(0, 0, 0, 0.1)",
        border: "none",
        margin: "0 auto",
      }}
    >
      <Row gutter={[16, 16]} justify="center">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <div>
              <Title
                level={2}
                style={{
                  color: "#cebf93",
                  fontSize: "5vw", // Responsive font size
                  marginBottom: "5px",
                  fontFamily: "Montserrat Bold",
                }}
              >
                {stat.value}
              </Title>
              <Text strong style={{ fontSize: "18px" }}>{stat.description}</Text>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  </Col>
</Row>

      {/* Heading */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "left" }}>
        <h2
          style={{ fontFamily: "ITC Benguiat Std Bold", color: "rgba(63, 139, 152, 1)", fontSize: "60px" }}
        >
          Backed By
        </h2>
        <Text style={{ fontSize: "16px", color: "#6B6B6B" }}>
          Our journey is guided by some of the most renowned founders and investors in India.
        </Text>
      </div>

      {/* Investors Grid */}
      <Row gutter={[24, 24]} justify="center" style={{ marginTop: "30px", padding: "0px 150px 40px" }}>
        {investors.map((investor, index) => (
          <Col xs={24} sm={12} md={8} lg={8} key={index}>
            <Card
              style={{
                display: "flex",
                flexDirection: "row", // Aligns image left, text right
                alignItems: "center",
                borderRadius: "100px",
                textAlign: "left",
                backgroundColor: "rgba(253, 253, 254, 1)",
                border: "none",
              }}
            >
              {/* Investor Image */}
              <Row>
                <Col>
                  <img
                    src={investor.image}
                    alt={investor.name}
                    style={{
                      width: "85px",
                      height: "85px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "15px",
                    }}
                  />
                </Col>
                <Col>
                  <Title level={4} style={{ margin: 0, fontSize: "23px", fontFamily: "Montserrat Bold" }}>
                    {investor.name}
                  </Title>
                  <div style={{ display: 'flex', alignItems: "center" }}>
                    <Text type="secondary" style={{ fontSize: "14px", paddingRight: 4, color: "#000" }}>
                      {investor.company}
                    </Text>
                    <img src={investor.img}></img>

                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Stats Section */}

    </div>
  );
};

export default BackedBySection;
