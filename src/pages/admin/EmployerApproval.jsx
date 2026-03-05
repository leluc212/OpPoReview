import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import TableFilter from '../../components/TableFilter';
import { Button } from '../../components/FormElements';
import Modal from '../../components/Modal';
import { Check, X, Eye, FileText, Building, User, Phone } from 'lucide-react';
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

const DetailSection = styled.div`
  margin-bottom: 24px;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${props => props.theme.colors.primary};
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 4px;
    text-transform: uppercase;
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.text};
  }
`;

const FilePreview = styled.div`
  margin-top: 8px;
  padding: 12px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.sm};
  border: 1px solid ${props => props.theme.colors.border};
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const EmployerApproval = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilters, setIndustryFilters] = useState([]);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [verificationRequests, setVerificationRequests] = useState([]);

  // Load verification requests from localStorage
  useEffect(() => {
    const loadVerificationRequests = () => {
      const requests = [];
      
      // Get all keys from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Check if it's a company verification data
        if (key && key.startsWith('companyVerificationData_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            const statusKey = key.replace('Data', 'Status');
            const status = localStorage.getItem(statusKey) || 'pending';
            
            if (status === 'pending') {
              requests.push({
                id: key.replace('companyVerificationData_', ''),
                ...data,
                status: status,
                submittedDate: data.submittedDate || new Date().toISOString()
              });
            }
          } catch (e) {
            console.error('Error parsing verification data:', e);
          }
        }
      }
      
      // If no requests found, check for the default companyVerificationData
      const defaultData = localStorage.getItem('companyVerificationData');
      const defaultStatus = localStorage.getItem('companyVerificationStatus');
      
      if (defaultData && defaultStatus === 'pending') {
        try {
          const data = JSON.parse(defaultData);
          requests.push({
            id: 'default',
            ...data,
            status: defaultStatus,
            submittedDate: data.submittedDate || new Date().toISOString()
          });
        } catch (e) {
          console.error('Error parsing default verification data:', e);
        }
      }
      
      setVerificationRequests(requests);
    };
    
    loadVerificationRequests();
    
    // Reload every 5 seconds to catch new submissions
    const interval = setInterval(loadVerificationRequests, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const filteredVerifications = useMemo(() => {
    return verificationRequests.filter(verification => {
      const matchesSearch = searchTerm === '' || 
        (verification.step2?.companyName && verification.step2.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (verification.step2?.companyNameEn && verification.step2.companyNameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (verification.step4?.email && verification.step4.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesIndustry = industryFilters.length === 0 || 
        (verification.step2?.industry && industryFilters.includes(verification.step2.industry));
      
      return matchesSearch && matchesIndustry;
    });
  }, [verificationRequests, searchTerm, industryFilters]);

  const handleFilterToggle = (filterValue) => {
    setIndustryFilters(prev => 
      prev.includes(filterValue) 
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
  };

  const handleViewDetails = (verification) => {
    setSelectedVerification(verification);
    setIsDetailModalOpen(true);
  };

  const handleApprove = (verificationId) => {
    const statusKey = verificationId === 'default' 
      ? 'companyVerificationStatus' 
      : `companyVerificationStatus_${verificationId}`;
    
    localStorage.setItem(statusKey, 'approved');
    
    // Update state
    setVerificationRequests(prev => 
      prev.filter(req => req.id !== verificationId)
    );
    
    setIsDetailModalOpen(false);
    alert('Đã phê duyệt hồ sơ xác thực công ty!');
  };

  const handleReject = (verificationId) => {
    const statusKey = verificationId === 'default' 
      ? 'companyVerificationStatus' 
      : `companyVerificationStatus_${verificationId}`;
    
    localStorage.setItem(statusKey, 'rejected');
    
    // Update state
    setVerificationRequests(prev => 
      prev.filter(req => req.id !== verificationId)
    );
    
    setIsDetailModalOpen(false);
    alert('Đã từ chối hồ sơ xác thực công ty!');
  };

  return (
    <DashboardLayout role="admin">
      <EmployerApprovalContainer>
        <PageHeader>
          <h1>{t.adminEmployerApproval.title}</h1>
          <p style={{ color: '#94A3B8' }}>{t.adminEmployerApproval.subtitle}</p>
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
            {/* Company Verification Requests */}
            {filteredVerifications.map((verification) => (
              <tr key={verification.id} style={{ background: '#FFF7ED' }}>
                <td style={{ fontWeight: 600 }}>
                  {verification.step2?.companyName || verification.step2?.companyNameEn || 'N/A'}
                  <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 400 }}>
                    🔍 Xác thực công ty
                  </div>
                </td>
                <td>{verification.step4?.email || 'N/A'}</td>
                <td>{verification.step2?.industry || 'N/A'}</td>
                <td style={{ color: '#64748B', fontWeight: 500 }}>
                  {new Date(verification.submittedAt).toLocaleDateString('vi-VN')}
                </td>
                <td><StatusBadge status="pending" /></td>
                <td>
                  <ActionButtons>
                    <Button 
                      type="button"
                      $variant="secondary" 
                      $size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(verification);
                      }}
                    >
                      <Eye /> Chi tiết
                    </Button>
                    <Button 
                      type="button"
                      $variant="primary" 
                      $size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(verification.id);
                      }}
                    >
                      <Check /> Duyệt
                    </Button>
                    <Button 
                      type="button"
                      $variant="danger" 
                      $size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(verification.id);
                      }}
                    >
                      <X /> Từ chối
                    </Button>
                  </ActionButtons>
                </td>
              </tr>
            ))}
            
            {/* Regular Employer Approvals */}
            {filteredEmployers.map((employer, index) => (
              <tr key={`employer-${index}`}>
                <td style={{ fontWeight: 600 }}>{employer.company}</td>
                <td>{employer.email}</td>
                <td>{employer.industry}</td>
                <td style={{ color: '#E2E8F0', fontWeight: 500 }}>{employer.submitted}</td>
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

        {/* Verification Detail Modal */}
        <Modal 
          isOpen={isDetailModalOpen && selectedVerification !== null}
          onClose={() => setIsDetailModalOpen(false)}
          size="large"
        >
          {selectedVerification && (
            <>
              <h2 style={{ marginBottom: '24px' }}>Chi Tiết Hồ Sơ Xác Thực Công Ty</h2>
            
            {/* Step 1: Business License */}
            <DetailSection>
              <h3><FileText /> Giấy Phép Kinh Doanh</h3>
              <DetailGrid>
                <DetailItem>
                  <label>Số Giấy Phép</label>
                  <p>{selectedVerification.step1?.licenseNumber || 'N/A'}</p>
                </DetailItem>
                <DetailItem>
                  <label>Cơ Quan Cấp</label>
                  <p>{selectedVerification.step1?.issuingAuthority || 'N/A'}</p>
                </DetailItem>
                <DetailItem>
                  <label>Ngày Cấp</label>
                  <p>{selectedVerification.step1?.issueDate || 'N/A'}</p>
                </DetailItem>
                <DetailItem>
                  <label>Ngày Hết Hạn</label>
                  <p>{selectedVerification.step1?.expiryDate || 'N/A'}</p>
                </DetailItem>
              </DetailGrid>
              {selectedVerification.step1?.businessLicense && (
                <FilePreview>
                  <a href={selectedVerification.step1?.businessLicense} target="_blank" rel="noopener noreferrer">
                    <FileText size={16} />
                    Xem Giấy Phép Kinh Doanh
                  </a>
                </FilePreview>
              )}
            </DetailSection>

            {/* Step 2: Company Info */}
            <DetailSection>
              <h3><Building /> Thông Tin Doanh Nghiệp</h3>
              <DetailGrid>
                <DetailItem>
                  <label>Tên Công Ty (Tiếng Việt)</label>
                  <p>{selectedVerification.step2?.companyName || 'N/A'}</p>
                </DetailItem>
                <DetailItem>
                  <label>Tên Công Ty (Tiếng Anh)</label>
                  <p>{selectedVerification.step2?.companyNameEn || 'N/A'}</p>
                </DetailItem>
                <DetailItem>
                  <label>Mã Số Thuế</label>
                  <p>{selectedVerification.step2?.taxCode || 'N/A'}</p>
                </DetailItem>
                <DetailItem>
                  <label>Năm Thành Lập</label>
                  <p>{selectedVerification.step2?.foundedYear || 'N/A'}</p>
                </DetailItem>
                <DetailItem>
                  <label>Ngành Nghề</label>
                  <p>{selectedVerification.step2?.industry || 'N/A'}</p>
                </DetailItem>
                <DetailItem>
                  <label>Quy Mô</label>
                  <p>{selectedVerification.step2?.companySize || 'N/A'}</p>
                </DetailItem>
                <DetailItem style={{ gridColumn: '1 / -1' }}>
                  <label>Website</label>
                  <p>{selectedVerification.step2?.website || 'N/A'}</p>
                </DetailItem>
                <DetailItem style={{ gridColumn: '1 / -1' }}>
                  <label>Mô Tả</label>
                  <p>{selectedVerification.step2?.description || 'N/A'}</p>
                </DetailItem>
              </DetailGrid>
            </DetailSection>

            {/* Step 3: Representative */}
            <DetailSection>
              <h3><User /> Người Đại Diện Pháp Luật</h3>
              <DetailGrid>
                <DetailItem>
                  <label>Họ Tên</label>
                  <p>{selectedVerification.step3?.representativeName || 'N/A'}</p>
                </DetailItem>
                <DetailItem>
                  <label>Chức Vụ</label>
                  <p>{selectedVerification.step3?.position || 'N/A'}</p>
                </DetailItem>
                <DetailItem>
                  <label>Số CMND/CCCD</label>
                  <p>{selectedVerification.step3?.idNumber || 'N/A'}</p>
                </DetailItem>
              </DetailGrid>
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                {selectedVerification.step3?.idFrontImage && (
                  <FilePreview style={{ flex: 1 }}>
                    <a href={selectedVerification.step3?.idFrontImage} target="_blank" rel="noopener noreferrer">
                      <FileText size={16} />
                      CMND/CCCD Mặt Trước
                    </a>
                  </FilePreview>
                )}
                {selectedVerification.step3?.idBackImage && (
                  <FilePreview style={{ flex: 1 }}>
                    <a href={selectedVerification.step3?.idBackImage} target="_blank" rel="noopener noreferrer">
                      <FileText size={16} />
                      CMND/CCCD Mặt Sau
                    </a>
                  </FilePreview>
                )}
              </div>
              {selectedVerification.step3?.authorizationLetter && (
                <FilePreview style={{ marginTop: '16px' }}>
                  <a href={selectedVerification.step3?.authorizationLetter} target="_blank" rel="noopener noreferrer">
                    <FileText size={16} />
                    Giấy Ủy Quyền
                  </a>
                </FilePreview>
              )}
            </DetailSection>

            {/* Step 4: Contact */}
            <DetailSection>
              <h3><Phone /> Thông Tin Liên Hệ</h3>
              <DetailGrid>
                <DetailItem style={{ gridColumn: '1 / -1' }}>
                  <label>Địa Chỉ</label>
                  <p>{selectedVerification.step4?.address || 'N/A'}</p>
                </DetailItem>
                <DetailItem>
                  <label>Tỉnh/Thành Phố</label>
                  <p>{selectedVerification.step4?.city || 'N/A'}</p>
                </DetailItem>
                <DetailItem>
                  <label>Quận/Huyện</label>
                  <p>{selectedVerification.step4?.district || 'N/A'}</p>
                </DetailItem>
                <DetailItem>
                  <label>Phường/Xã</label>
                  <p>{selectedVerification.step4?.ward || 'N/A'}</p>
                </DetailItem>
                <DetailItem>
                  <label>Số Điện Thoại</label>
                  <p>{selectedVerification.step4?.phone || 'N/A'}</p>
                </DetailItem>
                <DetailItem style={{ gridColumn: '1 / -1' }}>
                  <label>Email Liên Hệ</label>
                  <p>{selectedVerification.step4?.email || 'N/A'}</p>
                </DetailItem>
                <DetailItem style={{ gridColumn: '1 / -1' }}>
                  <label>Liên Hệ Khẩn Cấp</label>
                  <p>{selectedVerification.step4?.emergencyContact || 'N/A'}</p>
                </DetailItem>
              </DetailGrid>
            </DetailSection>

            <ModalActions>
              <Button 
                type="button"
                $variant="secondary" 
                onClick={() => setIsDetailModalOpen(false)}
              >
                Đóng
              </Button>
              <Button 
                type="button"
                $variant="danger" 
                onClick={() => handleReject(selectedVerification.id)}
              >
                <X /> Từ Chối
              </Button>
              <Button 
                type="button"
                $variant="primary" 
                onClick={() => handleApprove(selectedVerification.id)}
              >
                <Check /> Phê Duyệt
              </Button>
            </ModalActions>
            </>
          )}
        </Modal>
      </EmployerApprovalContainer>
    </DashboardLayout>
  );
};

export default EmployerApproval;
