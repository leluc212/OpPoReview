import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

/* ────────────────────────────────────────────────────────────────────
   KEYFRAMES
──────────────────────────────────────────────────────────────────── */
const drift = keyframes`
  0%,100% { transform: translateY(0px) rotate(0deg); }
  50%      { transform: translateY(-22px) rotate(3deg); }
`;
const driftB = keyframes`
  0%,100% { transform: translateY(0px) rotate(0deg); }
  50%      { transform: translateY(18px) rotate(-4deg); }
`;
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const scanLine = keyframes`
  0%   { top: 0%; opacity: 0.6; }
  100% { top: 100%; opacity: 0; }
`;
const countUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const ripple = keyframes`
  0%   { transform: scale(0.85); opacity: 0.7; }
  100% { transform: scale(1.6);  opacity: 0; }
`;
const inputFocusGlow = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(14,57,149,0.3); }
  70%  { box-shadow: 0 0 0 8px rgba(14,57,149,0); }
  100% { box-shadow: 0 0 0 0 rgba(14,57,149,0); }
`;

/* ────────────────────────────────────────────────────────────────────
   ROOT LAYOUT
──────────────────────────────────────────────────────────────────── */
const Root = styled.div`
  min-height: 100vh;
  display: flex;
  background: #f0f4ff;
  font-family: 'Grandstander', 'Inter', sans-serif;
  color-scheme: light;
  overflow: hidden;
  position: relative;
`;

/* ────────────────────────────────────────────────────────────────────
   LEFT PANEL — Hero / Brand
──────────────────────────────────────────────────────────────────── */
const Left = styled.div`
  width: 48%;
  min-height: 100vh;
  background: linear-gradient(145deg, #0a2470 0%, #0e3995 45%, #1a56d6 100%);
  background-size: 200% 200%;
  animation: ${gradientShift} 8s ease infinite;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 56px;
  overflow: hidden;

  @media (max-width: 960px) { display: none; }
`;

/* decorative circles */
const Circle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,${p => p.$op || 0.06});
  width:  ${p => p.$s}px;
  height: ${p => p.$s}px;
  top:  ${p => p.$t || 'auto'};
  left: ${p => p.$l || 'auto'};
  right: ${p => p.$r || 'auto'};
  bottom: ${p => p.$b || 'auto'};
  animation: ${p => p.$rev ? driftB : drift} ${p => p.$dur || 14}s ease-in-out infinite;
  animation-delay: ${p => p.$delay || 0}s;
`;

const GridLines = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 48px 48px;
`;

const ScanBar = styled.div`
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(96,165,250,0.6), transparent);
  animation: ${scanLine} 5s linear infinite;
`;

/* Brand */
const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 52px;
  position: relative;
  z-index: 2;
`;
const LogoImg = styled.img`
  height: 40px;
  filter: brightness(0) invert(1);
`;
const BrandName = styled.span`
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
`;

/* Headline */
const Headline = styled.h1`
  font-size: clamp(32px, 3.2vw, 44px);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -1.5px;
  color: #fff;
  margin-bottom: 18px;
  position: relative;
  z-index: 2;

  .highlight {
    display: inline-block;
    background: linear-gradient(90deg, #93c5fd, #a5f3fc, #bfdbfe);
    background-size: 200%;
    animation: ${gradientShift} 4s ease infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Sub = styled.p`
  font-size: 15px;
  color: rgba(255,255,255,0.68);
  line-height: 1.75;
  max-width: 380px;
  margin-bottom: 48px;
  position: relative;
  z-index: 2;
`;

/* Feature card — floating glassmorphism card */
const FeatureCard = styled(motion.div)`
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 28px 28px 24px;
  position: relative;
  z-index: 2;
  margin-bottom: 20px;
`;

const CardTag = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: #93c5fd;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 14px;
`;

const FeatureRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255,255,255,0.9);
  font-size: 14px;
  font-weight: 500;
`;

const FeatureIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: ${p => p.$bg || 'rgba(96,165,250,0.25)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 15px;
`;

/* Stats row */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 24px;
  position: relative;
  z-index: 2;
