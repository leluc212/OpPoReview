import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  background-attachment: fixed;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 40px;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
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
