import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import { Eye } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

const ApplicationsContainer = styled.div``;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
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

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    opacity: 0.9;
  }
`;

const Applications = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  const applications = [
    { candidate: 'Hiếu sàn', job: 'Senior React Developer', applied: t.employer.applied2h, status: 'pending' },
    { candidate: 'Duy sàn', job: 'Thu ngân', applied: t.employer.applied5h, status: 'pending' },
    { candidate: 'Nheo', job: 'Nhân viên pha chế', applied: t.employer.applied1d, status: 'approved' },
    { candidate: 'Gemmin', job: 'Senior React Developer', applied: t.employerJobs.posted2d || '2 days ago', status: 'rejected' },
    { candidate: 'Zun', job: 'Nhân viên phục vụ', applied: t.employerJobs.posted1w || t.employer.applied1d, status: 'pending' },
  ];

  return (
    <DashboardLayout role="employer">
      <ApplicationsContainer>
        <PageHeader>
          <h1>{t.employerApplications.title}</h1>
          <p style={{ color: '#64748B' }}>{t.employerApplications.subtitle}</p>
        </PageHeader>

        <Table>
          <thead>
            <tr>
              <th>{t.employerApplications.tableCandidate}</th>
              <th>{t.employerApplications.tablePosition}</th>
              <th>{t.employerApplications.tableApplied}</th>
              <th>{t.employerApplications.tableStatus}</th>
              <th>{t.employerApplications.tableActions}</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 600 }}>{app.candidate}</td>
                <td>{app.job}</td>
                <td style={{ color: '#64748B' }}>{app.applied}</td>
                <td><StatusBadge status={app.status} /></td>
                <td>
                  <ActionButton><Eye /> {t.employerApplications.viewProfile}</ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ApplicationsContainer>
    </DashboardLayout>
  );
};

export default Applications;
