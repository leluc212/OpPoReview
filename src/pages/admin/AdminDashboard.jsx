import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import { Users, Briefcase, Building2, DollarSign } from 'lucide-react';

const DashboardContainer = styled.div`
  animation: fadeIn 0.5s ease-in;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PageHeader = styled.div`
  margin-bottom: 40px;
  
  h1 {
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 12px;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 17px;
    font-weight: 500;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 48px;
`;

const Section = styled.section`
  margin-bottom: 56px;
`;

const SectionHeader = styled.div`
  margin-bottom: 28px;
  
  h2 {
    font-size: 26px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    position: relative;
    padding-left: 16px;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 5px;
      height: 28px;
      background: ${props => props.theme.colors.gradientPrimary};
      border-radius: 3px;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  border-collapse: collapse;
  box-shadow: ${props => props.theme.shadows.card};
  overflow: hidden;
  
  th {
    text-align: left;
    padding: 18px 20px;
    background: ${props => props.theme.colors.bgDark};
    font-weight: 700;
    font-size: 14px;
    color: ${props => props.theme.colors.text};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid ${props => props.theme.colors.border};
  }
  
  td {
    padding: 18px 20px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    font-size: 15px;
  }
  
  tbody tr:last-child td {
    border-bottom: none;
  }
  
  tbody tr {
    transition: all ${props => props.theme.transitions.fast};
    cursor: pointer;
    
    &:hover {
      background: ${props => props.theme.colors.bgDark};
      transform: scale(1.01);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
  }
`;

const AdminDashboard = () => {
  const recentActivity = [
    { user: 'Abc', action: 'Đăng ký nhà tuyển dụng', time: '2 giờ trước' },
    { user: 'xyz', action: 'Ứng tuyển Senior Developer', time: '3 giờ trước' },
    { user: 'Design Inc.', action: 'Đăng tin tuyển dụng mới', time: '5 giờ trước' },
  ];

  return (
    <DashboardLayout role="admin">
      <DashboardContainer>
        <StatsGrid>
          <StatsCard
            title="Tổng Người Dùng"
            value="2,458"
            change="+12%"
            changeText="so với tháng trước"
            icon={Users}
            color="linear-gradient(135deg, #0E3995 0%, #0055A5 100%)"
            positive
          />
          <StatsCard
            title="Tin Đang Tuyển"
            value="345"
            change="+8%"
            changeText="so với tuần trước"
            icon={Briefcase}
            color="linear-gradient(135deg, #F093FB 0%, #F5576C 100%)"
            positive
          />
          <StatsCard
            title="Công Ty"
            value="156"
            change="+15"
            changeText="đang chờ duyệt"
            icon={Building2}
            color="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
            positive
          />
          <StatsCard
            title="Doanh Thu"
            value="24.5 tỷ VND"
            change="+23%"
            changeText="so với tháng trước"
            icon={DollarSign}
            color="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
            positive
          />
        </StatsGrid>

        <Section>
          <SectionHeader>
            <h2>Hoạt Động Gần Đây</h2>
          </SectionHeader>
          
          <Table>
            <thead>
              <tr>
                <th>Người Dùng</th>
                <th>Hành Động</th>
                <th>Thời Gian</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 600 }}>{activity.user}</td>
                  <td>{activity.action}</td>
                  <td style={{ color: '#64748B' }}>{activity.time}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default AdminDashboard;
