# Hướng Dẫn Tối Ưu UI - Trang Quản Lý Ứng Viên

## Tổng Quan
Tài liệu này hướng dẫn cập nhật giao diện trang `CandidatesManagement.jsx` theo chuẩn UX/UI chuyên nghiệp.

## 1. Cấu Trúc Toolbar Thu Hẹp (40% chiều ngang)

### Thay thế FilterSection hiện tại bằng:

```jsx
const Toolbar = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  flex: 0 0 40%;
  max-width: 400px;
  position: relative;
  
  @media (max-width: 768px) {
    flex: 1;
    max-width: 100%;
  }
  
  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    width: 18px;
    height: 18px;
  }
  
  input {
    width: 100%;
    padding: 10px 14px 10px 42px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    color: #1f2937;
    transition: all 0.2s;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    &::placeholder {
      color: #9ca3af;
    }
  }
`;

const SegmentedControl = styled.div`
  display: flex;
  gap: 4px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SegmentButton = styled.button`
  padding: 8px 20px;
  border: none;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#1f2937' : '#6b7280'};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: ${props => props.$active ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};
  
  @media (max-width: 768px) {
    flex: 1;
    padding: 8px 12px;
    font-size: 12px;
  }
  
  &:hover {
    background: ${props => props.$active ? 'white' : '#e5e7eb'};
  }
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
  
  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
  }
`;
```

## 2. Cải Tiến Bảng Dữ Liệu

### Thêm các styled components mới:

```jsx
const TableWrapper = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: 14px 16px;
    background: #f9fafb;
    font-weight: 700;
    font-size: 12px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  td {
    padding: 14px 16px;
    border-bottom: 1px solid #f3f4f6;
    font-size: 14px;
    color: #1f2937;
  }
  
  tbody tr:hover {
    background: #f9fafb;
  }
  
  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const PositionTag = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: #e0e7ff;
  color: #4338ca;
  white-space: nowrap;
`;

const TrustScoreContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => {
    if (props.$score >= 80) return '#10b981';
    if (props.$score >= 50) return '#f59e0b';
    return '#ef4444';
  }};
  width: ${props => props.$score}%;
  transition: width 0.3s ease;
  border-radius: 3px;
`;

const ScoreText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  min-width: 35px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 6px 14px;
  border: 1px solid ${props => {
    if (props.$variant === 'view') return '#3b82f6';
    if (props.$variant === 'lock') return '#ef4444';
    if (props.$variant === 'approve') return '#10b981';
    return '#6b7280';
  }};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  color: ${props => {
    if (props.$variant === 'view') return '#3b82f6';
    if (props.$variant === 'lock') return '#ef4444';
    if (props.$variant === 'approve') return '#10b981';
    return '#6b7280';
  }};
  white-space: nowrap;
  
  &:hover {
    background: ${props => {
      if (props.$variant === 'view') return '#3b82f6';
      if (props.$variant === 'lock') return '#ef4444';
      if (props.$variant === 'approve') return '#10b981';
      return '#6b7280';
    }};
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;
```

## 3. Table Footer với Phân Trang

```jsx
const TableFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const PaginationInfo = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${props => props.$active ? '#3b82f6' : '#e5e7eb'};
  background: ${props => props.$active ? '#3b82f6' : 'white'};
  color: ${props => props.$active ? 'white' : '#1f2937'};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 36px;
  
  &:hover:not(:disabled) {
    border-color: #3b82f6;
    background: ${props => props.$active ? '#3b82f6' : '#eff6ff'};
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
```

## 4. Cập Nhật Component JSX

### Trong component CandidatesManagement:

