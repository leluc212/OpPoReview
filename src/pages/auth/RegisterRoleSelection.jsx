import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

/* ═══════════════════════════════════════════════
   KEYFRAMES
═══════════════════════════════════════════════ */
const gradShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const orbFloat = keyframes`
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(30px,-30px) scale(1.06); }
  66%      { transform: translate(-20px,18px) scale(0.96); }
`;
const sparkle = keyframes`
  0%,100% { opacity:0.15; transform:scale(0.8) rotate(0deg); }
  50%      { opacity:1;    transform:scale(1.2) rotate(20deg); }
`;
const scanY = keyframes`
  0%   { top: -2px; opacity: 0.7; }
  100% { top: 100%; opacity: 0; }
`;
const ticker = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;
const fadeUp = keyframes`
  from { opacity:0; transform:translateY(24px); }
  to   { opacity:1; transform:translateY(0); }
`;
const cardGlow = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(14,57,149,0); }
  50%      { box-shadow: 0 0 40px 4px rgba(14,57,149,0.18); }
`;

/* ═══════════════════════════════════════════════
   PAGE ROOT
═══════════════════════════════════════════════ */
const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(145deg, #060f3e 0%, #0d2778 30%, #0E3995 60%, #1648c8 100%);
  background-size: 220% 220%;
  animation: ${gradShift} 12s ease infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif !important;
  color-scheme: light;

  * {
    font-family: inherit !important;
  }
`;

/* grid */
const Grid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 52px 52px;
  pointer-events: none;
`;

/* orbs */
const Orb = styled.div`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, ${p => p.$c} 0%, transparent 70%);
  width:  ${p => p.$s}px;
  height: ${p => p.$s}px;
  top:    ${p => p.$t || 'auto'};
  left:   ${p => p.$l || 'auto'};
  right:  ${p => p.$r || 'auto'};
  bottom: ${p => p.$b || 'auto'};
  animation: ${orbFloat} ${p => p.$dur}s ease-in-out infinite;
  animation-delay: ${p => p.$d || 0}s;
  pointer-events: none;
  filter: blur(${p => p.$blur || 0}px);
`;

/* scan */
const Scan = styled.div`
  position: absolute;
  left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(96,165,250,0.5), rgba(255,255,255,0.3), rgba(96,165,250,0.5), transparent);
  animation: ${scanY} 7s linear infinite;
  pointer-events: none;
`;

/* sparkle stars */
const Star = styled.div`
  position: absolute;
  color: rgba(255,255,255,0.7);
  font-size: ${p => p.$s || 14}px;
  top:  ${p => p.$t};
  left: ${p => p.$l};
  animation: ${sparkle} ${p => p.$dur || 3}s ease-in-out infinite;
  animation-delay: ${p => p.$d || 0}s;
  pointer-events: none;
`;

/* ═══════════════════════════════════════════════
   CONTENT
═══════════════════════════════════════════════ */
const Wrap = styled(motion.div)`
  width: 100%;
  max-width: 1060px;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* brand */
const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 12px 28px;
  border-radius: 18px;
  text-decoration: none;
  margin-bottom: 40px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  transition: transform 0.25s, box-shadow 0.25s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.2);
  }
`;
const BrandImg = styled.img`
  height: 52px;
  object-fit: contain;
`;

/* eyebrow pill */
const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 999px;
  padding: 7px 16px;
  font-size: 11.5px;
  font-weight: 700;
  color: #93c5fd;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
`;

/* headline */
const H1 = styled.h1`
  font-size: clamp(34px, 5vw, 58px);
  font-weight: 900;
  letter-spacing: -2px;
  line-height: 1.3;
  padding: 8px 0;
  color: #fff;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 14px;

  .shine {
    background: linear-gradient(90deg, #93c5fd, #c4b5fd, #fbcfe8, #93c5fd);
    background-size: 300%;
    animation: ${gradShift} 5s ease infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Sub = styled.p`
  font-size: 16px;
  color: rgba(255,255,255,0.65);
  text-align: center;
  line-height: 1.7;
  max-width: 520px;
  margin-bottom: 52px;
`;

/* ═══════════════════════════════════════════════
   ROLE CARDS
═══════════════════════════════════════════════ */
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  width: 100%;
  margin-bottom: 40px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    max-width: 440px;
  }
`;