`;

const StatBox = styled.div`
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  padding: 16px 12px;
  text-align: center;
`;

const StatNum = styled.div`
  font-size: 22px;
  font-weight: 900;
  color: #fff;
  letter-spacing: -1px;
  animation: ${countUp} 0.6s ease both;
  animation-delay: ${p => p.$d || 0}s;
`;

const StatLbl = styled.div`
  font-size: 10.5px;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-top: 4px;
`;

/* Floating badge */
const Badge = styled(motion.div)`
  position: absolute;
  right: -12px;
  top: 28px;
  background: #10b981;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  box-shadow: 0 6px 20px rgba(16,185,129,0.4);
  z-index: 3;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
    flex-shrink: 0;
  }
`;

/* ────────────────────────────────────────────────────────────────────
   RIGHT PANEL
──────────────────────────────────────────────────────────────────── */
const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
  position: relative;
  overflow-y: auto;

  /* subtle bg pattern */
  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 80%, rgba(14,57,149,0.08) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 0%,  rgba(96,165,250,0.07) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 960px) {
    background: linear-gradient(145deg, #0a2470 0%, #0e3995 100%);
    &::before { display: none; }
  }
`;

/* ────────────────────────────────────────────────────────────────────
   FORM CARD
──────────────────────────────────────────────────────────────────── */
const Card = styled(motion.div)`
  background: #fff;
  border-radius: 26px;
  padding: 42px 40px 36px;
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 1;
  box-shadow:
    0 2px 4px rgba(0,0,0,0.04),
    0 8px 24px rgba(14,57,149,0.1),
    0 32px 64px rgba(14,57,149,0.12);

  /* Top accent */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 32px; right: 32px;
    height: 3px;
    background: linear-gradient(90deg, #0E3995, #3b82f6, #60a5fa);
    border-radius: 0 0 4px 4px;
  }

  @media (max-width: 960px) {
    max-width: 420px;
  }
`;

/* Card header */
const CardHead = styled.div`
  margin-bottom: 26px;
`;

const CardLogoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const MiniLogo = styled.img`
  height: 34px;
`;

const MiniName = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: #0E3995;
  letter-spacing: -0.3px;
`;

const CardTitle = styled.h2`
  font-size: 21px;
  font-weight: 800;
  color: #0f172a;
  text-align: center;
  margin-bottom: 5px;
  letter-spacing: -0.5px;
`;

const CardNote = styled.p`
  font-size: 13px;
  color: #94a3b8;
  text-align: center;

  a {
    color: #0E3995;
    font-weight: 700;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

/* ── Step pills ── */
const StepPills = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  margin: 22px 0 24px;
`;

const Pill = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex: 1;
`;

const PillDot = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s ease;
  position: relative;

  ${p => p.$done && css`
    background: #10b981;
    color: #fff;
    box-shadow: 0 3px 10px rgba(16,185,129,0.4);
  `}
  ${p => p.$active && !p.$done && css`
    background: #0E3995;
    color: #fff;
    box-shadow: 0 3px 12px rgba(14,57,149,0.45);

    &::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid rgba(14,57,149,0.25);
      animation: ${inputFocusGlow} 2s ease infinite;
    }
  `}
  ${p => !p.$done && !p.$active && css`
    background: #f1f5f9;
    color: #94a3b8;
  `}
`;

const PillText = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: ${p => p.$active || p.$done ? '#0E3995' : '#cbd5e1'};
`;

const PillLine = styled.div`
  flex: 1;
  height: 2px;
  background: ${p => p.$done ? '#10b981' : '#e2e8f0'};
  margin-bottom: 18px;
  transition: background 0.4s ease;
`;

/* ── Social row ── */
const SocialRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 18px;
`;

const SocialBtn = styled(motion.button)`
  padding: 11px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: #fafafa;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: ${p => p.$c};
    background: ${p => p.$c}0e;
    box-shadow: 0 3px 12px ${p => p.$c}22;
  }
