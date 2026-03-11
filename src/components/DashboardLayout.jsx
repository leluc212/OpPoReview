import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  background-attachment: fixed;
`;

const SidebarWrapper = styled.div`
  width: ${props => props.$isHovered ? '260px' : '80px'};
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 40px;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
`;

const DashboardLayout = ({ children, role, showSearch = true }) => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <LayoutContainer>
      <SidebarWrapper $isHovered={isSidebarHovered}>
        <Sidebar 
          role={role} 
          onHoverChange={setIsSidebarHovered}
        />
      </SidebarWrapper>
      <MainContent>
        <Navbar showSearch={showSearch} />
        <ContentArea>{children}</ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default DashboardLayout;
