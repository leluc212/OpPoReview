import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import { Briefcase, Users, Eye, TrendingUp } from 'lucide-react';
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  
  div {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  
  a {
    font-weight: 600;
    font-size: 15px;
    transition: all ${props => props.theme.transitions.fast};
    
    &:hover {
      text-decoration: underline;
      transform: translateX(4px);
      display: inline-block;
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

const EmployerDashboard = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  const recentApplications = [
    { candidate: 'Hiếu sàn', job: 'Senior React Developer', applied: t.employer.applied2h, status: 'pending' },
    { candidate: 'Duy sàn', job: 'Thu ngân', applied: t.employer.applied5h, status: 'reviewed' },
    { candidate: 'Nheo', job: 'Nhân viên pha chế', applied: t.employer.applied1d, status: 'approved' },
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
