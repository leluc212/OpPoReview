import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import { Users, Briefcase, Building2, DollarSign } from 'lucide-react';

const DashboardContainer = styled.div``;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 48px;
`;

const Section = styled.section`
  margin-bottom: 48px;
`;

const SectionHeader = styled.div`
  margin-bottom: 24px;
  
  h2 {
    font-size: 24px;
    font-weight: 600;
  }
`;

const Table = styled.table`
  width: 100%;
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: 16px;
    background: ${props => props.theme.colors.bgDark};
    font-weight: 600;
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
  
  td {
    padding: 16px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover {
    background: ${props => props.theme.colors.bgDark};
  }
`;

const AdminDashboard = () => {
  const recentActivity = [
    { user: 'TechCorp', action: 'Registered as employer', time: '2 hours ago' },
    { user: 'John Doe', action: 'Applied for Senior Developer', time: '3 hours ago' },
    { user: 'Design Inc.', action: 'Posted new job', time: '5 hours ago' },
  ];

  return (
    <DashboardLayout role="admin">
      <DashboardContainer>
        <PageHeader>
          <h1>Admin Dashboard</h1>
          <p>Platform overview and analytics</p>
        </PageHeader>

        <StatsGrid>
          <StatsCard
            title="Total Users"
            value="2,458"
            change="+12%"
            changeText="from last month"
            icon={Users}
            color="linear-gradient(135deg, #667EEA 0%, #764BA2 100%)"
            positive
          />
          <StatsCard
            title="Active Jobs"
            value="345"
            change="+8%"
            changeText="from last week"
            icon={Briefcase}
            color="linear-gradient(135deg, #F093FB 0%, #F5576C 100%)"
            positive
          />
          <StatsCard
            title="Companies"
            value="156"
            change="+15"
            changeText="pending approval"
            icon={Building2}
            color="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
            positive
          />
          <StatsCard
            title="Revenue"
            value="$24.5K"
            change="+23%"
            changeText="from last month"
            icon={DollarSign}
            color="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
            positive
          />
        </StatsGrid>

        <Section>
          <SectionHeader>
            <h2>Recent Activity</h2>
          </SectionHeader>
          
          <Table>
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Time</th>
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
