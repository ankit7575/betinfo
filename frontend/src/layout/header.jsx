import React, { useState } from "react";
import { Layout, Button, Drawer } from "antd";
import {  useLocation } from "react-router-dom";
import styled from "styled-components";
import { MenuOutlined } from "@ant-design/icons";
import logo from "../assets/logo.png";

const { Header } = Layout;

const StyledHeader = styled(Header)`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: rgb(0, 0, 0);
  border-bottom: 1px solid #8b8b8b;
  height: auto;

  @media (max-width: 768px) {
    padding: 10px 20px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuIcon = styled(MenuOutlined)`
  font-size: 24px;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const StyledButton = styled(Button)`
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 16px;
  background: rgba(63, 139, 152, 1);
  color: rgb(255, 255, 255);
  border: none;

  &:hover,
  &:focus,
  &:active {
    background: rgba(63, 139, 152, 1) !important;
    color: #ffffff !important;
  }
`;

const StyledLink = styled.span`
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  color: white;
  padding-bottom: 5px;
  cursor: pointer;

  &:hover {
    color: rgb(255, 255, 255);
  }
`;

const AppLayout = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const location = useLocation();

  const handleNavigateAndReload = (path) => {
    if (location.pathname === path) {
      window.location.reload(); // If already on same page, reload
    } else {
      window.location.href = path; // Navigate and reload
    }
  };

  const handleOpenAccount = () => {
    window.open("/account", "_blank", "noopener,noreferrer");
  };

  return (
    <Layout style={{ paddingTop: "80px" }}>
      <StyledHeader>
        <LogoContainer>
          <img
            src={logo}
            alt="astrafin"
            width="285"
            height="65"
            style={{ cursor: "pointer" }}
            onClick={() => handleNavigateAndReload("/")}
          />
        </LogoContainer>

        {/* Desktop Navigation */}
        <NavContainer>
          <StyledLink onClick={() => handleNavigateAndReload("/")}>Home</StyledLink>
          <StyledLink onClick={() => handleNavigateAndReload("/about")}>About Us</StyledLink>
          <StyledLink onClick={() => handleNavigateAndReload("/contact")}>Contact</StyledLink>
          <StyledButton onClick={handleOpenAccount}>Account</StyledButton>
        </NavContainer>

        {/* Mobile Menu Icon */}
        <MobileMenuIcon onClick={() => setDrawerVisible(true)} />

        {/* Mobile Drawer Menu */}
        <Drawer
          title="Menu"
          placement="right"
          closable
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width="250px"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <StyledLink
              onClick={() => {
                setDrawerVisible(false);
                handleNavigateAndReload("/");
              }}
            >
              Home
            </StyledLink>
            <StyledLink
              onClick={() => {
                setDrawerVisible(false);
                handleNavigateAndReload("/about");
              }}
            >
              About
            </StyledLink>
            <StyledLink
              onClick={() => {
                setDrawerVisible(false);
                handleNavigateAndReload("/contact");
              }}
            >
              Contact
            </StyledLink>
            <StyledButton
              onClick={() => {
                setDrawerVisible(false);
                handleOpenAccount();
              }}
            >
              Account
            </StyledButton>
          </div>
        </Drawer>
      </StyledHeader>
    </Layout>
  );
};

export default AppLayout;
