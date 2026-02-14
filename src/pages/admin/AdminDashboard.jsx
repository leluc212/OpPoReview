import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import { Users, Briefcase, Building2, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

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
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
  const { language } = useLanguage();
  const t = useTranslations(language);

  const recentActivity = [
    { user: 'Abc', action: t.adminDashboard.activityRegisteredEmployer, time: t.adminDashboard.time2h },
    { user: 'xyz', action: t.adminDashboard.activityApplied, time: t.adminDashboard.time3h },
    { user: 'Design Inc.', action: t.adminDashboard.activityPostedJob, time: t.adminDashboard.time5h },
  ];

  return (
    <DashboardLayout role="admin">
      <DashboardContainer>
        <PageHeader>
          <h1>{t.adminDashboard.title}</h1>
          <p>{t.adminDashboard.subtitle}</p>
        </PageHeader>

        <StatsGrid>
          <StatsCard
            title={t.adminDashboard.statsTotalUsers}
            value="2,458"
            change="+12%"
            changeText={t.adminDashboard.changeFromLastMonth}
            icon={Users}
            color="linear-gradient(135deg, #0E3995 0%, #0055A5 100%)"
            positive
          />
          <StatsCard
            title={t.adminDashboard.statsActiveJobs}
            value="345"
            change="+8%"
            changeText={t.adminDashboard.changeFromLastWeek}
            icon={Briefcase}
            color="linear-gradient(135deg, #F093FB 0%, #F5576C 100%)"
            positive
          />
          <StatsCard
            title={t.adminDashboard.statsCompanies}
            value="156"
            change="+15"
            changeText={t.adminDashboard.changePendingApproval}
            icon={Building2}
            color="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
            positive
          />
          <StatsCard
            title={t.adminDashboard.statsRevenue}
            value="24.5 tỷ VND"
            change="+23%"
            changeText={t.adminDashboard.changeFromLastMonth}
            icon={DollarSign}
            color="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
            positive
          />
        </StatsGrid>

        <Section>
          <SectionHeader>
            <h2>{t.adminDashboard.recentActivity}</h2>
          </SectionHeader>
          
          <Table>
            <thead>
              <tr>
                <th>{t.adminDashboard.tableUser}</th>
                <th>{t.adminDashboard.tableAction}</th>
                <th>{t.adminDashboard.tableTime}</th>
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
