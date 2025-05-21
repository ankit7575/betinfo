import { Layout, Menu } from "antd";
import styled from "styled-components";

const { Header } = Layout;

export const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

export const StyledHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px 20px;
  background: #ffffff;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

export const StyledMenu = styled(Menu)`
  border-bottom: none;

  .ant-menu-item {
    font-size: 16px;
    font-weight: 500;
  }
`;