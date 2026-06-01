import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Target, Users, Shield, Heart, ArrowRight,
  CheckCircle, TrendingDown, Lock, Clock, Star
} from 'lucide-react';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.08); opacity: 0.9; }
`;

const PageWrapper = styled.div`min-height: calc(100vh - 56px);`;

/* ─── HERO ─── */
const Hero = styled.div`
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #001a6e 0%, #002e9d 40%, #1a62ff 100%);
  padding: 80px 48px 60px;
  text-align: center;
`;

const HeroBg = styled.div`
  position: absolute; inset: 0; pointer-events: none;
  &::before {
    content: '';
    position: absolute;
    width: 700px; height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
    top: -200px; left: -200px;
    animation: ${pulse} 8s ease-in-out infinite;
  }
  &::after {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
    bottom: -150px; right: -100px;
    animation: ${pulse} 10s ease-in-out infinite 2s;
  }
`;

const HeroInner = styled.div`
  position: relative; z-index: 1;
  max-width: 860px; margin: 0 auto;
`;

const HeroBadge = styled(motion.div)`
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 24px; padding: 8px 20px;
  font-size: 0.82rem; font-weight: 700;
  color: rgba(255,255,255,0.92);
  letter-spacing: 0.5px; text-transform: uppercase;
  margin-bottom: 28px;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 900; color: #fff;
  line-height: 1.15; letter-spacing: -1.5px;
  margin-bottom: 24px;
  span { color: #93c5fd; }
`;

const HeroDesc = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.15rem);
  color: rgba(255,255,255,0.82);
  line-height: 1.8; max-width: 700px;
  margin: 0 auto 40px;
`;

const HeroStats = styled(motion.div)`
  display: flex; justify-content: center; gap: 0;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px; overflow: hidden;
  max-width: 600px; margin: 0 auto 40px;
`;

const HeroStat = styled.div`
  flex: 1; padding: 20px 16px; text-align: center;
  border-right: 1px solid rgba(255,255,255,0.12);
  &:last-child { border-right: none; }
  .num { font-size: 1.8rem; font-weight: 900; color: #fff; display: block; }
  .lbl { font-size: 0.75rem; color: rgba(255,255,255,0.7); margin-top: 2px; font-weight: 500; }
`;

const HeroCTA = styled.div`
  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
`;

const BtnWhite = styled(Link)`
  display: inline-flex; align-items: center; gap: 6px;
  background: #fff; color: #1a62ff;
  border-radius: 12px; padding: 13px 26px;
  font-weight: 700; font-size: 0.95rem;
  text-decoration: none; transition: all 0.2s;
  &:hover { background: #f0f4ff; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
`;

const BtnGhost = styled(Link)`
  display: inline-flex; align-items: center; gap: 6px;
  background: transparent; color: #fff;
  border: 2px solid rgba(255,255,255,0.35);
  border-radius: 12px; padding: 13px 26px;
  font-weight: 700; font-size: 0.95rem;
  text-decoration: none; transition: all 0.2s;
  &:hover { border-color: #fff; background: rgba(255,255,255,0.1); }
`;

/* ─── PROBLEM SECTION ─── */
const ProblemSection = styled.div`
  background: ${p => p.$isDark ? '#0f172a' : '#fff'};
  padding: 80px 48px;
`;

const SectionInner = styled.div`max-width: 1100px; margin: 0 auto;`;

const Tag = styled.div`
  display: inline-flex; align-items: center; gap: 6px;
  background: ${p => p.$isDark ? 'rgba(26,98,255,0.15)' : '#eff6ff'};
  color: #1a62ff; border-radius: 20px;
  padding: 5px 14px; font-size: 0.8rem; font-weight: 700;
  margin-bottom: 16px;
`;

const STitle = styled.h2`
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 900; letter-spacing: -0.5px;
  color: ${p => p.$isDark ? '#e2e8f0' : '#1e293b'};
  margin-bottom: 14px;
`;

const SDesc = styled.p`
  font-size: 1rem; line-height: 1.8;
  color: ${p => p.$isDark ? '#94a3b8' : '#64748b'};
  max-width: 640px; margin-bottom: 40px;
`;

const TwoCol = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const ProblemCard = styled.div`
  background: ${p => p.$isDark ? 'rgba(239,68,68,0.08)' : '#fff5f5'};
  border: 1.5px solid ${p => p.$isDark ? 'rgba(239,68,68,0.2)' : '#fecaca'};
  border-radius: 16px; padding: 24px;
  display: flex; gap: 14px; align-items: flex-start;
`;

const ProblemIcon = styled.div`
  width: 44px; height: 44px; border-radius: 12px;
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  svg { color: #dc2626; }
`;

const SolCard = styled.div`
  background: ${p => p.$isDark ? 'rgba(26,98,255,0.08)' : '#eff6ff'};
  border: 1.5px solid ${p => p.$isDark ? 'rgba(26,98,255,0.2)' : '#bfdbfe'};
  border-radius: 16px; padding: 24px;
  display: flex; gap: 14px; align-items: flex-start;
`;

const SolIcon = styled.div`
  width: 44px; height: 44px; border-radius: 12px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  svg { color: #1a62ff; }
`;

const CardTitle = styled.div`
  font-size: 0.95rem; font-weight: 700;
  color: ${p => p.$isDark ? '#e2e8f0' : '#1e293b'};
  margin-bottom: 6px;
`;

const CardDesc = styled.div`
  font-size: 0.84rem; line-height: 1.6;
  color: ${p => p.$isDark ? '#94a3b8' : '#64748b'};
`;

/* ─── VISION MISSION ─── */
const VMSection = styled.div`
  background: linear-gradient(135deg, #001a6e 0%, #002e9d 100%);
  padding: 80px 48px;
`;

const VMGrid = styled.div`
  max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const VMCard = styled(motion.div)`
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 24px; padding: 36px 32px;
  animation: ${fadeUp} 0.5s ease both;
`;

const VMIcon = styled.div`
  width: 56px; height: 56px; border-radius: 16px;
  background: rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 20px;
  svg { color: #93c5fd; }
`;

const VMLabel = styled.div`
  font-size: 0.78rem; font-weight: 700; letter-spacing: 1px;
  text-transform: uppercase; color: #93c5fd; margin-bottom: 10px;
`;

const VMTitle = styled.h3`
  font-size: 1.4rem; font-weight: 800; color: #fff;
  margin-bottom: 14px; letter-spacing: -0.3px;
`;

const VMDesc = styled.p`
  font-size: 0.92rem; line-height: 1.8;
  color: rgba(255,255,255,0.78);
`;

/* ─── VALUES ─── */
const ValuesSection = styled.div`
  background: ${p => p.$isDark ? '#0f172a' : '#f8fafc'};
  padding: 80px 48px;
`;

const ValuesGrid = styled.div`
  max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
  margin-top: 40px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const ValCard = styled(motion.div)`
  background: ${p => p.$isDark ? 'rgba(30,41,59,0.7)' : '#fff'};
  border: 1.5px solid ${p => p.$isDark ? 'rgba(75,85,99,0.3)' : '#e2e8f0'};
  border-radius: 18px; padding: 28px 24px;
  animation: ${fadeUp} 0.4s ease both;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  &:hover { border-color: #1a62ff; box-shadow: 0 8px 32px rgba(26,98,255,0.1); transform: translateY(-2px); }
`;

const ValIcon = styled.div`
  width: 48px; height: 48px; border-radius: 14px;
  background: ${p => p.$bg || 'linear-gradient(135deg,#eff6ff,#dbeafe)'};
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
  svg { color: ${p => p.$color || '#1a62ff'}; }
`;

const ValTitle = styled.div`
  font-size: 0.97rem; font-weight: 700;
  color: ${p => p.$isDark ? '#e2e8f0' : '#1e293b'};
  margin-bottom: 8px;
`;

const ValDesc = styled.div`
  font-size: 0.84rem; line-height: 1.7;
  color: ${p => p.$isDark ? '#94a3b8' : '#64748b'};
`;

/* ─── CTA ─── */
const CTASection = styled.div`
  background: linear-gradient(135deg, #1a62ff 0%, #002e9d 100%);
  padding: 72px 48px; text-align: center;
`;

const CTATitle = styled.h2`
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 900; color: #fff; margin-bottom: 12px;
`;

const CTASub = styled.p`
  color: rgba(255,255,255,0.8); font-size: 1rem; margin-bottom: 28px;
`;

/* ─── COMPONENT ─── */
const AboutPage = () => {
  const { language } = useLanguage();
  const { isDarkMode } = useTheme();
  const vi = language === 'vi';

  const problems = [
    { icon: <TrendingDown size={20} />, title: vi ? 'Biến động nhân sự cao' : 'High Staff Turnover', desc: vi ? 'Ngành F&B đối mặt với tỷ lệ nghỉ việc lên đến 70-80%/năm, gây gián đoạn hoạt động liên tục.' : 'F&B industry faces 70-80% annual turnover, causing constant operational disruptions.' },
    { icon: <Lock size={20} />, title: vi ? 'Rủi ro bảo mật dữ liệu' : 'Data Security Risks', desc: vi ? 'Quy trình tuyển dụng truyền thống tiềm ẩn rủi ro rò rỉ thông tin nhạy cảm của doanh nghiệp.' : 'Traditional hiring processes risk leaking sensitive business information.' },
    { icon: <Clock size={20} />, title: vi ? 'Tuyển dụng chậm & tốn kém' : 'Slow & Costly Hiring', desc: vi ? 'Trung bình mất 2-4 tuần để tìm được nhân sự phù hợp, ảnh hưởng trực tiếp đến doanh thu.' : 'Average 2-4 weeks to find suitable staff, directly impacting revenue.' },
    { icon: <Users size={20} />, title: vi ? 'Thiếu nhân sự có kỹ năng' : 'Shortage of Skilled Staff', desc: vi ? 'Khó tìm nhân sự bán thời gian đã được xác thực kỹ năng và có kinh nghiệm thực tế trong F&B.' : 'Hard to find verified, skilled part-time staff with real F&B experience.' },
  ];

  const solutions = [
    { icon: <CheckCircle size={20} />, title: vi ? 'Rút ngắn tuyển dụng 70%' : '70% Faster Hiring', desc: vi ? 'Kết nối ngay với đội ngũ nhân sự đã được xác thực, sẵn sàng làm việc trong vòng 24 giờ.' : 'Connect instantly with verified staff ready to work within 24 hours.' },
    { icon: <Shield size={20} />, title: vi ? 'Giảm 99% rủi ro bảo mật' : '99% Security Risk Reduction', desc: vi ? 'Hệ thống xác thực đa lớp bảo vệ dữ liệu doanh nghiệp và thông tin ứng viên tuyệt đối.' : 'Multi-layer verification system protects business data and candidate information absolutely.' },
    { icon: <Star size={20} />, title: vi ? 'Nhân sự đã xác thực kỹ năng' : 'Skill-Verified Staff', desc: vi ? 'Mọi ứng viên đều trải qua quy trình xác thực kỹ năng và kinh nghiệm trước khi được kết nối.' : 'Every candidate goes through skill and experience verification before being connected.' },
    { icon: <Heart size={20} />, title: vi ? 'Thị trường lao động minh bạch' : 'Transparent Labor Market', desc: vi ? 'Xây dựng môi trường làm việc an toàn, tôn trọng người lao động và minh bạch cho tất cả.' : 'Building a safe, respectful, and transparent work environment for everyone.' },
  ];

  const values = [
    { icon: <Shield size={22} />, bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', color: '#1a62ff', title: vi ? 'Xác thực & Tin cậy' : 'Verified & Trusted', desc: vi ? 'Mọi nhân sự và doanh nghiệp đều được xác thực danh tính, kỹ năng và giấy phép hoạt động.' : 'All staff and businesses are verified for identity, skills, and operating licenses.' },
    { icon: <Lock size={22} />, bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', color: '#16a34a', title: vi ? 'Bảo mật tuyệt đối' : 'Absolute Security', desc: vi ? 'Dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn quốc tế, giảm 99% rủi ro rò rỉ thông tin.' : 'Data encrypted and protected to international standards, reducing 99% of information leak risks.' },
    { icon: <Clock size={22} />, bg: 'linear-gradient(135deg,#fef9c3,#fef08a)', color: '#ca8a04', title: vi ? 'Nhanh chóng & Hiệu quả' : 'Fast & Efficient', desc: vi ? 'Rút ngắn thời gian tuyển dụng đến 70%, giúp doanh nghiệp vận hành liên tục không gián đoạn.' : 'Reduce hiring time by 70%, helping businesses operate continuously without interruption.' },
    { icon: <Heart size={22} />, bg: 'linear-gradient(135deg,#fdf4ff,#ede9fe)', color: '#7c3aed', title: vi ? 'Tôn trọng người lao động' : 'Respect for Workers', desc: vi ? 'Xây dựng thị trường lao động sạch, nơi quyền lợi người lao động được bảo vệ và tôn trọng.' : 'Building a clean labor market where workers\' rights are protected and respected.' },
    { icon: <Target size={22} />, bg: 'linear-gradient(135deg,#fff7ed,#fed7aa)', color: '#ea580c', title: vi ? 'Chuyên biệt F&B' : 'F&B Specialized', desc: vi ? 'Tập trung sâu vào ngành F&B, hiểu rõ đặc thù và nhu cầu của từng loại hình kinh doanh.' : 'Deeply focused on F&B, understanding the specifics and needs of each business type.' },
    { icon: <TrendingDown size={22} />, bg: 'linear-gradient(135deg,#fdf2f8,#fce7f3)', color: '#db2777', title: vi ? 'Giảm thiểu rủi ro' : 'Risk Minimization', desc: vi ? 'Hệ thống đánh giá và phản hồi hai chiều giúp giảm thiểu rủi ro cho cả doanh nghiệp và nhân sự.' : 'Two-way rating and feedback system minimizes risks for both businesses and staff.' },
  ];

  return (
    <PageWrapper>
      {/* HERO */}
      <Hero>
        <HeroBg />
        <HeroInner>
          <HeroBadge initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Heart size={13} />
            {vi ? 'Giới thiệu về công ty' : 'About OpPo'}
          </HeroBadge>
          <HeroTitle initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            {vi ? <>Ốp Pờ — Nền tảng nhân sự <span>F&B</span> hàng đầu Việt Nam</> : <>OpPo — OpPo � Vietnam's <span>F&B</span> Staffing Platform</>}
          </HeroTitle>
          <HeroDesc initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            {vi
              ? 'Ốp Pờ hỗ trợ các chủ doanh nghiệp F&B tiêu chuẩn hóa hoạt động kinh doanh bằng cách giải quyết tình trạng biến động nhân sự và rủi ro tuyển dụng. Nền tảng kết nối doanh nghiệp với đội ngũ nhân sự bán thời gian đã được xác thực và có kỹ năng.'
              : 'OpPo helps F&B business owners standardize operations by solving staff turnover and hiring risks. The platform connects businesses with verified, skilled part-time staff.'}
          </HeroDesc>
          <HeroStats initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <HeroStat><span className="num">70%</span><span className="lbl">{vi ? 'Rút ngắn tuyển dụng' : 'Faster Hiring'}</span></HeroStat>
            <HeroStat><span className="num">99%</span><span className="lbl">{vi ? 'Giảm rủi ro bảo mật' : 'Security Risk Reduced'}</span></HeroStat>
            <HeroStat><span className="num">5K+</span><span className="lbl">{vi ? 'Doanh nghiệp tin dùng' : 'Businesses Trust Us'}</span></HeroStat>
          </HeroStats>
          <HeroCTA>
            <BtnWhite to="/register/employer">{vi ? 'Đăng ký doanh nghiệp' : 'Register Business'} <ArrowRight size={16} /></BtnWhite>
            <BtnGhost to="/jobs">{vi ? 'Tìm việc ngay' : 'Find Jobs'}</BtnGhost>
          </HeroCTA>
        </HeroInner>
      </Hero>

      {/* PROBLEM & SOLUTION */}
      <ProblemSection $isDark={isDarkMode}>
        <SectionInner>
          <Tag $isDark={isDarkMode}><Target size={13} />{vi ? 'Vấn đề & Giải pháp' : 'Problem & Solution'}</Tag>
          <STitle $isDark={isDarkMode}>{vi ? 'Chúng tôi giải quyết điều gì?' : 'What Do We Solve?'}</STitle>
          <SDesc $isDark={isDarkMode}>{vi ? 'Ngành F&B Việt Nam đang đối mặt với những thách thức nhân sự nghiêm trọng. OpPo được xây dựng để giải quyết tận gốc những vấn đề này.' : 'Vietnam\'s F&B industry faces serious staffing challenges. OpPo is built to solve these problems at the root.'}</SDesc>
          <TwoCol>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>
                {vi ? '⚠ Vấn đề hiện tại' : '⚠ Current Problems'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {problems.map((p, i) => (
                  <ProblemCard key={i} $isDark={isDarkMode}>
                    <ProblemIcon>{p.icon}</ProblemIcon>
                    <div><CardTitle $isDark={isDarkMode}>{p.title}</CardTitle><CardDesc $isDark={isDarkMode}>{p.desc}</CardDesc></div>
                  </ProblemCard>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a62ff', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>
                {vi ? '✓ Giải pháp của OpPo' : '✓ OpPo Solutions'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {solutions.map((s, i) => (
                  <SolCard key={i} $isDark={isDarkMode}>
                    <SolIcon>{s.icon}</SolIcon>
                    <div><CardTitle $isDark={isDarkMode}>{s.title}</CardTitle><CardDesc $isDark={isDarkMode}>{s.desc}</CardDesc></div>
                  </SolCard>
                ))}
              </div>
            </div>
          </TwoCol>
        </SectionInner>
      </ProblemSection>

      {/* VISION & MISSION */}
      <VMSection>
        <VMGrid>
          <VMCard initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <VMIcon><Target size={26} /></VMIcon>
            <VMLabel>{vi ? 'Tầm nhìn' : 'Vision'}</VMLabel>
            <VMTitle>{vi ? 'Nền tảng nhân sự F&B hàng đầu Việt Nam' : 'Vietnam\'s Leading F&B Staffing Platform'}</VMTitle>
            <VMDesc>{vi ? 'Trở thành nền tảng hàng đầu dành cho việc cung cấp và kết nối nhân sự F&B đã được xác thực tại Việt Nam.' : 'Become the leading platform for providing and connecting verified F&B staff in Vietnam.'}</VMDesc>
          </VMCard>
          <VMCard initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
            <VMIcon><Heart size={26} /></VMIcon>
            <VMLabel>{vi ? 'Sứ mệnh' : 'Mission'}</VMLabel>
            <VMTitle>{vi ? 'Xây dựng thị trường lao động sạch' : 'Build a Clean Labor Market'}</VMTitle>
            <VMDesc>{vi ? 'Loại bỏ các rủi ro trong tuyển dụng và xây dựng một thị trường lao động "sạch" — nơi công việc ít rủi ro, minh bạch, an toàn và tôn trọng người lao động.' : 'Eliminate hiring risks and build a "clean" labor market — where work is low-risk, transparent, safe, and respects workers.'}</VMDesc>
          </VMCard>
        </VMGrid>
      </VMSection>

      {/* VALUES */}
      <ValuesSection $isDark={isDarkMode}>
        <SectionInner>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <Tag $isDark={isDarkMode}><Heart size={13} />{vi ? 'Giá trị cốt lõi' : 'Core Values'}</Tag>
          </div>
          <STitle $isDark={isDarkMode} style={{ textAlign: 'center', maxWidth: '100%' }}>{vi ? 'Những gì chúng tôi cam kết' : 'What We Commit To'}</STitle>
          <ValuesGrid>
            {values.map((v, i) => (
              <ValCard key={i} $isDark={isDarkMode} style={{ animationDelay: `${i * 0.07}s` }}>
                <ValIcon $bg={v.bg} $color={v.color}>{v.icon}</ValIcon>
                <ValTitle $isDark={isDarkMode}>{v.title}</ValTitle>
                <ValDesc $isDark={isDarkMode}>{v.desc}</ValDesc>
              </ValCard>
            ))}
          </ValuesGrid>
        </SectionInner>
      </ValuesSection>

      {/* CTA */}
      <CTASection>
        <CTATitle>{vi ? 'Sẵn sàng tối ưu nhân sự F&B?' : 'Ready to Optimize Your F&B Staffing?'}</CTATitle>
        <CTASub>{vi ? 'Tham gia cùng hàng nghìn doanh nghiệp F&B đang vận hành hiệu quả hơn với OpPo.' : 'Join thousands of F&B businesses operating more efficiently with OpPo.'}</CTASub>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <BtnWhite to="/register/employer">{vi ? 'Đăng ký doanh nghiệp' : 'Register Business'} <ArrowRight size={16} /></BtnWhite>
          <BtnGhost to="/register/candidate">{vi ? 'Tìm việc làm' : 'Find Jobs'}</BtnGhost>
        </div>
      </CTASection>
    </PageWrapper>
  );
};

export default AboutPage;