```jsx
const CandidatesManagement = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sample data với position và trustScore
  const candidates = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      position: 'Nhân viên phục vụ',
      trustScore: 95,
      eKYC: true,
      status: 'approved',
      joinDate: '2024-01-15',
      reviewDate: '2024-01-16'
    },
    // ... thêm data
  ];

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

  return (
    <DashboardLayout role="admin" key={language}>
      <PageContainer>
        <PageHeader>
          <h1>{language === 'vi' ? 'Quản Lý Ứng Viên' : 'Candidates Management'}</h1>
          <p>{language === 'vi' ? 'Quản lý và theo dõi ứng viên' : 'Manage and track candidates'}</p>
        </PageHeader>

        {/* Stats Cards */}
        <StatsGrid>
          {/* ... stat cards */}
        </StatsGrid>

        {/* Toolbar */}
        <Toolbar>
          <SearchBox>
            <Search />
            <input
              type="text"
              placeholder={language === 'vi' ? 'Tìm kiếm theo tên hoặc email...' : 'Search by name or email...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          
          <SegmentedControl>
            <SegmentButton
              $active={statusFilter === 'all'}
              onClick={() => setStatusFilter('all')}
            >
              {language === 'vi' ? 'Tất cả' : 'All'}
            </SegmentButton>
            <SegmentButton
              $active={statusFilter === 'pending'}
              onClick={() => setStatusFilter('pending')}
            >
              {language === 'vi' ? 'Chờ duyệt' : 'Pending'}
            </SegmentButton>
            <SegmentButton
              $active={statusFilter === 'violation'}
              onClick={() => setStatusFilter('violation')}
            >
              {language === 'vi' ? 'Vi phạm' : 'Violation'}
            </SegmentButton>
          </SegmentedControl>

          <ExportButton>
            {language === 'vi' ? 'Xuất báo cáo' : 'Export Report'}
          </ExportButton>
        </Toolbar>

        {/* Table */}
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>{language === 'vi' ? 'Tên' : 'Name'}</th>
                <th>{language === 'vi' ? 'Email' : 'Email'}</th>
                <th>{language === 'vi' ? 'Vị trí mong muốn' : 'Desired Position'}</th>
                <th>{language === 'vi' ? 'Điểm tin cậy' : 'Trust Score'}</th>
                <th>{language === 'vi' ? 'eKYC' : 'eKYC'}</th>
                <th>{language === 'vi' ? 'Trạng thái' : 'Status'}</th>
                <th>{language === 'vi' ? 'Hành động' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {currentCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td style={{ fontWeight: 600 }}>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td>
                    <PositionTag>{candidate.position}</PositionTag>
                  </td>
                  <td>
                    <TrustScoreContainer>
                      <ProgressBar>
                        <ProgressFill $score={candidate.trustScore} />
                      </ProgressBar>
                      <ScoreText>{candidate.trustScore}</ScoreText>
                    </TrustScoreContainer>
                  </td>
                  <td>{candidate.eKYC ? '✓' : '✗'}</td>
                  <td>{candidate.status}</td>
                  <td>
                    <ActionButtons>
                      <ActionButton $variant="view">
                        {language === 'vi' ? 'Xem' : 'View'}
                      </ActionButton>
                      <ActionButton $variant="lock">
                        {language === 'vi' ? 'Khóa' : 'Lock'}
                      </ActionButton>
                      <ActionButton $variant="approve">
                        {language === 'vi' ? 'Duyệt' : 'Approve'}
                      </ActionButton>
                    </ActionButtons>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <TableFooter>
            <PaginationInfo>
              {language === 'vi' 
                ? `Đang xem ${startIndex + 1}-${Math.min(endIndex, filteredCandidates.length)} trên ${filteredCandidates.length} kết quả`
                : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredCandidates.length)} of ${filteredCandidates.length} results`
              }
            </PaginationInfo>
            
            <PaginationControls>
              <PageButton
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ←
              </PageButton>
              {[...Array(totalPages)].map((_, i) => (
                <PageButton
                  key={i + 1}
                  $active={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PageButton>
              ))}
              <PageButton
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                →
              </PageButton>
            </PaginationControls>
          </TableFooter>
        </TableWrapper>
      </PageContainer>
    </DashboardLayout>
  );
};
```

## 5. Nguyên Tắc Thiết Kế

### Màu Pastel cho Badges:
- Approved: `background: #dcfce7; color: #15803d;`
- Pending: `background: #fef3c7; color: #ca8a04;`
- Violation: `background: #fee2e2; color: #dc2626;`
- Position Tag: `background: #e0e7ff; color: #4338ca;`

### Shadow Đồng Nhất:
- Cards: `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);`
- Hover: `box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);`
- Active: `box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);`

### Padding Chuẩn:
- Table cells: `padding: 14px 16px;`
- Buttons: `padding: 6px 14px;` (small), `padding: 10px 20px;` (medium)
- Cards: `padding: 16px 20px;`

## Kết Luận

Áp dụng các thay đổi trên sẽ tạo ra một giao diện chuyên nghiệp, dễ sử dụng và thống nhất về mặt thiết kế.
