import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import { Button } from '../../components/FormElements';
import { Check, X } from 'lucide-react';

const EmployerApprovalContainer = styled.div``;

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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const EmployerApproval = () => {
  const pendingEmployers = [
    { company: 'TechCorp Inc.', email: 'hr@techcorp.com', industry: 'Technology', submitted: '2024-02-10', status: 'pending' },
    { company: 'Design Studio', email: 'info@designstudio.com', industry: 'Design', submitted: '2024-02-11', status: 'pending' },
    { company: 'Finance Group', email: 'contact@financegroup.com', industry: 'Finance', submitted: '2024-02-12', status: 'pending' },
  ];

  return (
    <DashboardLayout role="admin">
      <EmployerApprovalContainer>
        <PageHeader>
          <h1>Employer Approval</h1>
          <p style={{ color: '#64748B' }}>Review and approve employer registrations</p>
        </PageHeader>

        <Table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Email</th>
              <th>Industry</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingEmployers.map((employer, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 600 }}>{employer.company}</td>
                <td>{employer.email}</td>
                <td>{employer.industry}</td>
                <td style={{ color: '#64748B' }}>{employer.submitted}</td>
                <td><StatusBadge status={employer.status} /></td>
                <td>
                  <ActionButtons>
                    <Button $variant="primary" $size="small">
                      <Check /> Approve
                    </Button>
                    <Button $variant="danger" $size="small">
                      <X /> Reject
                    </Button>
                  </ActionButtons>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </EmployerApprovalContainer>
    </DashboardLayout>
  );
};

export default EmployerApproval;
