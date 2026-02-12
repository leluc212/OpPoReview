import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import { Users, Briefcase, Building2, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

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
  const { language } = useLanguage();
  const t = useTranslations(language);

  const recentActivity = [
    { user: 'FPT Software', action: t.adminDashboard.activityRegisteredEmployer, time: t.adminDashboard.time2h },
    { user: 'John Doe', action: t.adminDashboard.activityApplied, time: t.adminDashboard.time3h },
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
