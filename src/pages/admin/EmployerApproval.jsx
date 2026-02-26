import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import TableFilter from '../../components/TableFilter';
import { Button } from '../../components/FormElements';
import { Check, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilters, setIndustryFilters] = useState([]);

  const [pendingEmployers] = useState([
    { company: 'FPT Software Inc.', email: 'hr@FPT Software.com', industry: 'Technology', submitted: '2024-02-10', status: 'pending' },
    { company: 'Design Studio', email: 'info@designstudio.com', industry: 'Design', submitted: '2024-02-11', status: 'pending' },
    { company: 'Finance Group', email: 'contact@financegroup.com', industry: 'Finance', submitted: '2024-02-12', status: 'pending' },
  ]);

  const filterOptions = [
    { value: 'Technology', label: t.landing.categories.technology },
    { value: 'Design', label: t.landing.categories.design },
    { value: 'Finance', label: t.landing.categories.finance },
    { value: 'Healthcare', label: t.landing.categories.healthcare },
    { value: 'Education', label: t.landing.categories.education },
  ];

  const filteredEmployers = useMemo(() => {
    return pendingEmployers.filter(employer => {
      const matchesSearch = searchTerm === '' || 
        employer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesIndustry = industryFilters.length === 0 || 
        industryFilters.includes(employer.industry);
      
      return matchesSearch && matchesIndustry;
    });
  }, [pendingEmployers, searchTerm, industryFilters]);

  const handleFilterToggle = (filterValue) => {
    setIndustryFilters(prev => 
      prev.includes(filterValue) 
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
  };

  return (
    <DashboardLayout role="admin">
      <EmployerApprovalContainer>
        <PageHeader>
          <h1>{t.adminEmployerApproval.title}</h1>
          <p style={{ color: '#64748B' }}>{t.adminEmployerApproval.subtitle}</p>
        </PageHeader>

        <TableFilter 
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filterOptions={filterOptions}
          activeFilters={industryFilters}
          onFilterToggle={handleFilterToggle}
          searchPlaceholder={t.common.search}
        />

        <Table>
          <thead>
            <tr>
              <th>{t.adminEmployerApproval.company}</th>
              <th>{t.adminEmployerApproval.email}</th>
              <th>{t.adminEmployerApproval.industry}</th>
              <th>{t.adminEmployerApproval.submitted}</th>
              <th>{t.adminEmployerApproval.status}</th>
              <th>{t.adminEmployerApproval.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployers.map((employer, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 600 }}>{employer.company}</td>
                <td>{employer.email}</td>
                <td>{employer.industry}</td>
                <td style={{ color: '#64748B' }}>{employer.submitted}</td>
                <td><StatusBadge status={employer.status} /></td>
                <td>
                  <ActionButtons>
                    <Button $variant="primary" $size="small">
                      <Check /> {t.adminEmployerApproval.approve}
                    </Button>
                    <Button $variant="danger" $size="small">
                      <X /> {t.adminEmployerApproval.reject}
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