const RoleCard = styled(motion.div)`
  background: #fff;
  border-radius: 26px;
  padding: 40px 36px 36px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12), 0 20px 48px rgba(14,57,149,0.15);
  border: 2px solid transparent;
  transition: border-color 0.3s, box-shadow 0.3s;

  /* top accent */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: ${p => p.$grad};
    border-radius: 0;
  }

  /* shimmer on hover */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    border-color: ${p => p.$accent};
    box-shadow: 0 8px 32px rgba(0,0,0,0.1), 0 24px 64px ${p => p.$shadow};

    &::after { opacity: 1; }
  }
`;

/* icon wrapper */
const IconWrap = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: ${p => p.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 32px;
  flex-shrink: 0;
  transition: transform 0.3s;

  ${RoleCard}:hover & {
    transform: scale(1.08) rotate(-4deg);
  }
`;

const CardTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
  margin-bottom: 10px;
`;

const CardDesc = styled.p`
  font-size: 14px;
  color: #64748b;
  line-height: 1.65;
  margin-bottom: 24px;
`;

const FeatureList = styled.ul`
  list-style: none;
  margin: 0 0 32px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: #475569;
  font-weight: 500;

  &::before {
    content: '✓';
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: ${p => p.$bg};
    color: ${p => p.$c};
    font-weight: 800;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
`;

const SelectBtn = styled(motion.button)`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 14px;
  background: ${p => p.$grad};
  background-size: 200%;
  animation: ${gradShift} 6s ease infinite;
  color: #fff;
  font-size: 14.5px;
  font-weight: 700;
  letter-spacing: -0.2px;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: box-shadow 0.25s, opacity 0.25s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    pointer-events: none;
  }

  &:hover {
    box-shadow: 0 8px 28px ${p => p.$shadow};
    opacity: 0.93;
  }

  .arrow {
    font-size: 18px;
    transition: transform 0.25s;
  }
  &:hover .arrow { transform: translateX(5px); }
`;

/* popular badge */
const Popular = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #f59e0b, #fb923c);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

/* ═══════════════════════════════════════════════
   TICKER
═══════════════════════════════════════════════ */
const TickerOuter = styled.div`
  width: 100%;
  overflow: hidden;
  margin-bottom: 36px;
  position: relative;

  &::before, &::after {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    width: 60px;
    z-index: 2;
  }
  &::before { left: 0; background: linear-gradient(90deg, rgba(10,30,100,0.9), transparent); }
  &::after  { right: 0; background: linear-gradient(-90deg, rgba(10,30,100,0.9), transparent); }
`;

const TickerTrack = styled.div`
  display: flex;
  gap: 32px;
  white-space: nowrap;
  animation: ${ticker} 28s linear infinite;
`;

const TickerChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.55);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 999px;
  padding: 5px 13px;
  flex-shrink: 0;
`;

/* ═══════════════════════════════════════════════
   BOTTOM ROW
═══════════════════════════════════════════════ */
const BottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;

  @media (max-width: 520px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const LoginNote = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  text-align: center;

  a {
    color: #93c5fd;
    font-weight: 700;
    text-decoration: none;
    padding: 3px 8px;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover { background: rgba(147,197,253,0.15); }
  }
`;

