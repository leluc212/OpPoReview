import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
`;

const DashboardLayout = ({ children, role, showSearch = true }) => {
  return (
    <LayoutContainer>
      <Sidebar role={role} />
      <MainContent>
        <Navbar showSearch={showSearch} />
        <ContentArea>{children}</ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default DashboardLayout;
