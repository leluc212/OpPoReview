import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { Check, Zap, Star, Rocket, Sparkles, X, HelpCircle, CreditCard, Shield, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// ─── Animations ───────────────────────────────────────────────
const rotateBorder = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const floatY = keyframes`
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
`;
const shimmerSweep = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;
const checkBounce = keyframes`
  0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
  70%  { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); }
`;
const orbPulse = keyframes`
  0%,100% { transform: scale(1); opacity: 0.18; }
  50%      { transform: scale(1.12); opacity: 0.28; }
`;

// ─── Layout ───────────────────────────────────────────────────
const PageContainer = styled(motion.div)`
  position: relative;
  overflow: hidden;
`;

/* decorative orbs behind everything */
const OrbBlue  = styled.div`
  position: fixed; pointer-events: none; z-index: 0;
  width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, #1e40af33 0%, transparent 70%);
  top: -120px; right: -150px;
  animation: ${orbPulse} 6s ease-in-out infinite;
`;
const OrbGreen = styled.div`
  position: fixed; pointer-events: none; z-index: 0;
  width: 380px; height: 380px; border-radius: 50%;
  background: radial-gradient(circle, #10b98133 0%, transparent 70%);
  bottom: 80px; left: -100px;
  animation: ${orbPulse} 8s ease-in-out infinite reverse;
`;

const Inner = styled.div`position: relative; z-index: 1;`;

// ─── Header ───────────────────────────────────────────────────
const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 36px;
`;
const PageIconBox = styled(motion.div)`
  width: 52px; height: 52px; border-radius: 15px;
  background: #EFF6FF; border: 1.5px solid #BFDBFE;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  svg { width: 22px; height: 22px; color: #1e40af; }
`;
const PageTitleText = styled.div`
  h1 { font-size: 26px; font-weight: 800; color: ${p => p.theme.colors.text}; letter-spacing: -0.5px; margin-bottom: 4px; }
  p  { font-size: 13.5px; color: ${p => p.theme.colors.textLight}; font-weight: 500; }
`;

// ─── Pricing grid (equal-height cards) ───────────────────────
const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: stretch;
  margin-bottom: 28px;
  padding-top: 22px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    max-width: 440px;
  }
`;

const glowAnim = keyframes`
  0%,100% { box-shadow: 0 0 0 2.5px #1e40af, 0 16px 50px rgba(30,64,175,0.22); }
  33%      { box-shadow: 0 0 0 2.5px #60a5fa, 0 16px 50px rgba(96,165,250,0.28); }
  66%      { box-shadow: 0 0 0 2.5px #818cf8, 0 16px 50px rgba(129,140,248,0.25); }
`;

const PricingCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 20px;
  border: 1.5px solid ${p => p.$featured ? 'transparent' : '#E8EFFF'};
  padding: 32px 24px 26px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: visible;
  box-shadow: ${p => p.$featured
    ? '0 0 0 2.5px #1e40af, 0 16px 50px rgba(30,64,175,0.2)'
    : '0 2px 10px rgba(30,64,175,0.07)'};
  ${p => p.$featured && css`animation: ${glowAnim} 3s ease infinite;`}
  transition: transform 0.25s ease;

  /* colored top stripe for non-featured */
  ${p => !p.$featured && css`
    &::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 4px;
      border-radius: 20px 20px 0 0;
      background: ${p.$color};
      opacity: 0.75;
    }
  `}
`;

const PopularBadge = styled(motion.div)`
  position: absolute; top: -15px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(90deg, #1e3a8a, #1e40af);
  color: white; padding: 5px 20px; border-radius: 100px;
  font-size: 12px; font-weight: 700;
  display: flex; align-items: center; gap: 5px; white-space: nowrap;
  box-shadow: 0 4px 18px rgba(30,64,175,0.45);
  svg { width: 12px; height: 12px; }
`;

const PlanIconWrap = styled(motion.div)`
  width: 72px; height: 72px;
  margin: 8px auto 18px;
  border-radius: 20px;
  background: ${p => p.$bg};
  border: 1.5px solid ${p => p.$border};
  display: flex; align-items: center; justify-content: center;
  animation: ${floatY} ${p => p.$dur || '4s'} ease-in-out infinite;
  svg { width: 32px; height: 32px; color: ${p => p.$c}; }
`;

const PlanName = styled.h3`
  font-size: 21px; font-weight: 800; text-align: center;
  color: ${p => p.theme.colors.text}; letter-spacing: -0.3px; margin-bottom: 18px;
`;

const PriceBox = styled.div`
  background: #F8FAFC;
  border: 1.5px solid #F1F5F9;
  border-radius: 16px;
  padding: 18px 14px 14px;
  text-align: center;
  margin-bottom: 22px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
    animation: ${shimmerSweep} 3.2s infinite linear;
    pointer-events: none;
  }
`;
const PriceNum = styled.div`
  font-size: 34px; font-weight: 900; color: ${p => p.$c};
  letter-spacing: -1.5px; line-height: 1;
  .unit { font-size: 18px; font-weight: 700; margin-left: 4px; vertical-align: bottom; }
`;
const PricePer = styled.div`
  font-size: 12.5px; color: ${p => p.theme.colors.textLight}; font-weight: 500; margin-top: 6px;
`;

/* push button to bottom */
const Features = styled.ul`
  flex: 1;
  display: flex; flex-direction: column; gap: 7px;
  margin: 0 0 22px; padding: 0; list-style: none;
`;

const FeatureItem = styled(motion.li)`
  display: flex; align-items: center; gap: 10px;
  font-size: 13.5px; font-weight: 500; color: ${p => p.theme.colors.text};
  padding: 6px 8px 6px 6px; border-radius: 9px;
  transition: background 0.15s ease, transform 0.15s ease;
  &:hover { background: #F8FAFC; transform: translateX(3px); }

  .chk {
    width: 22px; height: 22px; border-radius: 7px;
    background: #ECFDF5; border: 1px solid #6EE7B7;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    svg { width: 12px; height: 12px; color: #10B981; animation: ${checkBounce} 0.35s ease both; }
  }
`;

const Btn = styled(motion.button)`
  width: 100%; padding: 14px; border-radius: 12px;
  font-size: 14.5px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  border: none; position: relative; overflow: hidden; flex-shrink: 0;
  svg { width: 16px; height: 16px; }
  transition: filter 0.2s ease, box-shadow 0.2s ease;

  ${p => p.$primary ? css`
    background: #1e40af; color: white;
    box-shadow: 0 5px 18px rgba(30,64,175,0.38);
    &::after {
      content: ''; position: absolute; top: 0; left: -120%; width: 80%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
      transition: left 0.5s ease;
    }
    &:hover { filter: brightness(1.1); box-shadow: 0 8px 28px rgba(30,64,175,0.48); }
    &:hover::after { left: 130%; }
  ` : css`
    background: #F8FAFC; color: #475569;
    border: 1.5px solid #E2E8F0;
    &:hover { border-color: #93C5FD; color: #1e40af; background: #EFF6FF; }
  `}
`;

// ─── Bottom sections ──────────────────────────────────────────
const SectionCard = styled(motion.div)`
  background: #ffffff; border: 1.5px solid #E8EFFF;
  border-radius: 18px; overflow: hidden;
  box-shadow: 0 2px 10px rgba(30,64,175,0.07); margin-bottom: 18px;
`;
const SectionHead = styled.div`
  padding: 18px 24px; border-bottom: 1px solid #F1F5F9;
  h2 { font-size: 15.5px; font-weight: 700; color: ${p => p.theme.colors.text}; }
`;
const CompTable = styled.table`
  width: 100%; border-collapse: collapse;
  th {
    padding: 12px 18px; background: #F8FAFC; color: #64748B;
    font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
    border-bottom: 1px solid #F1F5F9; text-align: center;
    &:first-child { text-align: left; }
  }
  td {
    padding: 13px 18px; text-align: center;
    border-top: 1px solid #F8FAFC; font-size: 13.5px;
    color: ${p => p.theme.colors.text}; font-weight: 500;
    transition: background 0.15s;
    &:first-child { text-align: left; font-weight: 600; }
    svg { width: 18px; height: 18px; }
  }
  tr:hover td { background: #FAFBFF; }
`;
const FAQItem = styled(motion.div)`
  padding: 18px 24px; border-bottom: 1px solid #F1F5F9;
  &:last-child { border-bottom: none; }
  transition: background 0.14s;
  &:hover { background: #FAFBFF; }
  h3 {
    font-size: 14px; font-weight: 700; color: ${p => p.theme.colors.text};
    margin-bottom: 7px; display: flex; align-items: center; gap: 8px;
    svg { width: 15px; height: 15px; color: #1e40af; flex-shrink: 0; }
  }
  p { font-size: 13px; color: ${p => p.theme.colors.textLight}; line-height: 1.65; padding-left: 23px; }
`;

// ─── Component ────────────────────────────────────────────────
const Subscription = () => {
  const { language: lang } = useLanguage();
  const vi = lang === 'vi';

  const plans = [
    {
      name:    vi ? 'Cơ Bản'         : 'Basic',
      price:   vi ? '1.2 triệu'      : '1.2M',
      curr:    'VND',
      per:     vi ? '/tháng'         : '/month',
      Icon: Zap,
      color: '#10B981', bg: '#ECFDF5', bd: '#A7F3D0', dur: '4.2s',
      feats: [
        vi ? '5 tin tuyển dụng'             : '5 job posts',
        vi ? '50 hồ sơ ứng tuyển'           : '50 applications',
        vi ? 'Hỗ trợ cơ bản'               : 'Basic support',
        vi ? 'Bảng điều khiển phân tích'    : 'Analytics dashboard',
      ]
    },
    {
      name:     vi ? 'Chuyên Nghiệp'  : 'Professional',
      price:    vi ? '2.3 triệu'      : '2.3M',
      curr:    'VND',
      per:     vi ? '/tháng'         : '/month',
      Icon: Star,
      color: '#1e40af', bg: '#EFF6FF', bd: '#BFDBFE', dur: '3.6s',
      featured: true,
      feats: [
        vi ? '20 tin tuyển dụng'                  : '20 job posts',
        vi ? 'Hồ sơ ứng tuyển không giới hạn'     : 'Unlimited applications',
        vi ? 'Hỗ trợ ưu tiên'                     : 'Priority support',
        vi ? 'Phân tích nâng cao'                  : 'Advanced analytics',
        vi ? 'Tin nổi bật'                         : 'Featured posting',
      ]
    },
    {
      name:    vi ? 'Doanh Nghiệp'   : 'Enterprise',
      price:   vi ? '4.5 triệu'      : '4.5M',
      curr:    'VND',
      per:     vi ? '/tháng'         : '/month',
      Icon: Rocket,
      color: '#F59E0B', bg: '#FFFBEB', bd: '#FDE68A', dur: '5s',
      feats: [
        vi ? 'Tin tuyển dụng không giới hạn'       : 'Unlimited job posts',
        vi ? 'Hồ sơ ứng tuyển không giới hạn'      : 'Unlimited applications',
        vi ? 'Hỗ trợ 24/7'                         : '24/7 support',
        vi ? 'Phân tích tùy chỉnh'                  : 'Custom analytics',
        vi ? 'Truy cập API'                         : 'API access',
        vi ? 'Quản lý riêng'                        : 'Dedicated manager',
      ]
    },
  ];

  const compareRows = [
    [vi ? 'Số tin tuyển dụng'   : 'Job posts',          '5',  '20', vi ? 'Không giới hạn' : 'Unlimited'],
    [vi ? 'Hồ sơ ứng tuyển'     : 'Applications',       '50', vi ? 'Không giới hạn' : 'Unlimited', vi ? 'Không giới hạn' : 'Unlimited'],
    [vi ? 'Tin nổi bật'         : 'Featured posting',   false, true,  true],
    [vi ? 'Phân tích nâng cao'  : 'Advanced analytics', false, true,  true],
    [vi ? 'Truy cập API'        : 'API access',         false, false, true],
    [vi ? 'Hỗ trợ'             : 'Support',            vi ? 'Cơ bản' : 'Basic', vi ? 'Ưu tiên' : 'Priority', '24/7'],
    [vi ? 'Quản lý riêng'       : 'Dedicated manager',  false, false, true],
  ];

  const faqs = [
    { Icon: CreditCard, q: vi ? 'Các phương thức thanh toán nào được chấp nhận?' : 'Which payment methods are accepted?',    a: vi ? 'Chúng tôi chấp nhận thẻ tín dụng, thẻ ghi nợ, chuyển khoản ngân hàng và ví điện tử. Tất cả giao dịch đều được bảo mật SSL 256-bit.' : 'We accept credit cards, debit cards, bank transfers, and e-wallets. All transactions use 256-bit SSL security.' },
    { Icon: Shield,     q: vi ? 'Tôi có thể hủy đăng ký bất cứ lúc nào không?' : 'Can I cancel anytime?',                    a: vi ? 'Có. Không có phí hủy và bạn vẫn dùng được dịch vụ đến hết kỳ thanh toán.' : 'Yes. Cancel anytime with no fee — you keep access until the billing cycle ends.' },
    { Icon: Clock,      q: vi ? 'Tôi có thể nâng hoặc hạ cấp gói không?' : 'Can I upgrade or downgrade?',                    a: vi ? 'Tất nhiên. Đổi gói bất cứ lúc nào, chi phí được tính theo tỷ lệ thời gian còn lại.' : 'Yes. Switch plans anytime — we prorate the cost for the remaining billing period.' },
    { Icon: HelpCircle, q: vi ? 'Có hỗ trợ khách hàng không?' : 'Is customer support available?',                            a: vi ? 'Tất cả các gói đều có hỗ trợ. Chuyên Nghiệp có hỗ trợ ưu tiên, Doanh Nghiệp có 24/7 qua điện thoại, email và chat.' : 'All plans include support. Professional gets priority, Enterprise gets 24/7 phone, email & chat.' },
  ];

  const buildCard = (plan, i) => (
    <PricingCard
      key={i}
      $featured={plan.featured}
      $color={plan.color}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.38, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] }}
      whileHover={plan.featured
        ? { y: -7, boxShadow: '0 24px 60px rgba(30,64,175,0.28)' }
        : { y: -6, boxShadow: `0 16px 44px ${plan.color}28` }}
    >
      {plan.featured && (
        <PopularBadge
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 16 }}
        >
          <Sparkles /> {vi ? 'Phổ Biến Nhất' : 'Most Popular'}
        </PopularBadge>
      )}

      <PlanIconWrap $bg={plan.bg} $bd={plan.bd} $c={plan.color} $dur={plan.dur}
        whileHover={{ scale: 1.1, rotate: -7, transition: { type: 'spring', stiffness: 300 } }}
      >
        <plan.Icon />
      </PlanIconWrap>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.12 + 0.15 }}
      >
        <PlanName>{plan.name}</PlanName>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.12 + 0.22, type: 'spring', stiffness: 200 }}
      >
        <PriceBox>
          <PriceNum $c={plan.color}>
            {plan.price}<span className="unit">{plan.curr}</span>
          </PriceNum>
          <PricePer>{plan.per}</PricePer>
        </PriceBox>
      </motion.div>

      <Features>
        {plan.feats.map((f, fi) => (
          <FeatureItem
            key={fi}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 + fi * 0.07 + 0.28, duration: 0.22 }}
          >
            <span className="chk"><Check /></span>
            {f}
          </FeatureItem>
        ))}
      </Features>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 + 0.45 }}
      >
        <Btn $primary={plan.featured} whileTap={{ scale: 0.97 }}>
          {plan.featured && <Sparkles />}
          {plan.featured ? (vi ? 'Bắt Đầu Ngay' : 'Start Now') : (vi ? 'Chọn Gói' : 'Select Plan')}
        </Btn>
      </motion.div>
    </PricingCard>
  );

  return (
    <DashboardLayout role="employer" showSearch={false}>
      <OrbBlue /><OrbGreen />
      <PageContainer
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
      >
        <Inner>
          {/* Header */}
          <PageHeader>
            <PageIconBox whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}>
              <Star />
            </PageIconBox>
            <PageTitleText>
              <h1>{vi ? 'Chọn Gói Của Bạn' : 'Choose Your Plan'}</h1>
              <p>{vi ? 'Chọn gói phù hợp cho nhu cầu tuyển dụng' : 'Choose the right plan for your hiring needs'}</p>
            </PageTitleText>
          </PageHeader>

          {/* Pricing grid */}
          <PricingGrid>
            {plans.map((plan, i) => buildCard(plan, i))}
          </PricingGrid>

          {/* Comparison */}
          <SectionCard
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.32 }}
          >
            <SectionHead><h2>{vi ? 'So Sánh Chi Tiết Các Gói' : 'Detailed Plan Comparison'}</h2></SectionHead>
            <CompTable>
              <thead>
                <tr>
                  <th>{vi ? 'Tính Năng' : 'Feature'}</th>
                  <th style={{ color: '#10B981' }}>{vi ? 'Cơ Bản' : 'Basic'}</th>
                  <th style={{ color: '#1e40af' }}>{vi ? 'Chuyên Nghiệp' : 'Professional'}</th>
                  <th style={{ color: '#F59E0B' }}>{vi ? 'Doanh Nghiệp' : 'Enterprise'}</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map(([label, ...vals], ri) => (
                  <tr key={ri}>
                    <td>{label}</td>
                    {vals.map((v, vi2) => (
                      <td key={vi2}>
                        {typeof v === 'boolean'
                          ? v ? <Check style={{ color: '#10B981' }} /> : <X style={{ color: '#EF4444' }} />
                          : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </CompTable>
          </SectionCard>

          {/* FAQ */}
          <SectionCard
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.32 }}
          >
            <SectionHead><h2>{vi ? 'Câu Hỏi Thường Gặp' : 'FAQ'}</h2></SectionHead>
            {faqs.map(({ Icon, q, a }, i) => (
              <FAQItem
                key={i}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.24 }}
              >
                <h3><Icon />{q}</h3>
                <p>{a}</p>
              </FAQItem>
            ))}
          </SectionCard>
        </Inner>
      </PageContainer>
    </DashboardLayout>
  );
};

export default Subscription;