const DividerDot = styled.span`
  width: 4px; height: 4px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);

  @media (max-width: 520px) { display: none; }
`;

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
const RegisterRoleSelection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [hovered, setHovered] = useState(null);

  const roles = [
    {
      key: 'candidate',
      emoji: '🎯',
      iconBg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      grad: 'linear-gradient(135deg, #0E3995 0%, #2563eb 50%, #3b82f6 100%)',
      accent: '#3b82f6',
      shadow: 'rgba(59,130,246,0.45)',
      fBg: '#eff6ff',
      fC: '#2563eb',
      path: '/register/candidate',
      popular: false,
      title: t.register.candidateTitle,
      desc: t.register.candidateDescription,
      features: [
        t.register.candidateFeature1,
        t.register.candidateFeature2,
        t.register.candidateFeature3,
        t.register.candidateFeature4,
      ],
      btn: t.register.candidateButton,
    },
    {
      key: 'employer',
      emoji: '🏢',
      iconBg: 'linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%)',
      grad: 'linear-gradient(135deg, #0369a1 0%, #0E3995 50%, #1d4ed8 100%)',
      accent: '#0E3995',
      shadow: 'rgba(14,57,149,0.45)',
      fBg: '#eff6ff',
      fC: '#0E3995',
      path: '/register/employer',
      popular: true,
      title: t.register.employerTitle,
      desc: t.register.employerDescription,
      features: [
        t.register.employerFeature1,
        t.register.employerFeature2,
        t.register.employerFeature3,
        t.register.employerFeature4,
      ],
      btn: t.register.employerButton,
    },
  ];

  const chips = [
    '☕ Barista', '🛵 Shipper', '📚 Gia sư', '🎨 Designer', '💻 Dev freelance',
    '🏪 Bán hàng', '📦 Kho vận', '💆 Spa', '🎤 MC sự kiện', '🍜 Phục vụ',
    '☕ Barista', '🛵 Shipper', '📚 Gia sư', '🎨 Designer', '💻 Dev freelance',
    '🏪 Bán hàng', '📦 Kho vận', '💆 Spa', '🎤 MC sự kiện', '🍜 Phục vụ',
  ];

  /* stagger */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13 } },
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22,1,0.36,1] } },
  };

  return (
    <Page>
      <Grid />
      <Scan />

      {/* orbs */}
      <Orb $s={600} $t="-18%" $r="-12%" $c="rgba(30,95,210,0.5)"  $dur={22} $blur={30} />
      <Orb $s={400} $b="-14%" $l="-8%"  $c="rgba(14,57,149,0.6)"  $dur={17} $d={-4} $blur={20} />
      <Orb $s={200} $t="42%"  $l="5%"   $c="rgba(96,165,250,0.35)" $dur={13} $d={-7} $blur={10} />
      <Orb $s={150} $b="18%"  $r="4%"   $c="rgba(167,139,250,0.3)" $dur={19} $d={-2} $blur={8} />

      {/* sparkles */}
      <Star $s={16} $t="8%"  $l="6%"  $dur={2.8} $d={0}>✦</Star>
      <Star $s={12} $t="18%" $l="92%" $dur={3.5} $d={1}>✦</Star>
      <Star $s={10} $t="72%" $l="4%"  $dur={4}   $d={0.5}>✦</Star>
      <Star $s={14} $t="85%" $l="88%" $dur={2.4} $d={1.5}>✦</Star>
      <Star $s={8}  $t="48%" $l="97%" $dur={3.2} $d={0.8}>✦</Star>

      <Wrap
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* brand */}
        <motion.div variants={item}>
          <BrandLink to="/">
            <BrandImg src="/images/logo.png" alt="Ốp Pờ" onError={e => { e.target.style.display='none'; }} />
          </BrandLink>
        </motion.div>

        {/* headline */}
        <motion.div variants={item} style={{ textAlign:'center' }}>

          <H1>
            {t.register.joinTitle.split(' ').slice(0,2).join(' ')}{' '}
            <span className="shine">{t.register.joinTitle.split(' ').slice(2).join(' ')}</span>
          </H1>
          <Sub>{t.register.joinSubtitle}</Sub>
        </motion.div>

        {/* ticker */}
        <motion.div variants={item} style={{ width:'100%' }}>
          <TickerOuter>
            <TickerTrack>
              {chips.map((c, i) => <TickerChip key={i}>{c}</TickerChip>)}
            </TickerTrack>
          </TickerOuter>
        </motion.div>

        {/* cards */}
        <CardGrid>
          {roles.map((r, ri) => (
            <motion.div key={r.key} variants={item}>
              <RoleCard
                $grad={r.grad}
                $accent={r.accent}
                $shadow={`rgba(14,57,149,0.25)`}
                onClick={() => navigate(r.path)}
                onHoverStart={() => setHovered(r.key)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ y: -8, transition: { duration: 0.28, ease: [0.22,1,0.36,1] } }}
                whileTap={{ scale: 0.985 }}
              >
                {r.popular && <Popular>🔥 Phổ biến</Popular>}

                <IconWrap $bg={r.iconBg}>{r.emoji}</IconWrap>

                <CardTitle>{r.title}</CardTitle>
                <CardDesc>{r.desc}</CardDesc>

                <FeatureList>
                  {r.features.map((f, i) => (
                    <FeatureItem key={i} $bg={r.fBg} $c={r.fC}>{f}</FeatureItem>
                  ))}
                </FeatureList>

                <SelectBtn
                  type="button"
                  $grad={r.grad}
                  $shadow={r.shadow}
                  onClick={e => { e.stopPropagation(); navigate(r.path); }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {r.btn}
                  <span className="arrow">→</span>
                </SelectBtn>
              </RoleCard>
            </motion.div>
          ))}
        </CardGrid>

        {/* footer */}
        <motion.div variants={item}>
          <BottomRow>
            <LoginNote>
              {t.register.haveAccount}{' '}
              <Link to="/login">{t.register.signIn}</Link>
            </LoginNote>
            <DividerDot />
            <LoginNote>
              <Link to="/">← Về trang chủ</Link>
            </LoginNote>
          </BottomRow>
        </motion.div>
      </Wrap>
    </Page>
  );
};

export default RegisterRoleSelection;