`;

/* ── Divider ── */
const Or = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;

  span {
    font-size: 11.5px;
    font-weight: 600;
    color: #cbd5e1;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #f0f4f8;
  }
`;

/* ─── Floating-label field ─── */
const Field = styled.div`
  position: relative;
  margin-bottom: 14px;
`;

const FieldLabel = styled.label`
  position: absolute;
  left: ${p => p.$icon ? '44px' : '16px'};
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #b0bec5;
  font-weight: 500;
  pointer-events: none;
  transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
  background: transparent;
  line-height: 1;

  ${p => p.$up && css`
    top: 0;
    left: ${p.$icon ? '38px' : '12px'};
    font-size: 10.5px;
    font-weight: 700;
    color: ${p.$err ? '#ef4444' : '#0E3995'};
    background: #fff;
    padding: 0 5px;
    transform: translateY(-50%);
    text-transform: uppercase;
    letter-spacing: 0.4px;
  `}
`;

const FieldIconLeft = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  color: ${p => p.$focused ? '#0E3995' : '#c0cad4'};

  svg { width: 17px; height: 17px; }
`;

const FieldIconRight = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #b0bec5;
  padding: 4px;
  transition: color 0.2s;

  &:hover { color: #0E3995; }
  svg { width: 16px; height: 16px; }
`;

const FieldInput = styled.input`
  width: 100%;
  height: 52px;
  padding: ${p => p.$icon ? '16px 44px 0 44px' : '16px 16px 0 16px'};
  ${p => p.$right && 'padding-right: 44px;'}
  font-size: 14.5px;
  font-weight: 600;
  font-family: inherit;
  color: #0f172a;
  border: 1.5px solid ${p => p.$err ? '#ef4444' : p.$focused ? '#0E3995' : '#e8edf2'};
  border-radius: 13px;
  background: ${p => p.$focused ? '#f8faff' : '#fafbfc'};
  outline: none;
  transition: border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;

  ${p => p.$focused && !p.$err && css`
    box-shadow: 0 0 0 3.5px rgba(14,57,149,0.1);
  `}
  ${p => p.$err && css`
    box-shadow: 0 0 0 3px rgba(239,68,68,0.12);
  `}

  &::placeholder { color: transparent; }
`;

const FieldErr = styled.p`
  font-size: 11.5px;
  color: #ef4444;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
`;

/* ── Password strength ── */
const PwStrengthWrap = styled.div`
  margin: -6px 0 10px;
`;

const PwBars = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 4px;
`;

const PwBar = styled.div`
  flex: 1;
  height: 3px;
  border-radius: 999px;
  background: ${p => p.$on ? p.$color : '#e8edf2'};
  transition: background 0.4s ease;
`;

const PwLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${p => p.$color};
  text-align: right;
`;

/* ── Checkbox ── */
const CheckRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 16px;
`;

const CheckBox = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid ${p => p.$checked ? '#0E3995' : '#d1d9e0'};
  background: ${p => p.$checked ? '#0E3995' : '#fff'};
  flex-shrink: 0;
  margin-top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  svg {
    width: 11px;
    height: 11px;
    color: #fff;
    opacity: ${p => p.$checked ? 1 : 0};
    transition: opacity 0.2s;
  }
`;

