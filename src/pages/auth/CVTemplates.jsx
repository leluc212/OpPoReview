import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { FileText, Star, Package, ArrowRight, LogIn, Eye } from 'lucide-react';

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

const CVTemplates = () => {
  const { language } = useLanguage();
  const { isDarkMode } = useTheme();
  const vi = language === 'vi';

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
                  <ViewBtn onClick={e => e.preventDefault()}>
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
    </PageWrapper>
  );
};

export default CVTemplates;
