import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/FormElements';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

const JobManagementContainer = styled.div``;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgDark};
  color: ${props => props.theme.colors.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const JobManagement = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  const jobs = [
    { id: 1, title: 'Senior React Developer', applicants: 45, status: 'active', posted: t.employerJobs.posted2d },
    { id: 2, title: 'Thu ngân', applicants: 32, status: 'active', posted: t.employerJobs.posted1w },
    { id: 3, title: 'UI/UX Designer', applicants: 28, status: 'inactive', posted: t.employerJobs.posted2w },
  ];

  return (
    <DashboardLayout role="employer">
      <JobManagementContainer>
        <PageHeader>
          <h1>{t.employerJobs.title}</h1>
          <Button $variant="primary">+ {t.employerJobs.postNewJob}</Button>
        </PageHeader>

        <Table>
          <thead>
            <tr>
              <th>{t.employerJobs.tableTitle}</th>
              <th>{t.employerJobs.tableApplicants}</th>
              <th>{t.employerJobs.tableStatus}</th>
              <th>{t.employerJobs.tablePosted}</th>
              <th>{t.employerJobs.tableActions}</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td style={{ fontWeight: 600 }}>{job.title}</td>
                <td>{job.applicants}</td>
                <td><StatusBadge status={job.status} /></td>
                <td style={{ color: '#64748B' }}>{job.posted}</td>
                <td>
                  <ActionButtons>
                    <IconButton><Edit /></IconButton>
                    <IconButton><Trash2 /></IconButton>
                  </ActionButtons>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </JobManagementContainer>
    </DashboardLayout>
  );
};

export default JobManagement;