const CheckText = styled.span`
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.5;

  a {
    color: #0E3995;
    font-weight: 700;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

/* ── Submit button ── */
const SubmitBtn = styled(motion.button)`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #0a2470 0%, #0E3995 50%, #1a56d6 100%);
  background-size: 200%;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.2px;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 14px;
  transition: box-shadow 0.25s, background-position 0.4s;
  animation: ${gradientShift} 5s ease infinite;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
    pointer-events: none;
  }

  &:hover {
    box-shadow: 0 8px 28px rgba(14,57,149,0.45);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg { width: 18px; height: 18px; transition: transform 0.25s; }
  &:hover svg { transform: translateX(4px); }
`;

const BackBtn = styled.button`
  width: 100%;
  height: 44px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: transparent;
  color: #64748b;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.2s, color 0.2s;
  margin-bottom: 12px;

  &:hover {
    border-color: #0E3995;
    color: #0E3995;
  }
`;

const FootNote = styled.p`
  font-size: 11.5px;
  color: #cbd5e1;
  text-align: center;
  line-height: 1.6;

  a { color: #0E3995; font-weight: 600; text-decoration: none; }
`;

/* ────────────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────────── */
function pwStrength(pw) {
  if (!pw) return null;
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: 1, label: 'Yếu', color: '#ef4444' };
  if (s <= 2) return { score: 2, label: 'Trung bình', color: '#f59e0b' };
  if (s <= 3) return { score: 3, label: 'Khá mạnh', color: '#3b82f6' };
  return { score: 4, label: 'Rất mạnh', color: '#10b981' };
}

/* ── Floating input component ── */
function FInput({ id, name, type = 'text', label, value, onChange, error, iconL, iconR, onToggle }) {
  const [focused, setFocused] = useState(false);
  const up = focused || !!value;
  return (
    <Field>
      {iconL && <FieldIconLeft $focused={focused}>{iconL}</FieldIconLeft>}
      <FieldInput
        id={id} name={name} type={type}
        value={value} onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        $icon={!!iconL} $right={!!iconR}
        $focused={focused} $err={!!error}
        autoComplete="off"
      />
      <FieldLabel htmlFor={id} $up={up} $icon={!!iconL} $err={!!error}>{label}</FieldLabel>
      {iconR && (
        <FieldIconRight type="button" onClick={onToggle}>
          {iconR}
        </FieldIconRight>
      )}
      {error && <FieldErr>⚠ {error}</FieldErr>}
    </Field>
  );
}

/* ── Icons (inline SVG) ── */
const IconMail = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const IconLock = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const IconEye = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const IconEyeOff = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;
const IconBuilding = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const IconPhone = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const IconArrow = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>;
const IconCheck = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const IconUser = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;

/* ────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────────────────────── */
const EmployerRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    companyName: '', phone: '',
  });
  const [errors, setErrors] = useState({});

  const pw = pwStrength(form.password);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.email) e.email = 'Vui lòng nhập email công ty';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không đúng định dạng';
    if (!form.password) e.password = 'Vui lòng nhập mật khẩu';
    else if (form.password.length < 6) e.password = 'Mật khẩu ít nhất 6 ký tự';
    if (!form.confirmPassword) e.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Mật khẩu không khớp';
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.companyName) e.companyName = 'Vui lòng nhập tên công ty';
    if (!form.phone) e.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9]{9,11}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Số điện thoại không hợp lệ';
    if (!agreed) e.agreed = 'Bạn cần đồng ý điều khoản';
    return e;
  };

  const goNext = () => {
    const e = validateStep1();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    navigate('/verify-otp', { state: { email: form.email, role: 'employer' } });
  };

  const handleSocial = p => alert(`Đăng ký bằng ${p} (đang phát triển)`);

  /* slide variants */
  const slide = {
    enter: dir => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
    center: { opacity: 1, x: 0 },
    exit: dir => ({ opacity: 0, x: dir > 0 ? -32 : 32 }),
  };

  return (
    <Root>
      {/* ══════════════════ LEFT PANEL ══════════════════ */}
      <Left>
        <GridLines />
        <ScanBar />

        {/* Decorative circles */}
        <Circle $s={420} $t="-18%" $r="-12%" $op={0.07} $dur={18} />
        <Circle $s={260} $b="-10%" $l="-8%" $op={0.09} $dur={13} $rev />
        <Circle $s={140} $t="55%" $l="5%" $op={0.1} $dur={20} $delay={3} />
        <Circle $s={80} $b="20%" $r="8%" $op={0.12} $dur={9} $delay={1} $rev />

        <BrandRow>
          <LogoImg src="/images/logo.png" alt="Ốp Pờ"
            onError={e => { e.target.style.display = 'none'; }} />
          <BrandName>Ốp Pờ</BrandName>
        </BrandRow>

        <Headline>
          Tuyển dụng<br />
          <span className="highlight">part-time</span><br />
          chưa bao giờ dễ hơn
        </Headline>

        <Sub>
          Kết nối với hàng ngàn ứng viên năng động — đăng tin trong 2 phút,
          nhận hồ sơ ngay hôm nay. Miễn phí, không giới hạn.
        </Sub>

        {/* Feature glass card */}
        <div style={{ position: 'relative' }}>
          <FeatureCard
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <CardTag>Tại sao chọn Ốp Pờ?</CardTag>
            <FeatureRow>
              {[
                { text: 'Đăng tin & duyệt hồ sơ siêu tốc' },
                { text: 'AI gợi ý ứng viên phù hợp nhất' },
                { text: 'Dashboard phân tích chiến dịch tuyển dụng' },
                { text: 'Bảo mật thông tin doanh nghiệp tuyệt đối' },
              ].map((f, i) => (
                <FeatureItem key={i}>
                  <FeatureIcon $bg={f.bg}>{f.icon}</FeatureIcon>
                  <span>{f.text}</span>
                </FeatureItem>
              ))}
            </FeatureRow>
          </FeatureCard>

          <Badge
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
          >
            Đăng tuyển dụng ngay
          </Badge>
        </div>

        {/* Stats */}
        <StatsGrid>
          {[
            { num: '50K+', lbl: 'Ứng viên', d: 0 },
            { num: '8K+', lbl: 'Doanh nghiệp', d: 0.1 },
            { num: '98%', lbl: 'Hài lòng', d: 0.2 },
          ].map(s => (
            <StatBox key={s.lbl}>
              <StatNum $d={s.d}>{s.num}</StatNum>
              <StatLbl>{s.lbl}</StatLbl>
            </StatBox>
          ))}
        </StatsGrid>
      </Left>

      {/* ══════════════════ RIGHT PANEL ══════════════════ */}
      <Right>
        <Card
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <CardHead>
            <CardLogoRow>
              <MiniLogo src="/images/logo.png" alt="Ốp Pờ"
                onError={e => { e.target.style.display = 'none'; }} />
              <MiniName>Ốp Pờ</MiniName>
            </CardLogoRow>
            <CardTitle>Tạo tài khoản nhà tuyển dụng</CardTitle>
            <CardNote style={{ marginTop: 6 }}>
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </CardNote>
          </CardHead>

          {/* Step indicator */}
          <StepPills>
            <Pill>
              <PillDot $active={step === 1} $done={step > 1}>
                {step > 1 ? <IconCheck /> : '1'}
              </PillDot>
              <PillText $active={step === 1} $done={step > 1}>Tài khoản</PillText>
            </Pill>
            <PillLine $done={step > 1} />
            <Pill>
              <PillDot $active={step === 2}>2</PillDot>
              <PillText $active={step === 2}>Công ty</PillText>
            </Pill>
          </StepPills>

          {/* ── STEPS ── */}
          <AnimatePresence mode="wait" custom={step}>
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="s1"
                custom={1}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Social */}
                <SocialRow>
                  <SocialBtn type="button" $c="#EA4335"
                    onClick={() => handleSocial('Google')}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <svg viewBox="0 0 24 24" width="17" height="17">
                      <path fill="#EA4335" d="M5.266 9.765C6.199 6.939 8.854 4.91 12 4.91c1.69 0 3.218.6 4.418 1.582l3.491-3.491C17.782 1.146 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z" />
                      <path fill="#34A853" d="M16.04 18.013C14.951 18.716 13.566 19.09 12 19.09c-3.134 0-5.78-2.014-6.723-4.823l-4.04 3.067C3.193 21.294 7.265 24 12 24c2.933 0 5.735-1.043 7.834-3.001l-3.794-2.986z" />
                      <path fill="#4A90E2" d="M19.834 21C22.03 18.952 23.455 15.904 23.455 12c0-.71-.091-1.472-.273-2.182H12v4.636h6.436c-.319 1.56-1.17 2.767-2.396 3.559L19.834 21z" />
                      <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.91 12c0-.782.135-1.533.367-2.235L1.24 6.65A11.945 11.945 0 000 12c0 1.92.444 3.73 1.237 5.335l4.04-3.067z" />
                    </svg>
                    Google
                  </SocialBtn>
                  <SocialBtn type="button" $c="#1877F2"
                    onClick={() => handleSocial('Facebook')}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </SocialBtn>
                </SocialRow>

                <Or><span>hoặc dùng email</span></Or>

                <FInput id="email" name="email" type="email"
                  label="Email công ty *" value={form.email}
                  onChange={handleChange} error={errors.email}
                  iconL={<IconMail />} />

                <FInput id="password" name="password"
                  type={showPw ? 'text' : 'password'}
                  label="Mật khẩu *" value={form.password}
                  onChange={handleChange} error={errors.password}
                  iconL={<IconLock />}
                  iconR={showPw ? <IconEyeOff /> : <IconEye />}
                  onToggle={() => setShowPw(p => !p)} />

                {form.password && pw && (
                  <PwStrengthWrap>
                    <PwBars>
                      {[1, 2, 3, 4].map(i => (
                        <PwBar key={i} $on={pw.score >= i} $color={pw.color} />
                      ))}
                    </PwBars>
                    <PwLabel $color={pw.color}>{pw.label}</PwLabel>
                  </PwStrengthWrap>
                )}

                <FInput id="confirmPassword" name="confirmPassword"
                  type={showCpw ? 'text' : 'password'}
                  label="Xác nhận mật khẩu *" value={form.confirmPassword}
                  onChange={handleChange} error={errors.confirmPassword}
                  iconL={<IconLock />}
                  iconR={showCpw ? <IconEyeOff /> : <IconEye />}
                  onToggle={() => setShowCpw(p => !p)} />

                <SubmitBtn
                  type="button" onClick={goNext}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Tiếp tục <IconArrow />
                </SubmitBtn>

                <FootNote>
                  Quay về? <Link to="/register">Chọn lại vai trò</Link>
                </FootNote>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="s2"
                custom={2}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <CardNote style={{ textAlign: 'left', color: '#64748b', marginBottom: 18, fontSize: 13.5, lineHeight: 1.7 }}>
                  Chỉ còn một bước! Điền thông tin công ty để hoàn tất đăng ký.
                </CardNote>

                <FInput id="companyName" name="companyName" type="text"
                  label="Tên công ty *" value={form.companyName}
                  onChange={handleChange} error={errors.companyName}
                  iconL={<IconBuilding />} />

                <FInput id="phone" name="phone" type="tel"
                  label="Số điện thoại liên hệ *" value={form.phone}
                  onChange={handleChange} error={errors.phone}
                  iconL={<IconPhone />} />

                <CheckRow onClick={() => setAgreed(p => !p)}>
                  <CheckBox $checked={agreed}>
                    <IconCheck />
                  </CheckBox>
                  <CheckText>
                    Tôi đã đọc và đồng ý với{' '}
                    <a href="#" onClick={e => e.stopPropagation()}>Điều khoản dịch vụ</a>
                    {' '}và{' '}
                    <a href="#" onClick={e => e.stopPropagation()}>Chính sách bảo mật</a>{' '}
                    của Ốp Pờ.
                  </CheckText>
                </CheckRow>
                {errors.agreed && <FieldErr style={{ marginTop: -8, marginBottom: 10 }}>⚠ {errors.agreed}</FieldErr>}

                <form onSubmit={handleSubmit}>
                  <SubmitBtn
                    type="submit" disabled={!agreed}
                    whileHover={agreed ? { scale: 1.02 } : {}}
                    whileTap={agreed ? { scale: 0.98 } : {}}>
                    Tạo tài khoản <IconArrow />
                  </SubmitBtn>
                </form>

                <BackBtn type="button" onClick={() => setStep(1)}>
                  ← Quay lại
                </BackBtn>

                <FootNote>
                  Bằng cách đăng ký, bạn đồng ý nhận email thông báo từ Ốp Pờ.{' '}
                  <a href="#">Huỷ đăng ký</a> bất cứ lúc nào.
                </FootNote>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </Right>
    </Root>
  );
};

export default EmployerRegister;
