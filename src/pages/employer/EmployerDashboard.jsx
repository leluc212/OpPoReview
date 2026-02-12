import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import { Briefcase, Users, Eye, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

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
  const { language } = useLanguage();
  const t = useTranslations(language);

  const recentApplications = [
    { candidate: 'Hiếu sàn', job: 'Senior React Developer', applied: t.employer.applied2h, status: 'pending' },
    { candidate: 'Duy sàn', job: 'Thu ngân', applied: t.employer.applied5h, status: 'reviewed' },
    { candidate: 'Nheo', job: 'UI/UX Designer', applied: t.employer.applied1d, status: 'approved' },
  ];

  return (
    <DashboardLayout role="employer">
      <DashboardContainer>
        <PageHeader>
          <div>
            <h1>{t.employer.dashboardTitle}</h1>
            <p>{t.employer.dashboardSubtitle}</p>
          </div>
        </PageHeader>

        <StatsGrid>
          <StatsCard
            title={t.employer.statsActiveJobs}
            value="12"
            change="+3"
            changeText={t.employer.changeFromLastMonth}
            icon={Briefcase}
            color="linear-gradient(135deg, #0E3995 0%, #0055A5 100%)"
            positive
          />
          <StatsCard
            title={t.employer.statsTotalApplications}
            value="248"
            change="+45%"
            changeText={t.employer.changeFromLastMonth}
            icon={Users}
            color="linear-gradient(135deg, #F093FB 0%, #F5576C 100%)"
            positive
          />
          <StatsCard
            title={t.employer.statsProfileViews}
            value="1,234"
            change="+12%"
            changeText={t.employer.changeFromLastWeek}
            icon={Eye}
            color="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
            positive
          />
          <StatsCard
            title={t.employer.statsHired}
            value="8"
            change="+2"
            changeText={t.employer.changeThisMonth}
            icon={TrendingUp}
            color="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
            positive
          />
        </StatsGrid>

        <Section>
          <SectionHeader>
            <h2>{t.employer.recentApplications}</h2>
            <a href="/employer/applications" style={{ color: '#0E3995', fontWeight: 500 }}>{t.employer.viewAll} →</a>
          </SectionHeader>
          
          <Table>
            <thead>
              <tr>
                <th>{t.employer.tableCandidate}</th>
                <th>{t.employer.tablePosition}</th>
                <th>{t.employer.tableApplied}</th>
                <th>{t.employer.tableStatus}</th>
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
