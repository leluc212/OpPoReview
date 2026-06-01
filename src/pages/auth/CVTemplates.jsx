import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { FileText, Star, Package, ArrowRight, LogIn, Eye, X } from 'lucide-react';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`
  min-height: calc(100vh - 56px);
`;

const Hero = styled.div`
  padding: 60px 48px 48px;
  background: linear-gradient(135deg, #1a62ff 0%, #002e9d 100%);
  text-align: center;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
`;

const HeroSub = styled(motion.p)`
  font-size: 1rem;
  color: rgba(255,255,255,0.82);
  margin-bottom: 0;
`;

const Content = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px 80px;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${p => p.$isDark ? '#e2e8f0' : '#1e293b'};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, #1a62ff33, transparent);
    border-radius: 2px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 48px;
`;

const CVCard = styled(motion.div)`
  background: ${p => p.$isDark ? 'rgba(30,41,59,0.8)' : '#fff'};
  border: 1.5px solid ${p => p.$isDark ? 'rgba(75,85,99,0.3)' : '#e2e8f0'};
  border-radius: 16px;
  overflow: hidden;
  animation: ${fadeUp} 0.4s ease both;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  &:hover {
    border-color: #1a62ff;
    box-shadow: 0 8px 32px rgba(26,98,255,0.12);
    transform: translateY(-2px);
  }
