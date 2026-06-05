import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { s3Images } from '../utils/s3Images';
import {
  ArrowLeft, Shield, Share2, UserCheck, Lock,
  HelpCircle, Eye, Database, ListChecks, Mail,
  AlertOctagon, AlertTriangle, Info, MessageSquare, Flag
} from 'lucide-react';

const Wrapper = styled.div`
  min-height: 100vh;
  background: ${p => p.$isDark ? '#0f172a' : '#f8fafc'};
  color: ${p => p.$isDark ? '#e2e8f0' : '#1e293b'};
`;

const Header = styled.div`
  background: linear-gradient(135deg, #1a62ff 0%, #002e9d 100%);
  padding: 40px 24px 64px;
  text-align: center;
  position: relative;
`;

const BackBtn = styled.button`
  position: absolute;
  top: 20px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,0.85);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.2s;
  &:hover { color: #fff; }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 14px;
`;

const HeaderTitle = styled.h1`
  font-size: clamp(1.1rem, 2.5vw, 1.7rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 8px;
  letter-spacing: -0.3px;
`;

const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const MetaTag = styled.span`
  background: rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.92);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 0.78rem;
  font-weight: 600;
`;

const SuccessBox = styled.div`
  background: ${p => p.$isDark ? 'rgba(16,185,129,0.1)' : '#f0fdf4'};
  border-left: 4px solid #10b981;
  border-radius: 0 10px 10px 0;
  padding: 12px 16px;
  margin: 12px 0;
  font-size: 0.88rem;
  color: ${p => p.$isDark ? '#6ee7b7' : '#065f46'};
  font-weight: 500;
  line-height: 1.7;
`;

const TabRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: 9px 20px;
  border-radius: 20px;
  border: 1.5px solid ${p => p.$active ? '#fff' : 'rgba(255,255,255,0.35)'};
  background: ${p => p.$active ? '#fff' : 'rgba(255,255,255,0.12)'};
  color: ${p => p.$active ? '#1a62ff' : 'rgba(255,255,255,0.85)'};
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover { background: ${p => p.$active ? '#fff' : 'rgba(255,255,255,0.22)'}; }
`;

const Container = styled.div`
  max-width: 860px;
  margin: -28px auto 0;
  padding: 0 24px 80px;
  position: relative;
  z-index: 1;
`;

const Card = styled.div`
  background: ${p => p.$isDark ? 'rgba(30,41,59,0.95)' : '#fff'};
  border: 1px solid ${p => p.$isDark ? 'rgba(75,85,99,0.3)' : '#e2e8f0'};
  border-radius: 16px;
  padding: 28px 32px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);

  @media (max-width: 640px) {
    padding: 20px 18px;
  }
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.05rem;
  font-weight: 800;
  color: #1a62ff;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${p => p.$isDark ? 'rgba(26,98,255,0.2)' : '#eff6ff'};
  svg { flex-shrink: 0; }
`;

const SubTitle = styled.h3`
  font-size: 0.92rem;
  font-weight: 700;
  color: ${p => p.$isDark ? '#e2e8f0' : '#1e293b'};
  margin: 14px 0 6px;
`;

const P = styled.p`
  font-size: 0.88rem;
  line-height: 1.85;
  color: ${p => p.$isDark ? '#94a3b8' : '#475569'};
  margin-bottom: 8px;
`;

const UL = styled.ul`
  padding-left: 18px;
  margin: 6px 0 10px;
  li {
    font-size: 0.88rem;
    line-height: 1.85;
    color: ${p => p.$isDark ? '#94a3b8' : '#475569'};
    margin-bottom: 3px;
  }
`;

const HighlightBox = styled.div`
  background: ${p => p.$isDark ? 'rgba(26,98,255,0.1)' : '#eff6ff'};
  border-left: 4px solid #1a62ff;
  border-radius: 0 10px 10px 0;
  padding: 12px 16px;
  margin: 12px 0;
  font-size: 0.88rem;
  color: ${p => p.$isDark ? '#93c5fd' : '#1e40af'};
  font-weight: 500;
  line-height: 1.7;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  margin: 16px 0;
  border-radius: 12px;
  border: 1px solid ${p => p.$isDark ? 'rgba(75,85,99,0.3)' : '#e2e8f0'};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  text-align: left;
  
  th {
     background: ${p => p.$isDark ? 'rgba(26,98,255,0.15)' : '#eff6ff'};
     color: ${p => p.$isDark ? '#e2e8f0' : '#1e293b'};
     padding: 12px 16px;
     font-weight: 700;
     border-bottom: 1.5px solid ${p => p.$isDark ? 'rgba(26,98,255,0.2)' : '#dbeafe'};
  }
  
  td {
    padding: 12px 16px;
    border-bottom: 1px solid ${p => p.$isDark ? 'rgba(75,85,99,0.2)' : '#f1f5f9'};
    color: ${p => p.$isDark ? '#94a3b8' : '#475569'};
    line-height: 1.6;
    vertical-align: top;
  }

  tr:last-child td { border-bottom: none; }
