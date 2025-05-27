import React, { useState } from "react";
import { Layout, Button, Drawer } from "antd";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { MenuOutlined } from "@ant-design/icons";
import logo from "../assets/logo.png";
import CoinCountdown from '../pages/CoinCountdown';
const { Header } = Layout;

const StyledHeader = styled(Header)`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
  background: #000;
  border-bottom: 1px solid #555;
  height: 55px;
  min-height: 55px;

  @media (max-width: 768px) {
    padding: 2px 4px;
    height: 42px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuIcon = styled(MenuOutlined)`
  font-size: 25px;
  cursor: pointer;
  display: none;
  margin-left: 10px;
color:white;
  @media (max-width: 768px) {
    display: block;
  }
`;

const StyledButton = styled(Button)`
  border-radius: 25px;
  font-size: 13px;
  font-weight: 600;
  padding: 2px 10px;
  height: 28px;
  background: #3f8b98;
  color: #fff;
  border: none;
  margin-left: 4px;

  &:hover,
  &:focus,
  &:active {
    background: #3f8b98 !important;
    color: #fff !important;
  }
`;

const StyledLink = styled.span`
  font-size: 20px;
  font-weight: 600;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
  padding: 0 2px;

  &:hover {
    color: #6afcff;
  }
`;

const AppLayout = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const location = useLocation();

  const handleNavigateAndReload = (path) => {
    if (location.pathname === path) {
      window.location.reload();
    } else {
      window.location.href = path;
    }
  };

  const handleOpenAccount = () => {
    window.open("/account", "_blank", "noopener,noreferrer");
  };

  return (
    <Layout style={{ paddingTop: "48px", background: "transparent" }}>
      <StyledHeader>
        <LogoContainer>
          <img
            src={logo}
            alt="astrafin"
            width="110"
            height="28"
            style={{ cursor: "pointer", objectFit: "contain" }}
            onClick={() => handleNavigateAndReload("/")}
          />
        </LogoContainer>
        {/* Desktop Navigation */}
        <NavContainer>
          <StyledLink onClick={() => handleNavigateAndReload("/")}>Home</StyledLink>
          <StyledLink onClick={() => handleNavigateAndReload("/about")}>About</StyledLink>
          <StyledLink onClick={() => handleNavigateAndReload("/contact")}>Contact</StyledLink>
          <StyledButton onClick={handleOpenAccount}>Account</StyledButton>
          <CoinCountdown />
        </NavContainer>
        {/* Mobile Menu Icon */}
        <MobileMenuIcon onClick={() => setDrawerVisible(true)} />
        {/* Mobile Drawer Menu */}
        <Drawer
          title={null}
          placement="right"
          closable
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width="170px"
          bodyStyle={{ padding: "10px 8px" }}
          headerStyle={{ display: "none" }}
        >
          <div className="bgblack" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <StyledLink
              onClick={() => {
                setDrawerVisible(false);
                handleNavigateAndReload("/");
              }}
            >Home</StyledLink>
            <StyledLink
              onClick={() => {
                setDrawerVisible(false);
                handleNavigateAndReload("/about");
              }}
            >About</StyledLink>
            <StyledLink
              onClick={() => {
                setDrawerVisible(false);
                handleNavigateAndReload("/contact");
              }}
            >Contact</StyledLink>
            <StyledButton
              onClick={() => {
                setDrawerVisible(false);
                handleOpenAccount();
              }}
            >Account</StyledButton>
          </div>
        </Drawer>
      </StyledHeader>
    </Layout>
  );
};

export default AppLayout;