`;

const CVPreview = styled.div`
  height: 180px;
  background: ${p => p.$bg || 'linear-gradient(135deg, #f0f4ff, #e0eaff)'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const CVMockup = styled.div`
  width: 110px;
  background: #fff;
  border-radius: 8px;
  padding: 12px 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  div {
    height: 6px;
    border-radius: 3px;
    margin-bottom: 5px;
    background: ${p => p.$color || '#1a62ff'};
    &:nth-child(2) { width: 70%; background: #e2e8f0; }
    &:nth-child(3) { width: 85%; background: #e2e8f0; }
    &:nth-child(4) { width: 60%; background: #e2e8f0; }
    &:nth-child(5) { width: 90%; background: #e2e8f0; margin-top: 8px; }
    &:nth-child(6) { width: 75%; background: #e2e8f0; }
  }
`;

const CVInfo = styled.div`
  padding: 16px 18px;
`;

const CVName = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${p => p.$isDark ? '#e2e8f0' : '#1e293b'};
  margin-bottom: 4px;
`;

const CVDesc = styled.div`
  font-size: 0.82rem;
  color: ${p => p.$isDark ? '#94a3b8' : '#64748b'};
  margin-bottom: 14px;
  line-height: 1.5;
`;

const CVActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ViewBtn = styled.a`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px;
  border: 1.5px solid #1a62ff;
  border-radius: 10px;
  color: #1a62ff;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #eff6ff; }
`;

const UseBtn = styled(Link)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px;
  background: #1a62ff;
  border-radius: 10px;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  &:hover { background: #002e9d; }
`;

const LoginNote = styled.div`
  text-align: center;
  padding: 32px;
  background: ${p => p.$isDark ? 'rgba(30,41,59,0.6)' : '#f8fafc'};
  border: 1.5px dashed ${p => p.$isDark ? 'rgba(75,85,99,0.4)' : '#cbd5e1'};
  border-radius: 16px;
  margin-top: 8px;
  p {
    font-size: 0.9rem;
    color: ${p => p.$isDark ? '#94a3b8' : '#64748b'};
    margin-bottom: 16px;
  }
`;

const LoginBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #1a62ff;
  color: #fff;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  &:hover { background: #002e9d; }
`;

// ─── Preview Modal ────────────────────────────────────────────
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalBox = styled(motion.div)`
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 32px 80px rgba(0,0,0,0.3);
  position: relative;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
  &:hover { background: #e2e8f0; color: #1e293b; transform: scale(1.1); }
`;

const ModalHeader = styled.div`
  padding: 28px 28px 20px;
  border-bottom: 1px solid #f1f5f9;
  h2 { font-size: 1.2rem; font-weight: 800; color: #1e293b; margin-bottom: 4px; }
  p  { font-size: 0.85rem; color: #64748b; }
`;

const CVPreviewFull = styled.div`
  padding: 28px;
`;

/* ── Simple template ── */
const SimpleCV = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
`;
const SimpleCVHeader = styled.div`
  background: ${p => p.$color || '#1a62ff'};
  padding: 28px 32px;
  color: #fff;
  h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: 4px; }
  p  { font-size: 0.85rem; opacity: 0.85; }
`;
const SimpleCVBody = styled.div`
  padding: 24px 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;
const CVSection = styled.div`
  h3 {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: ${p => p.$color || '#1a62ff'};
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 2px solid ${p => p.$color || '#1a62ff'}33;
  }
`;
const CVItem = styled.div`
  margin-bottom: 12px;
  .title { font-size: 0.88rem; font-weight: 700; color: #1e293b; }
  .sub   { font-size: 0.8rem; color: #64748b; margin-top: 2px; }
  .desc  { font-size: 0.78rem; color: #94a3b8; margin-top: 4px; line-height: 1.5; }
`;
const SkillTag = styled.span`
  display: inline-block;
  background: ${p => p.$color || '#1a62ff'}15;
  color: ${p => p.$color || '#1a62ff'};
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 0.78rem;
  font-weight: 600;
  margin: 3px 3px 3px 0;
`;

/* ── Impressive template ── */
const ImpressiveCV = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 480px;
`;
const ImpressiveSidebar = styled.div`
  background: #7c3aed;
  padding: 28px 20px;
  color: #fff;
  .avatar {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: rgba(255,255,255,0.25);
    margin: 0 auto 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; font-weight: 800;
  }
  .name { font-size: 1rem; font-weight: 800; text-align: center; margin-bottom: 4px; }
  .role { font-size: 0.78rem; opacity: 0.8; text-align: center; margin-bottom: 20px; }
`;
const ImpressiveSideSection = styled.div`
  margin-bottom: 18px;
  h4 { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; opacity: 0.7; margin-bottom: 8px; }
  p  { font-size: 0.78rem; opacity: 0.9; margin-bottom: 4px; }
`;
const SkillBar = styled.div`
  margin-bottom: 8px;
  .label { font-size: 0.75rem; margin-bottom: 3px; }
  .bar { height: 5px; background: rgba(255,255,255,0.2); border-radius: 3px; }
  .fill { height: 5px; background: #fff; border-radius: 3px; width: ${p => p.$pct}%; }
`;
const ImpressiveMain = styled.div`
  padding: 28px 24px;
  background: #fff;
`;

/* ── Modern template ── */
const ModernCV = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
`;
const ModernCVTop = styled.div`
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  padding: 28px 32px;
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 3px solid #16a34a;
  .avatar {
    width: 72px; height: 72px;
    border-radius: 16px;
    background: #16a34a;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; font-weight: 800; color: #fff;
    flex-shrink: 0;
  }
  h1 { font-size: 1.4rem; font-weight: 800; color: #14532d; margin-bottom: 4px; }
  p  { font-size: 0.85rem; color: #16a34a; font-weight: 600; }
`;
const ModernCVBody = styled.div`
  padding: 24px 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;
const ModernTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 0.78rem;
  font-weight: 600;
  margin: 3px 3px 3px 0;
`;

const ModalUseBtn = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 28px 28px;
  padding: 14px;
  background: #1a62ff;
  color: #fff;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
  &:hover { background: #002e9d; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,98,255,0.3); }
`;

const CVTemplates = () => {
  const { language } = useLanguage();
  const { isDarkMode } = useTheme();
  const vi = language === 'vi';
  const [previewIndex, setPreviewIndex] = useState(null);

  const simpleTemplates = [
    {
      name: vi ? 'Mẫu CV Đơn giản' : 'Simple CV Template',
      desc: vi ? 'Thiết kế tối giản, chuyên nghiệp. Phù hợp mọi ngành nghề.' : 'Minimalist, professional design. Suitable for all industries.',
      bg: 'linear-gradient(135deg, #f0f4ff, #dbeafe)',
      color: '#1a62ff',
    },
    {
      name: vi ? 'Mẫu CV Ấn tượng' : 'Impressive CV Template',
      desc: vi ? 'Thiết kế nổi bật, sáng tạo. Gây ấn tượng với nhà tuyển dụng.' : 'Bold, creative design. Make a strong impression on employers.',
      bg: 'linear-gradient(135deg, #fdf4ff, #ede9fe)',
      color: '#7c3aed',
    },
    {
      name: vi ? 'Mẫu CV Hiện đại' : 'Modern CV Template',
      desc: vi ? 'Phong cách hiện đại, trẻ trung. Phù hợp ngành công nghệ, marketing.' : 'Modern, youthful style. Great for tech and marketing roles.',
      bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
      color: '#16a34a',
    },
  ];

  const aiTemplates = [
    { name: vi ? 'Nhân viên pha chế' : 'Barista' },
    { name: vi ? 'Lập trình viên' : 'Developer' },
    { name: vi ? 'Nhân viên kế toán' : 'Accountant' },
    { name: vi ? 'Chuyên viên marketing' : 'Marketing Specialist' },
  ];

  // ── Full CV preview content per template ──────────────────
  const renderPreview = (index) => {
    if (index === 0) return (
      <SimpleCV>
        <SimpleCVHeader $color="#1a62ff">
          <h1>Nguyễn Văn An</h1>
          <p>{vi ? 'Nhân viên kinh doanh · nguyenvanan@email.com · 0901 234 567' : 'Sales Executive · nguyenvanan@email.com · 0901 234 567'}</p>
        </SimpleCVHeader>
        {/* Single-column clean layout */}
        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Objective */}
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 18px', borderLeft: '4px solid #1a62ff' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#1a62ff', marginBottom: 6 }}>{vi ? 'Mục tiêu nghề nghiệp' : 'Career Objective'}</div>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              {vi
                ? 'Tìm kiếm vị trí kinh doanh để phát huy kỹ năng giao tiếp và đóng góp vào sự phát triển bền vững của công ty.'
                : 'Seeking a sales position to leverage communication skills and contribute to sustainable company growth.'}
            </p>
          </div>

          {/* Experience */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94a3b8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              {vi ? 'Kinh nghiệm làm việc' : 'Work Experience'}
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>
            {[
              { title: vi ? 'Nhân viên kinh doanh' : 'Sales Executive', company: 'ABC Corp', time: `2022 – ${vi ? 'Hiện tại' : 'Present'}`, desc: vi ? 'Phát triển khách hàng mới, đạt 120% KPI hàng quý.' : 'Developed new clients, achieved 120% quarterly KPI.' },
              { title: vi ? 'Thực tập sinh kinh doanh' : 'Sales Intern', company: 'XYZ Ltd', time: '2021 – 2022', desc: vi ? 'Hỗ trợ đội ngũ kinh doanh, xử lý đơn hàng và chăm sóc khách hàng.' : 'Supported sales team, processed orders and handled customer care.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1a62ff', marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>{item.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#1a62ff', fontWeight: 600, marginBottom: 3 }}>{item.company} · {item.time}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94a3b8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              {vi ? 'Học vấn' : 'Education'}
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1a62ff', marginTop: 5, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>{vi ? 'Cử nhân Quản trị Kinh doanh' : 'Bachelor of Business Administration'}</div>
                <div style={{ fontSize: '0.78rem', color: '#1a62ff', fontWeight: 600 }}>{vi ? 'ĐH Kinh tế TP.HCM · 2018 – 2022' : 'UEH · 2018 – 2022'}</div>
              </div>
            </div>
          </div>

          {/* Skills - inline tags */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94a3b8', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              {vi ? 'Kỹ năng' : 'Skills'}
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>
            <div>
              {['Microsoft Office', 'CRM Software', vi ? 'Đàm phán' : 'Negotiation', vi ? 'Thuyết trình' : 'Presentation', 'English B2', vi ? 'Làm việc nhóm' : 'Teamwork'].map(s => (
                <SkillTag key={s} $color="#1a62ff">{s}</SkillTag>
              ))}
            </div>
          </div>
        </div>
      </SimpleCV>
    );

    if (index === 1) return (
      <ImpressiveCV>
        <ImpressiveSidebar>
          <div className="avatar">T</div>
          <div className="name">Trần Thị Bích</div>
          <div className="role">{vi ? 'Thiết kế đồ họa' : 'Graphic Designer'}</div>
          <ImpressiveSideSection>
            <h4>{vi ? 'Liên hệ' : 'Contact'}</h4>
            <p>📞 0912 345 678</p>
            <p>✉️ bich.tran@email.com</p>
            <p>📍 {vi ? 'Hà Nội' : 'Hanoi'}</p>
          </ImpressiveSideSection>
          <ImpressiveSideSection>
            <h4>{vi ? 'Kỹ năng' : 'Skills'}</h4>
            {[['Photoshop', 90], ['Illustrator', 85], ['Figma', 80], ['After Effects', 70]].map(([s, p]) => (
              <SkillBar key={s} $pct={p}>
                <div className="label">{s}</div>
                <div className="bar"><div className="fill" /></div>
              </SkillBar>
            ))}
          </ImpressiveSideSection>
          <ImpressiveSideSection>
            <h4>{vi ? 'Ngôn ngữ' : 'Languages'}</h4>
            <p>{vi ? 'Tiếng Việt (bản ngữ)' : 'Vietnamese (native)'}</p>
            <p>English (B2)</p>
          </ImpressiveSideSection>
        </ImpressiveSidebar>
        <ImpressiveMain>
          <CVSection $color="#7c3aed">
            <h3>{vi ? 'Giới thiệu' : 'About'}</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6, marginBottom: 16 }}>
              {vi
                ? 'Designer với 4 năm kinh nghiệm trong lĩnh vực thiết kế thương hiệu và truyền thông số. Đam mê sáng tạo và luôn cập nhật xu hướng mới.'
                : 'Designer with 4 years of experience in brand design and digital media. Passionate about creativity and always up-to-date with trends.'}
            </p>
          </CVSection>
          <CVSection $color="#7c3aed">
            <h3>{vi ? 'Kinh nghiệm' : 'Experience'}</h3>
            <CVItem>
              <div className="title">{vi ? 'Senior Designer' : 'Senior Designer'}</div>
              <div className="sub">Creative Studio · 2021 – {vi ? 'Hiện tại' : 'Present'}</div>
              <div className="desc">{vi ? 'Dẫn dắt team 3 người, thiết kế nhận diện thương hiệu cho 20+ khách hàng.' : 'Led a 3-person team, designed brand identity for 20+ clients.'}</div>
            </CVItem>
            <CVItem>
              <div className="title">Graphic Designer</div>
              <div className="sub">Agency XYZ · 2019 – 2021</div>
              <div className="desc">{vi ? 'Thiết kế ấn phẩm truyền thông, banner quảng cáo.' : 'Designed marketing materials and advertising banners.'}</div>
            </CVItem>
          </CVSection>
          <CVSection $color="#7c3aed">
            <h3>{vi ? 'Học vấn' : 'Education'}</h3>
            <CVItem>
              <div className="title">{vi ? 'Cử nhân Thiết kế Đồ họa' : 'Bachelor of Graphic Design'}</div>
              <div className="sub">{vi ? 'ĐH Mỹ thuật Công nghiệp · 2015 – 2019' : 'Industrial Fine Arts University · 2015 – 2019'}</div>
            </CVItem>
          </CVSection>
        </ImpressiveMain>
      </ImpressiveCV>
    );

    if (index === 2) return (
      <ModernCV>
        {/* Top: full-width green banner with name + contact row */}
        <ModernCVTop>
          <div className="avatar">L</div>
          <div style={{ flex: 1 }}>
            <h1>Lê Minh Khoa</h1>
            <p>{vi ? 'Lập trình viên Full-stack' : 'Full-stack Developer'}</p>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
              {['📞 0912 345 678', '✉️ lmkhoa@email.com', '📍 TP.HCM', '🔗 github.com/lmkhoa'].map(c => (
                <span key={c} style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 500 }}>{c}</span>
              ))}
            </div>
          </div>
        </ModernCVTop>

        {/* Skills bar — full width highlight strip */}
        <div style={{ background: '#16a34a', padding: '10px 32px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL'].map(s => (
            <span key={s} style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', borderRadius: 20, padding: '3px 12px', fontSize: '0.75rem', fontWeight: 700 }}>{s}</span>
          ))}
        </div>

        {/* Body: 3 columns */}
        <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          {/* Col 1: Experience */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#16a34a', marginBottom: 12, borderBottom: '2px solid #dcfce7', paddingBottom: 6 }}>
              {vi ? 'Kinh nghiệm' : 'Experience'}
            </div>
            {[
              { title: 'Full-stack Developer', company: 'TechCorp', time: `2021 – ${vi ? 'Hiện tại' : 'Present'}`, desc: vi ? 'Phát triển ứng dụng web với React, Node.js. Tối ưu hiệu suất hệ thống 40%.' : 'Built web apps with React & Node.js. Optimized system performance by 40%.' },
              { title: 'Frontend Developer', company: 'StartupABC', time: '2019 – 2021', desc: vi ? 'Xây dựng UI/UX cho sản phẩm SaaS với 10k+ người dùng.' : 'Built UI/UX for SaaS product with 10k+ users.' },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 14, paddingLeft: 12, borderLeft: '3px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>{item.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginBottom: 3 }}>{item.company} · {item.time}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}

            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#16a34a', margin: '16px 0 12px', borderBottom: '2px solid #dcfce7', paddingBottom: 6 }}>
              {vi ? 'Dự án nổi bật' : 'Projects'}
            </div>
            {[
              { name: 'E-commerce Platform', desc: vi ? '50k+ đơn hàng/tháng, tích hợp thanh toán đa kênh.' : '50k+ orders/month, multi-channel payment integration.' },
              { name: 'HR Management System', desc: vi ? 'Quản lý 500+ nhân viên, tự động hóa quy trình HR.' : 'Managed 500+ employees, automated HR workflows.' },
            ].map((p, i) => (
              <div key={i} style={{ marginBottom: 10, paddingLeft: 12, borderLeft: '3px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{p.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{p.desc}</div>
              </div>
            ))}
          </div>

          {/* Col 3: Education + Soft skills */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#16a34a', marginBottom: 12, borderBottom: '2px solid #dcfce7', paddingBottom: 6 }}>
              {vi ? 'Học vấn' : 'Education'}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{vi ? 'Kỹ sư CNTT' : 'B.Eng. IT'}</div>
              <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>HCMUT</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>2015 – 2019</div>
            </div>

            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#16a34a', marginBottom: 12, borderBottom: '2px solid #dcfce7', paddingBottom: 6 }}>
              {vi ? 'Kỹ năng mềm' : 'Soft Skills'}
            </div>
            {[vi ? 'Làm việc nhóm' : 'Teamwork', vi ? 'Tư duy phân tích' : 'Analytical thinking', vi ? 'Giao tiếp' : 'Communication', 'Agile / Scrum'].map(s => (
              <ModernTag key={s} style={{ display: 'flex', marginBottom: 4 }}>{s}</ModernTag>
            ))}

            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#16a34a', margin: '16px 0 10px', borderBottom: '2px solid #dcfce7', paddingBottom: 6 }}>
              {vi ? 'Ngôn ngữ' : 'Languages'}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: 4 }}>{vi ? '🇻🇳 Tiếng Việt (bản ngữ)' : '🇻🇳 Vietnamese (native)'}</div>
            <div style={{ fontSize: '0.82rem', color: '#475569' }}>🇬🇧 English (B2)</div>
          </div>
        </div>
      </ModernCV>
    );
  };

  return (
    <PageWrapper>
      <Hero>
        <HeroTitle initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {vi ? 'Mẫu CV Chuyên Nghiệp' : 'Professional CV Templates'}
        </HeroTitle>
        <HeroSub initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          {vi ? 'Khám phá các mẫu CV đẹp, chuyên nghiệp. Đăng nhập để tạo CV của bạn.' : 'Explore beautiful, professional CV templates. Login to create yours.'}
        </HeroSub>
      </Hero>

      <Content>
        {/* Simple templates */}
        <SectionTitle $isDark={isDarkMode}>
          <Package size={18} color="#1a62ff" />
          {vi ? 'Mẫu CV theo style' : 'CV Templates by Style'}
        </SectionTitle>
        <Grid>
          {simpleTemplates.map((t, i) => (
            <CVCard key={i} $isDark={isDarkMode} style={{ animationDelay: `${i * 0.08}s` }}>
              <CVPreview $bg={t.bg}>
                <CVMockup $color={t.color}>
                  <div /><div /><div /><div /><div /><div />
                </CVMockup>
              </CVPreview>
              <CVInfo>
                <CVName $isDark={isDarkMode}>{t.name}</CVName>
                <CVDesc $isDark={isDarkMode}>{t.desc}</CVDesc>
                <CVActions>
                  <ViewBtn onClick={() => setPreviewIndex(i)}>
                    <Eye size={14} />{vi ? 'Xem trước' : 'Preview'}
                  </ViewBtn>
                  <UseBtn to="/login?redirect=/candidate/profile&role=candidate">
                    <LogIn size={14} />{vi ? 'Dùng mẫu này' : 'Use Template'}
                  </UseBtn>
                </CVActions>
              </CVInfo>
            </CVCard>
          ))}
        </Grid>

        {/* AI templates - require login */}
        <SectionTitle $isDark={isDarkMode}>
          <Star size={18} color="#1a62ff" />
          {vi ? 'Tạo CV bằng AI' : 'Create CV with AI'}
        </SectionTitle>
        <LoginNote $isDark={isDarkMode}>
          <p>
            {vi
              ? 'Tính năng tạo CV bằng AI yêu cầu đăng nhập. Đăng nhập để tạo CV chuyên nghiệp chỉ trong vài phút với sự hỗ trợ của AI.'
              : 'AI CV creation requires login. Sign in to create a professional CV in minutes with AI assistance.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            {aiTemplates.map((t, i) => (
              <span key={i} style={{
                background: isDarkMode ? 'rgba(26,98,255,0.15)' : '#eff6ff',
                color: '#1a62ff',
                borderRadius: 8,
                padding: '4px 12px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                {t.name}
              </span>
            ))}
          </div>
          <LoginBtn to="/login?redirect=/candidate/profile&role=candidate">
            <LogIn size={16} />
            {vi ? 'Đăng nhập để tạo CV bằng AI' : 'Login to Create AI CV'}
          </LoginBtn>
        </LoginNote>
      </Content>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewIndex !== null && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewIndex(null)}
          >
            <ModalBox
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={e => e.stopPropagation()}
            >
              <ModalClose onClick={() => setPreviewIndex(null)}>
                <X size={18} />
              </ModalClose>
              <ModalHeader>
                <h2>{simpleTemplates[previewIndex]?.name}</h2>
                <p>{simpleTemplates[previewIndex]?.desc}</p>
              </ModalHeader>
              <CVPreviewFull>
                {renderPreview(previewIndex)}
              </CVPreviewFull>
              <ModalUseBtn to="/login?redirect=/candidate/profile&role=candidate">
                <LogIn size={16} />
                {vi ? 'Dùng mẫu này' : 'Use This Template'}
              </ModalUseBtn>
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default CVTemplates;