`;

const LevelCard = styled.div`
  background: ${p => p.$bg};
  border-left: 5px solid ${p => p.$color};
  padding: 16px;
  border-radius: 0 12px 12px 0;
  margin-bottom: 16px;

  .lvl-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    font-weight: 800;
    color: ${p => p.$color};
    margin-bottom: 8px;
  }
  .lvl-desc {
    font-size: 0.85rem;
    color: ${p => p.$isDark ? '#cbd5e1' : '#334155'};
    line-height: 1.7;
  }
`;

const FooterBox = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: ${p => p.$isDark ? '#475569' : '#94a3b8'};
  margin-top: 32px;
  line-height: 1.7;
  a { color: #1a62ff; text-decoration: none; font-weight: 600; }
  .slogan {
     margin-top: 14px;
     font-size: 0.75rem;
     font-weight: 700;
     color: #1a62ff;
     text-transform: uppercase;
     letter-spacing: 0.5px;
  }
`;

const RegisterPolicyPage = () => {
  const { language } = useLanguage();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const vi = language === 'vi';
  const [tab, setTab] = useState('privacy');

  return (
    <Wrapper $isDark={isDarkMode}>
      <Header>
        <BackBtn onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          {vi ? 'Quay lại' : 'Back'}
        </BackBtn>
        <Logo>
          <img src={s3Images.system.logo} alt="Ốp Pờ" style={{ height: 52, objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
        </Logo>
        <HeaderTitle>
          {tab === 'privacy' 
            ? (vi ? 'CHÍNH SÁCH 02: BẢO MẬT & DỮ LIỆU CÁ NHÂN' : 'POLICY 02: PRIVACY & PERSONAL DATA')
            : (vi ? 'CHÍNH SÁCH 09: VI PHẠM & XỬ LÝ TÀI KHOẢN' : 'POLICY 09: VIOLATION & ACCOUNT HANDLING')
          }
        </HeaderTitle>
        <HeaderMeta>
          <MetaTag>{vi ? 'Áp dụng: Tất cả người dùng' : 'Applies to: All users'}</MetaTag>
          <MetaTag>{vi ? 'Nền tảng: Web & App' : 'Platform: Web & App'}</MetaTag>
        </HeaderMeta>

        <TabRow>
          <Tab $active={tab === 'privacy'} onClick={() => setTab('privacy')}>
            <Shield size={13} />
            {vi ? 'Chính Sách 02 · Bảo Mật' : 'Policy 02 · Privacy'}
          </Tab>
          <Tab $active={tab === 'violation'} onClick={() => setTab('violation')}>
            <AlertOctagon size={13} />
            {vi ? 'Chính Sách 09 · Vi Phạm' : 'Policy 09 · Violation'}
          </Tab>
        </TabRow>
      </Header>

      <Container>
        
        {/* ══════════════════════════════════
            TAB 02 — BẢO MẬT & DỮ LIỆU
        ══════════════════════════════════ */}
        {tab === 'privacy' && (
          <>
            <Card $isDark={isDarkMode}>
              <HighlightBox $isDark={isDarkMode}>
                {vi
                  ? 'Ốp Pờ hiểu rằng thông tin cá nhân của bạn rất quan trọng. Chúng mình cam kết bảo vệ dữ liệu của bạn một cách minh bạch và có trách nhiệm.'
                  : 'Ốp Pờ understands that your personal information is very important. We are committed to protecting your data transparently and responsibly.'}
              </HighlightBox>
            </Card>

            <Card $isDark={isDarkMode}>
              <SectionTitle $isDark={isDarkMode}>
                <Database size={19} />
                {vi ? '1. Dữ liệu thu thập' : '1. Collected Data'}
              </SectionTitle>
              <SubTitle $isDark={isDarkMode}>{vi ? '1.1 Thông tin cung cấp trực tiếp' : '1.1 Information provided directly'}</SubTitle>
              <UL $isDark={isDarkMode}>
                <li>{vi ? 'Thông tin cá nhân cơ bản: họ tên, ngày sinh, giới tính, số điện thoại, địa chỉ email, CCCD.' : 'Basic info: full name, DOB, gender, phone, email, identity.'}</li>
                <li>{vi ? 'Thông tin nghề nghiệp: kinh nghiệm, kỹ năng, lịch sử công việc, CV.' : 'Professional: experience, skills, history, CV.'}</li>
                <li>{vi ? 'Thông tin doanh nghiệp (NTD): tên, địa chỉ, mã số thuế, GPKD, người đại diện.' : 'Business: name, address, tax ID, license, rep info.'}</li>
                <li>{vi ? 'Nội dung trao đổi: tin nhắn, phản hồi, đánh giá.' : 'Communications: messages, feedback, ratings.'}</li>
              </UL>
              <SubTitle $isDark={isDarkMode}>{vi ? '1.2 Dữ liệu tự động thu thập' : '1.2 Automatically collected data'}</SubTitle>
              <UL $isDark={isDarkMode}>
                <li>{vi ? 'Địa chỉ IP, loại thiết bị, hệ điều hành, phiên bản trình duyệt/app.' : 'IP, device, OS, browser version.'}</li>
                <li>{vi ? 'Lịch sử hoạt động: tìm kiếm, xem tin, thao tác ứng tuyển, thời gian truy cập.' : 'Activity: searches, views, applications, timing.'}</li>
                <li>{vi ? 'Dữ liệu vị trí (nếu được cho phép) để gợi ý tin phù hợp gần bạn.' : 'Location (if permitted) for nearby suggestions.'}</li>
              </UL>
            </Card>

            <Card $isDark={isDarkMode}>
              <SectionTitle $isDark={isDarkMode}>
                <ListChecks size={19} />
                {vi ? '2. Mục đích sử dụng dữ liệu' : '2. Purpose of Data Use'}
              </SectionTitle>
              <TableWrapper $isDark={isDarkMode}>
                <Table $isDark={isDarkMode}>
                  <thead>
                    <tr>
                      <th>{vi ? 'Mục đích' : 'Purpose'}</th>
                      <th>{vi ? 'Chi tiết' : 'Details'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{vi ? 'Kết nối việc làm' : 'Job matching'}</td>
                      <td>{vi ? 'Kết nối ứng viên với NTD phù hợp dựa trên kỹ năng, kinh nghiệm, vị trí địa lý' : 'Matching based on skills and location'}</td>
                    </tr>
                    <tr>
                      <td>{vi ? 'Cải thiện sản phẩm' : 'Improvement'}</td>
                      <td>{vi ? 'Phân tích hành vi để tối ưu tính năng và trải nghiệm nền tảng' : 'Optimize features and experience'}</td>
                    </tr>
                    <tr>
                      <td>{vi ? 'Thông báo' : 'Notifications'}</td>
                      <td>{vi ? 'Gửi tin việc làm mới, cập nhật ứng tuyển, nhắc lịch tìm việc' : 'Alerts and reminders'}</td>
                    </tr>
                  </tbody>
                </Table>
              </TableWrapper>
            </Card>

            <Card $isDark={isDarkMode}>
              <SectionTitle $isDark={isDarkMode}>
                <Share2 size={19} />
                {vi ? '3. Chia sẻ dữ liệu' : '3. Data Sharing'}
              </SectionTitle>
              <P $isDark={isDarkMode}>{vi ? 'Ốp Pờ KHÔNG kinh doanh dữ liệu của bạn. Chia sẻ chỉ thực hiện khi:' : 'We do NOT sell data. Sharing only for:'}</P>
              <UL $isDark={isDarkMode}>
                <li>{vi ? 'Với nhà tuyển dụng: Khi ứng viên chủ động ứng tuyển.' : 'With employers: Upon application.'}</li>
                <li>{vi ? 'Với đối tác kỹ thuật: Cloud, analytics đã cam kết bảo mật.' : 'Technical partners: Secure cloud/analytics.'}</li>
                <li>{vi ? 'Pháp lý: Theo yêu cầu của cơ quan nhà nước có thẩm quyền.' : 'Legal: Regulatory requests.'}</li>
              </UL>
            </Card>
          </>
        )}

        {/* ══════════════════════════════════
            TAB 09 — VI PHẠM & XỬ LÝ
        ══════════════════════════════════ */}
        {tab === 'violation' && (
          <>
            <Card $isDark={isDarkMode}>
              <HighlightBox $isDark={isDarkMode}>
                {vi
                  ? 'Ốp Pờ xây dựng cộng đồng tuyển dụng dựa trên sự tin tưởng. Chúng mình cam kết xử lý nghiêm mọi hành vi gian lận hoặc gây hại để bảo vệ tất cả người dùng.'
                  : 'Ốp Pờ builds a recruitment community based on trust. We commit to handling all fraud or harmful behavior strictly to protect all users.'}
              </HighlightBox>
            </Card>

            {/* 1. Phân loại vi phạm */}
            <Card $isDark={isDarkMode}>
              <SectionTitle $isDark={isDarkMode}>
                <AlertOctagon size={19} />
                {vi ? '1. Phân loại vi phạm' : '1. Violation Classification'}
              </SectionTitle>
              
              <LevelCard $isDark={isDarkMode} $color="#ef4444" $bg={isDarkMode ? 'rgba(239,68,68,0.12)' : '#fff1f2'}>
                 <div className="lvl-title">
                    <AlertOctagon size={18} />
                    {vi ? 'Vi phạm Cấp độ 1 - Nghiêm trọng (Khóa vĩnh viễn)' : 'Level 1 - Critical (Permanent Ban)'}
                 </div>
                 <UL $isDark={isDarkMode} style={{margin: 0}}>
                    <li>{vi ? 'Đăng tin giả, lừa đảo ứng viên; yêu cầu ứng viên nộp tiền cọc/phí dưới mọi hình thức.' : 'Fake jobs; requiring deposits/fees in any form.'}</li>
                    <li>{vi ? 'Quấy rối, hành vi bạo lực hoặc đe dọa người dùng.' : 'Harassment, violence, or threats.'}</li>
                    <li>{vi ? 'Tạo nhiều tài khoản giả để thao túng điểm uy tín/đánh giá.' : 'Fake accounts to manipulate reputation/ratings.'}</li>
                    <li>{vi ? 'Nội dung vi phạm pháp luật: bạo lực, khiêu dâm, phân biệt đối xử.' : 'Illegal content: violence, porn, discrimination.'}</li>
                 </UL>
              </LevelCard>

              <LevelCard $isDark={isDarkMode} $color="#f59e0b" $bg={isDarkMode ? 'rgba(245,158,11,0.12)' : '#fffbeb'}>
                 <div className="lvl-title">
                    <AlertTriangle size={18} />
                    {vi ? 'Vi phạm Cấp độ 2 - Trung bình (Tạm khóa 7 ngày)' : 'Level 2 - Medium (7-day Ban)'}
                 </div>
                 <UL $isDark={isDarkMode} style={{margin: 0}}>
                    <li>{vi ? 'Thông tin tuyển dụng sai lệch (lương thực tế thấp hơn, địa chỉ sai...).' : 'Misleading info (lower pay, wrong address...).'}</li>
                    <li>{vi ? 'Không phản hồi ứng viên sau khi match; hủy ca muộn nhiều lần.' : 'No response after match; frequent late cancellations.'}</li>
                    <li>{vi ? 'Đánh giá sai sự thật với mục đích phá hoại.' : 'Malicious false ratings/reviews.'}</li>
                 </UL>
              </LevelCard>

              <LevelCard $isDark={isDarkMode} $color="#10b981" $bg={isDarkMode ? 'rgba(16,185,129,0.12)' : '#f0fdf4'}>
                 <div className="lvl-title">
                    <Info size={18} />
                    {vi ? 'Vi phạm Cấp độ 3 - Nhẹ (Nhắc nhở)' : 'Level 3 - Low (Reminder)'}
                 </div>
                 <UL $isDark={isDarkMode} style={{margin: 0}}>
                    <li>{vi ? 'Hồ sơ thiếu thông tin; ảnh đại diện không đạt chuẩn.' : 'Incomplete profile; standard-less profile photo.'}</li>
                    <li>{vi ? 'Nội dung tin tuyển dụng chưa đầy đủ; không cập nhật trạng thái tin.' : 'Incomplete job content; no status updates.'}</li>
                    <li>{vi ? 'Hủy ca muộn lần đầu (chưa đến mức cảnh cáo).' : 'First-time late cancellation.'}</li>
                 </UL>
              </LevelCard>
            </Card>

            {/* 2. Quy trình xử lý */}
            <Card $isDark={isDarkMode}>
              <SectionTitle $isDark={isDarkMode}>
                <ListChecks size={19} />
                {vi ? '2. Quy trình xử lý vi phạm' : '2. Violation Handling Process'}
              </SectionTitle>
              <TableWrapper $isDark={isDarkMode}>
                <Table $isDark={isDarkMode}>
                  <thead>
                    <tr>
                      <th>{vi ? 'Bước' : 'Step'}</th>
                      <th>{vi ? 'Hành động' : 'Action'}</th>
                      <th>{vi ? 'Thời gian' : 'Time'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>{vi ? 'Tiếp nhận báo cáo/Hệ thống phát hiện' : 'Report received / System detection'}</td>
                      <td>{vi ? 'Ngay lập tức' : 'Immediate'}</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>{vi ? 'Xác minh và xem xét bằng chứng' : 'Verification and evidence review'}</td>
                      <td>{vi ? 'Trong 24 giờ' : 'Within 24h'}</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>{vi ? 'Ra quyết định và thông báo' : 'Decision and Notification'}</td>
                      <td>{vi ? 'Trong 48 giờ' : 'Within 48h'}</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>{vi ? 'Thực thi quyết định' : 'Execution'}</td>
                      <td>{vi ? 'Tức thì' : 'Immediate'}</td>
                    </tr>
                  </tbody>
                </Table>
              </TableWrapper>
            </Card>

            {/* 3. Khiếu nại */}
            <Card $isDark={isDarkMode}>
              <SectionTitle $isDark={isDarkMode}>
                <MessageSquare size={19} />
                {vi ? '3. Khiếu nại quyết định xử lý' : '3. Appeal Process'}
              </SectionTitle>
              <P $isDark={isDarkMode}>{vi ? 'Bạn có quyền khiếu nại trong 5 ngày làm việc qua email hỗ trợ.' : 'You can appeal within 5 business days via support email.'}</P>
              <UL $isDark={isDarkMode}>
                <li>{vi ? 'Tiêu đề: Khiếu nại xử lý tài khoản – [Tên tài khoản] – [Ngày quyết định].' : 'Subject: Account Appeal – [Name] – [Date].'}</li>
                <li>{vi ? 'Đính kèm bằng chứng phản bác (ảnh, tin nhắn, video...).' : 'Attach counter-evidence (screenshots, messages...).'}</li>
                <li>{vi ? 'Ốp Pờ phản hồi trong vòng 3 ngày làm việc.' : 'Response within 3 business days.'}</li>
              </UL>
              <HighlightBox $isDark={isDarkMode}>{vi ? 'Quyết định sau khiếu nại là quyết định cuối cùng.' : 'Decisions after appeal are final.'}</HighlightBox>
            </Card>

            {/* 4. Báo cáo */}
            <Card $isDark={isDarkMode}>
              <SectionTitle $isDark={isDarkMode}>
                <Flag size={19} />
                {vi ? '4. Báo cáo vi phạm' : '4. Reporting Violations'}
              </SectionTitle>
              <P $isDark={isDarkMode}>{vi ? 'Hãy giúp cộng đồng an toàn hơn bằng cách:' : 'Help keep the community safe by:'}</P>
              <UL $isDark={isDarkMode}>
                <li>{vi ? 'Nhấn nút Báo cáo trực tiếp trên tin, hồ sơ hoặc tin nhắn.' : 'Click Report directly on post, profile, or message.'}</li>
                <li>{vi ? 'Mô tả sự việc và đính kèm bằng chứng nếu có.' : 'Describe and attach evidence if any.'}</li>
              </UL>
              <SuccessBox $isDark={isDarkMode}>{vi ? 'Thông tin báo cáo được bảo mật danh tính tuyệt đối.' : 'Reporter identity is strictly confidential.'}</SuccessBox>
            </Card>
          </>
        )}

        <FooterBox $isDark={isDarkMode}>
          {vi
             ? 'Tài liệu có hiệu lực kề từ ngày ban hành • Cập nhật tháng 6/2026'
             : 'Document effective from issue date • Updated June 2026'}
          <br />
          <Link to="/register">{vi ? 'Đăng ký ngay' : 'Register now'}</Link>
          {' · '}
          <Link to="/policy">{vi ? 'Điều khoản chung' : 'General Terms'}</Link>
          
          <div className="slogan">
             {vi ? 'ỐP PỜ - BẠN VỪA BỊ ĐUỔI & ĐÃ CÓ ỐP PỜ LO' : 'ỐP PỜ - JUST GOT FIRED? ỐP PỜ GOT YOU'}
          </div>
        </FooterBox>
      </Container>
    </Wrapper>
  );
};

export default RegisterPolicyPage;
