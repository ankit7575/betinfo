import { Card, Col, Row, Typography } from 'antd';
import styled from 'styled-components';
import filledCircle from "../../assets/FilledCircle.png";

const { Title, Text } = Typography;

const Section = styled.div`
  background-color: black;
  padding: 85px 55px;
  color: #D3B98D;
`;

const BenefitCard = styled(Card)`
  background: transparent !important;
  border: none !important;
  color: white;

  .ant-typography {
    color: white;
  }
`;

const BenefitsSection = () => {
    return (
        <Section>
            <div style={{ maxWidth: 1250, margin: "auto" }}>

                <Row align={"middle"}>
                    <Col push={1}>
                        <Title level={1} style={{
                            color: '#D3B98D', fontFamily:
                                'ITC Benguiat Std Bold, sans-serif', marginBottom: "1em"
                        }}>Benefits Of Betinfo&ldquo;.Live&rdquo;</Title>
                    </Col>
                </Row>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={12} style={{ padding: "0 40px" }}>
                        <BenefitCard>
                            <Row align="middle">
                                <Col xs={6} sm={4} lg={4} xl={4}>
                                    <img src={filledCircle} alt="card1" width={"54px"} height={"54px"} />
                                </Col>
                                <Col xs={20} pull={1}>
                                    <Title style={{ fontFamily: "Montserrat Bold" }} level={4}>AI-Powered Predictions</Title>
                                    <Text>Get data-driven betting tips based on advanced algorithms and real-time stats.</Text>
                                </Col>
                            </Row>
                        </BenefitCard>

                        <BenefitCard>
                            <Row align="middle">
                                <Col xs={6} sm={4} lg={4} xl={4}>
                                    <img src={filledCircle} alt="card1" width={"54px"} height={"54px"} />
                                </Col>
                                <Col xs={20} pull={1}>
                                    <Title level={4} style={{ fontFamily: "Montserrat Bold" }}>Expert-Verified Tips</Title>
                                    <Text>Every suggestion is reviewed by seasoned sports analysts to ensure accuracy.</Text>
                                </Col>
                            </Row>
                        </BenefitCard>

                        <BenefitCard>
                            <Row align="middle">
                                <Col xs={6} sm={4} lg={4} xl={4}>
                                    <img src={filledCircle} alt="card1" width={"54px"} height={"54px"} />
                                </Col>
                                <Col xs={20} pull={1}>
                                    <Title style={{ fontFamily: "Montserrat Bold" }} level={4}>Multi-Sport Coverage</Title>
                                    <Text>From Cricket to Tennis to Football, we&apos;ve got every major sport covered.</Text>

                                </Col>
                            </Row>
                        </BenefitCard>
                    </Col>

                    <Col xs={24} md={12}>
                        <BenefitCard>
                            <Row align="middle">
                                <Col >
                                    <div style={{ borderLeft: "4px solid #d9cba6", paddingLeft: "1rem" }}>
                                        <Title style={{ fontFamily: "Montserrat Bold" }} level={4}>Live Match Insights </Title>
                                        <Text >Stay updated with real-time scores, odds shifts, and instant strategy changes.</Text>
                                    </div>
                                </Col>
                            </Row>
                        </BenefitCard>

                        <BenefitCard>
                            <Row align="middle">
                                <Col>
                                    <div style={{ borderLeft: "4px solid #d9cba6", paddingLeft: "1rem" }}>
                                        <Title style={{ fontFamily: "Montserrat Bold" }} level={4}>Win-Tracking & Tips History</Title>
                                        <Text>Track your performance, past tips, and profit/loss across every event.</Text>
                                    </div>
                                </Col>
                            </Row>
                        </BenefitCard>
                    </Col>
                </Row>
            </div>
        </Section>
    );
};

export default BenefitsSection;
