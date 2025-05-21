import React from "react";
import { styled } from "styled-components";

// Styled Components for Layout
const Section = styled.section`
  background-color: #3F8B98;
  padding: 70px 0px 70px 115px;
  color: white;
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 18px;
  margin-bottom: 40px;
`;

const ManagementSection = styled.section`
  display: flex;
  justify-content: space-between;
  gap: 30px;
`;

const LeftSection = styled.div`
  flex: 1;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const FeatureCard = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Icon = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 20px;
`;

const FeatureText = styled.div``;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
`;

const FeatureDescription = styled.p`
  font-size: 16px;
  margin-top: 5px;
`;

const DashboardImage = styled.img`
  max-width: 100%;
  border-radius: 10px;
`;

const AssetManagement = () => {
  const features = [
    { icon: "/assets/truck.svg", title: "Asset Delivery & Management", desc: "Streamlined leasing and asset management in one place." },
    { icon: "/assets/analytics.svg", title: "Asset Upgrade or Renewal", desc: "Advanced reporting tools with customizable KPIs and performance metrics." },
    { icon: "/assets/graph-up.svg", title: "Accounting and Invoicing", desc: "Seamless accounting integration with automated invoicing for effortless transactions." },
    { icon: "/assets/automated-workflow.svg", title: "Automated Workflow", desc: "Streamlined processes for approvals, payments, and maintenance schedules." },
  ];

  return (
    <Section>
      <Title>Optimized by Technology, Powered by Possibility</Title>
      <Description>
        Astrafin&apos;s digital platform revolutionizes the entire asset leasing lifecycle with advanced technology.
      </Description>

      <ManagementSection>
        <LeftSection>
          {features.map((item, index) => (
            <FeatureCard key={index}>
              <Icon src={item.icon} />
              <FeatureText>
                <FeatureTitle>{item.title}</FeatureTitle>
                <FeatureDescription>{item.desc}</FeatureDescription>
              </FeatureText>
            </FeatureCard>
          ))}
        </LeftSection>
        
        <RightSection>
          <DashboardImage src="/assets/assesment-dashboard.png" />
        </RightSection>
      </ManagementSection>
    </Section>
  );
};

export default AssetManagement;
