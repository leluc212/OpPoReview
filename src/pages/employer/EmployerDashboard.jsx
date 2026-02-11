import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import { Briefcase, Users, Eye, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/FormElements';

const DashboardContainer = styled.div``;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  div {
    h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    p {
      color: ${props => props.theme.colors.textLight};
    }
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const EmployerDashboard = () => {
  const navigate = useNavigate();

  const recentApplications = [
    { candidate: 'John Smith', job: 'Senior React Developer', applied: '2 hours ago', status: 'pending' },
    { candidate: 'Jane Doe', job: 'Full Stack Engineer', applied: '5 hours ago', status: 'reviewed' },
    { candidate: 'Bob Johnson', job: 'UI/UX Designer', applied: '1 day ago', status: 'approved' },
  ];

  return (
    <DashboardLayout role="employer">
      <DashboardContainer>
        <PageHeader>
          <div>
            <h1>Employer Dashboard</h1>
            <p>Manage your jobs and applications</p>
          </div>
          <Button $variant="primary" $size="large" onClick={() => navigate('/employer/post-job')}>
            <Plus /> Post New Job
          </Button>
        </PageHeader>

        <StatsGrid>
          <StatsCard
            title="Active Jobs"
            value="12"
            change="+3"
            changeText="from last month"
            icon={Briefcase}
            color="linear-gradient(135deg, #667EEA 0%, #764BA2 100%)"
            positive
          />
          <StatsCard
            title="Total Applications"
            value="248"
            change="+45%"
            changeText="from last month"
            icon={Users}
            color="linear-gradient(135deg, #F093FB 0%, #F5576C 100%)"
            positive
          />
          <StatsCard
            title="Profile Views"
            value="1,234"
            change="+12%"
            changeText="from last week"
            icon={Eye}
            color="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
            positive
          />
          <StatsCard
            title="Hired"
            value="8"
            change="+2"
            changeText="this month"
            icon={TrendingUp}
            color="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
            positive
          />
        </StatsGrid>

        <Section>
          <SectionHeader>
            <h2>Recent Applications</h2>
            <a href="/employer/applications" style={{ color: '#6366F1', fontWeight: 500 }}>View all →</a>
          </SectionHeader>
          
          <Table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Position</th>
                <th>Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((app, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 600 }}>{app.candidate}</td>
                  <td>{app.job}</td>
                  <td style={{ color: '#64748B' }}>{app.applied}</td>
                  <td><StatusBadge status={app.status} /></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
