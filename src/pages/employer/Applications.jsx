import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import { Eye, Download } from 'lucide-react';

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
  const applications = [
    { candidate: 'John Smith', job: 'Senior React Developer', applied: '2 hours ago', status: 'pending' },
    { candidate: 'Jane Doe', job: 'Full Stack Engineer', applied: '5 hours ago', status: 'pending' },
    { candidate: 'Bob Johnson', job: 'UI/UX Designer', applied: '1 day ago', status: 'approved' },
    { candidate: 'Alice Brown', job: 'Senior React Developer', applied: '2 days ago', status: 'rejected' },
  ];

  return (
    <DashboardLayout role="employer">
      <ApplicationsContainer>
        <PageHeader>
          <h1>Applications</h1>
          <p style={{ color: '#64748B' }}>Review and manage candidate applications</p>
        </PageHeader>

        <Table>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Position</th>
              <th>Applied</th>
              <th>Status</th>
              <th>Actions</th>
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
                  <ActionButton><Eye /> View Profile</ActionButton>
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
