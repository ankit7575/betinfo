import { Layout, Button, Row, Col } from "antd";
import styled from "styled-components";
import card1 from "../assets/Card1.png";
import card2 from "../assets/Card2.svg";
import card3 from "../assets/Card3.png";
import card4 from "../assets/Card4.png";

const SmartCapexOld = () => {

    const { Content } = Layout;

    const StyledContent = styled(Content)`
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 300px; /* Reduce gap to bring text and cards closer */
      padding: 80px 100px;
      background: linear-gradient(to top right, #ffffff 60%, #3F8B98 100%);
    `;

    const TextSection = styled.div`
      max-width: 810px;
    `;

    const Heading = styled.h1`
      font-size: 100px;
      font-weight: bold;
      color: #000;
      margin-bottom: 16px;
      font-family: 'ITC Benguiat Std', sans-serif;
      span {
        color: #3F8B98;
      }
    `;

    const SubHeading = styled.p`
      font-style: italic;
      font-size: 30px;
      color: #333;
      margin-bottom: 16px;
    `;

    const Paragraph = styled.p`
      font-size: 32px;
      color: #333;
      margin-bottom: 32px;
    `;

    const StyledButton = styled(Button)`
      background: #3F8B98;
      color: #fff;
      font-size: 16px;
      font-weight: 500;
      border-radius: 20px;
      padding: 20px 24px;
      border: none;

      &:hover, &:focus {
        background: #3F8B98 !important;
        color: #fff !important;
      }
    `;


    return (
        <StyledContent>
            <Row gutter={48}>
                <Col span={16} push={2}>
                    <TextSection>
                        <Heading>
                            <span>Smart</span> Capex for <br />
                            Smarter <span>Growth</span>
                        </Heading>
                        <SubHeading>Unlock Growth Without Owning Assets <br /> Lease Smarter, Earn More</SubHeading>
                        <Paragraph>
                            Access top-tier equipment, technology, or vehicles <br />
                            with 0 upfront costs. Start scaling today.
                        </Paragraph>
                        <StyledButton>Content with us</StyledButton>
                    </TextSection>
                </Col>
                <Col span={8} pull={2}>
                    <Row gutter={48}>
                        <Col xs={12} style={{ marginTop: "84px" }}>
                            <img src={card1} alt="card1" width={"267px"} height={"362px"} />
                            <img src={card2} alt="card2" width={"267px"} height={"122px"} />
                        </Col>
                        <Col xs={12}>
                            <img src={card3} alt="card3" width={"267px"} height={"206px"} />
                            <img src={card4} alt="card4" width={"267px"} height={"362px"} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </StyledContent>
    )
}

export default SmartCapexOld;