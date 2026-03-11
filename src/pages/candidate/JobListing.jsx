import React, { useMemo, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import {
  Search, MapPin, Briefcase, Clock, Star, TrendingUp,
  ChevronDown, Building2, Bookmark, Eye, ArrowUpRight, Filter,
  X, SlidersHorizontal, Grid, List, Sparkles, Zap, Navigation, Target,
  Power, XCircle, AlertCircle, CheckCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

// Animations
const fadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const shimmer = `
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
`;

const Container = styled.div`
  ${fadeIn}
  animation: fadeIn 0.6s ease;
`;

const HeroSection = styled(motion.div)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #1e40af 100%);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 32px 40px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: pulse 8s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.2); opacity: 0.5; }
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: white;
  margin-bottom: 6px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const HeroSubtitle = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.9);
  margin-bottom: 24px;
  font-weight: 500;
`;

const SearchContainer = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 8px;
  display: flex;
  gap: 8px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.div`
  flex: ${props => props.$narrow ? '0 0 220px' : '2'};
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.bgDark};
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.textLight};
  }
  
  input {
    flex: 1;
    border: none;
    background: none;
    outline: none;
    font-size: 15px;
    color: ${props => props.theme.colors.text};
    
    &::placeholder {
      color: ${props => props.theme.colors.textLight};
    }
  }
`;

const SearchButton = styled(motion.button)`
  padding: 12px 24px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const QuickFilters = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
`;

const FilterChip = styled(motion.button)`
  padding: 6px 14px;
  background: ${props => props.$active ? props.theme.colors.bgLight : 'rgba(255,255,255,0.2)'};
  color: ${props => props.$active ? props.theme.colors.primary : 'white'};
  border: 1px solid ${props => props.$active ? props.theme.colors.bgLight : 'rgba(255,255,255,0.3)'};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: ${props => props.theme.colors.bgLight};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

// Category Tabs
const CategoryTabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const CategoryTab = styled(motion.button)`
  flex: 1;
  padding: 16px 24px;
  background: ${props => props.$active
    ? `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.secondary})`
    : props.theme.colors.bgLight};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  border: 2px solid ${props => props.$active ? 'transparent' : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: ${props => props.$active ? `0 8px 24px ${props.theme.colors.primary}30` : '0 2px 8px rgba(0,0,0,0.04)'};
  
  svg {
    width: 22px;
    height: 22px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px ${props => props.$active
    ? `${props.theme.colors.primary}40`
    : 'rgba(0,0,0,0.08)'};
    border-color: ${props => props.$active ? 'transparent' : props.theme.colors.primary};
  }
`;

const StatusCard = styled(motion.div)`
  background: ${props => props.$active
    ? 'rgba(16, 185, 129, 0.2)'
    : 'rgba(255, 255, 255, 0.15)'};
  border: 2px solid ${props => props.$active
    ? 'rgba(16, 185, 129, 0.5)'
    : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 12px;
  padding: 12px 24px;
  color: white;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  height: 48px;
  display: flex;
  align-items: center;
  
  .status-content {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    width: 100%;
    
    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
      gap: 10px;
    }
    
    .status-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 8px;
      }
      
      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        
        svg {
          width: 16px;
          height: 16px;
        }
      }
      
      .status-label {
        font-size: 14px;
        font-weight: 600;
        opacity: 0.95;
      }
      
      .status-desc {
        display: none;
      }
    }
    
    .status-icon {
      display: none;
    }
  }
`;

const LocationButton = styled(motion.button)`
  padding: 12px 24px;
  background: ${props => props.$active
    ? 'rgba(16, 185, 129, 0.2)'
    : 'rgba(255, 255, 255, 0.15)'};
  border: 2px solid ${props => props.$active
    ? 'rgba(16, 185, 129, 0.5)'
    : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  height: 48px;
  white-space: nowrap;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
`;

const ToggleButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.15);
  color: white;
  padding: 8px 16px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const ApplyModalWrap = styled.div`
  padding: 32px 28px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;

  .apply-emoji {
    font-size: 52px;
    line-height: 1;
  }

  h3 {
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin: 0;
    letter-spacing: -0.2px;
  }

  .apply-desc {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    line-height: 1.65;
    margin: 0;
    max-width: 340px;

    strong {
      color: ${props => props.theme.colors.text};
      font-weight: 700;
    }
  }

  .apply-info-card {
    width: 100%;
    background: ${props => props.theme.colors.bgDark};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 12px;
    overflow: hidden;
    text-align: left;

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 11px 16px;

      &:not(:last-child) {
        border-bottom: 1px solid ${props => props.theme.colors.border};
      }

      .info-label {
        font-size: 13px;
        color: ${props => props.theme.colors.textLight};
      }

      .info-value {
        font-size: 13.5px;
        font-weight: 700;
        color: ${props => props.theme.colors.text};
        text-align: right;
        max-width: 60%;

        &.salary { color: #10b981; }
      }
    }
  }

  .apply-buttons {
    width: 100%;
    display: flex;
    gap: 10px;
    margin-top: 4px;

    button {
      flex: 1;
      padding: 12px 20px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-cancel {
      background: ${props => props.theme.colors.bgDark};
      color: ${props => props.theme.colors.textLight};
      border: 1.5px solid ${props => props.theme.colors.border};

      &:hover {
        background: ${props => props.theme.colors.border};
        color: ${props => props.theme.colors.text};
      }
    }

    .btn-confirm {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
      box-shadow: 0 4px 14px rgba(59,130,246,0.35);

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(59,130,246,0.45);
      }

      &:active { transform: translateY(0); }
    }
  }
`;

const ConfirmationContent = styled.div`
  padding: 20px;
  
  .icon-wrapper {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    background: ${props => props.$isActive
    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)'};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid ${props => props.$isActive ? '#FEE2E2' : '#D1FAE5'};
    
    svg {
      width: 32px;
      height: 32px;
      color: ${props => props.$isActive ? '#EF4444' : '#10B981'};
    }
  }
  
  h3 {
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    text-align: center;
    margin-bottom: 10px;
    letter-spacing: -0.3px;
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    text-align: center;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    
    button {
      flex: 1;
      padding: 11px 20px;
      border-radius: ${props => props.theme.borderRadius.md};
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      
      &.confirm {
        background: ${props => props.$isActive
    ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
    : 'linear-gradient(135deg, #10B981 0%, #059669 100%)'};
        color: white;
        box-shadow: ${props => props.$isActive
    ? '0 3px 10px rgba(239, 68, 68, 0.25)'
    : '0 3px 10px rgba(16, 185, 129, 0.25)'};
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: ${props => props.$isActive
    ? '0 6px 16px rgba(239, 68, 68, 0.3)'
    : '0 6px 16px rgba(16, 185, 129, 0.3)'};
        }
      }
      
      &.cancel {
        background: ${props => props.theme.colors.bgDark};
        color: ${props => props.theme.colors.text};
        border: 1px solid ${props => props.theme.colors.border};
        
        &:hover {
          background: ${props => props.theme.colors.border};
        }
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 28px;
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FilterSidebar = styled(motion.aside)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  position: sticky;
  top: 100px;
  align-self: flex-start;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  
  @media (max-width: 1024px) {
    position: static;
    max-height: none;
    overflow: visible;
    margin-bottom: 24px;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 10px;
    
    svg {
      width: 22px;
      height: 22px;
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const ClearButton = styled.button`
  padding: 6px 12px;
  background: transparent;
  color: ${props => props.theme.colors.error};
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.error};
    color: white;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  cursor: pointer;
  user-select: none;
  
  h4 {
    font-size: 15px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }
  
  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.theme.colors.textLight};
    transition: transform 0.2s ease;
    transform: ${props => props.$expanded ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const FilterOptions = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.bgDark};
  }
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${props => props.theme.colors.primary};
  }
  
  span {
    font-size: 14px;
    color: ${props => props.theme.colors.text};
    font-weight: 500;
  }
  
  small {
    margin-left: auto;
    font-size: 12px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 600;
  }
`;

const MainContent = styled.div``;

const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
`;

const ResultsInfo = styled.div`
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 4px;
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 500;
  }
`;

const ViewControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SortSelect = styled.select`
  padding: 10px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.bgLight};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 4px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ViewButton = styled.button`
  padding: 8px 12px;
  background: ${props => props.$active ? props.theme.colors.bgDark : 'transparent'};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textLight};
  }
  
  &:hover svg {
    color: ${props => props.theme.colors.primary};
  }
`;

// Job Cards
const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const BoostBannerWrap = styled.div`
  position: relative;
  margin-bottom: 20px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  cursor: pointer;

  img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover img {
    transform: scale(1.01);
  }
`;

const BannerDots = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
`;

const BannerDot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.4)'};
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.7);
    width: ${props => props.$active ? '8px' : '12px'};
  }
  
  ${props => props.$active && `
    width: 20px;
    background: #fff;
  `}
`;

const BoostTag = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(6px);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 2;
`;

const JobCardWrapper = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 12px 40px rgba(0,0,0,0.08);
    transform: translateY(-4px);
    
    &::before {
      opacity: 1;
    }
  }
`;

const JobCardHeader = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

const CompanyLogo = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}15, ${props => props.theme.colors.secondary}15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
  border: 2px solid ${props => props.theme.colors.border};
`;

const JobInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const JobTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const CompanyName = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
  margin-bottom: 5px;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const JobMeta = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const JobCardBody = styled.div`
  margin-bottom: 12px;
`;

const JobTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const Tag = styled.span`
  padding: 4px 10px;
  background: ${props => props.theme.colors.bgLight};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 11px;
  font-weight: 600;
  border: 1px solid ${props => props.theme.colors.border};
`;

const JobSalary = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: linear-gradient(135deg, ${props => props.theme.colors.success}10, ${props => props.theme.colors.success}05);
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.success}30;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.colors.success};
  }
  
  span {
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme.colors.success};
  }
`;

const JobCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const JobActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled(motion.button)`
  padding: 8px 14px;
  background: ${props => props.$primary
    ? `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.secondary})`
    : props.theme.colors.bgLight};
  color: ${props => props.$primary ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.$primary ? 'transparent' : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
  
  svg {
    width: 14px;
    height: 14px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.$primary
    ? `${props.theme.colors.primary}40`
    : 'rgba(0,0,0,0.08)'};
  }
`;

const SaveButton = styled(motion.button)`
  width: 34px;
  height: 34px;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.$saved ? props.theme.colors.warning + '15' : props.theme.colors.bgLight};
  color: ${props => props.$saved ? props.theme.colors.warning : props.theme.colors.textLight};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  svg {
    width: 16px;
    height: 16px;
    fill: ${props => props.$saved ? props.theme.colors.warning : 'none'};
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.warning};
    color: ${props => props.theme.colors.warning};
    background: ${props => props.theme.colors.warning}15;
  }
`;

const JobPosted = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
  
  svg {
    width: 13px;
    height: 13px;
  }
`;

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

// Translate salary string based on language
const translateSalary = (salaryStr, language) => {
  if (language === 'vi') return salaryStr;
  return salaryStr
    .replace(/triệu VND/g, 'million VND')
    .replace(/\/ca/g, '/shift')
    .replace(/\/giờ/g, '/hour')
    .replace(/\/tiếng/g, '/hrs');
};

// Calculate per-shift salary for jobs with hourly rate
const calculateShiftSalary = (job) => {
  // Only convert if salary is in VNĐ/giờ format
  if (!job.salary.includes('VNĐ/giờ')) return job.salary;
  
  // Parse original hourly rate - "28.000" means 28000 VND
  const rateMatch = job.salary.match(/([\d.]+)/);
  if (!rateMatch) return job.salary;
  const originalRate = parseInt(rateMatch[1].replace(/\./g, ''));
  
  // Min hourly rate is 28,050
  const hourlyRate = Math.max(originalRate, 28050);
  
  // For shift jobs, parse actual hours from type like 'Ca sáng (06:00 - 14:00)'
  let hours = 8; // default 8 hours per shift
  const timeMatch = job.type.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
  if (timeMatch) {
    const startH = parseInt(timeMatch[1]);
    const endH = parseInt(timeMatch[3]);
    hours = endH - startH;
    if (hours <= 0) hours += 24; // overnight shift
  }
  
  const totalSalary = hourlyRate * hours;
  
  // Format number with dots: 224400 -> 224.400
  const formatted = totalSalary.toLocaleString('vi-VN').replace(/,/g, '.');
  
  return `${formatted} VNĐ/${hours}h`;
};

// Translate location string based on language
const translateLocation = (locationStr, language) => {
  if (language === 'vi') return locationStr;
  return locationStr
    .replace(/Quận/g, 'District')
    .replace(/TP\.HCM/g, 'HCMC')
    .replace(/Hà Nội/g, 'Hanoi')
    .replace(/Đà Nẵng/g, 'Da Nang')
    .replace(/Tân Bình/g, 'Tan Binh')
    .replace(/Tân Phú/g, 'Tan Phu')
    .replace(/Bình Tân/g, 'Binh Tan')
    .replace(/Bình Thạnh/g, 'Binh Thanh')
    .replace(/Phú Nhuận/g, 'Phu Nhuan')
    .replace(/Gò Vấp/g, 'Go Vap')
    .replace(/Thủ Đức/g, 'Thu Duc')
    .replace(/Toàn/g, 'All');
};

// Translate time indicators
const translateTimePosted = (timeStr, language) => {
  if (language === 'vi') return timeStr;
  return timeStr
    .replace(/(\d+)\s*ngày trước/g, '$1 days ago')
    .replace(/(\d+)\s*giờ trước/g, '$1 hours ago')
    .replace(/(\d+)\s*phút trước/g, '$1 minutes ago')
    .replace(/1\s*days ago/g, '1 day ago')
    .replace(/1\s*hours ago/g, '1 hour ago');
};

// Parse time posted to hours for sorting (newer = smaller number)
const parseTimeToHours = (timeStr) => {
  // Extract number from string
  const match = timeStr.match(/(\d+)/);
  if (!match) return 999999; // Unknown time goes to end

  const num = parseInt(match[1]);

  // Convert to hours
  if (timeStr.includes('giờ') || timeStr.includes('hour')) {
    return num;
  } else if (timeStr.includes('ngày') || timeStr.includes('day')) {
    return num * 24;
  } else if (timeStr.includes('tuần') || timeStr.includes('week')) {
    return num * 24 * 7;
  } else if (timeStr.includes('tháng') || timeStr.includes('month')) {
    return num * 24 * 30;
  }

  return 999999; // Unknown format goes to end
};

// Translate job titles
const translateJobTitle = (titleStr, language) => {
  if (language === 'vi') return titleStr;

  const titleMap = {
    'Quản lý cửa hàng F&B': 'F&B Store Manager',
    'Nhân viên pha chế': 'Barista',
    'Nhân viên phục vụ nhà hàng': 'Restaurant Server',
    'Đầu bếp chính': 'Head Chef',
    'Nhân viên pha chế - Part-time': 'Barista - Part-time',
    'Thu ngân nhà hàng - Part-time': 'Restaurant Cashier - Part-time',
    'Nhân viên phục vụ - Part-time': 'Service Staff - Part-time',
    'Pha chế trà sữa - Part-time': 'Bubble Tea Barista - Part-time',
    'Quản lý bếp': 'Kitchen Manager',
    'Nhân viên chế biến thực phẩm': 'Food Processing Staff',
    'Nhân viên phục vụ bàn': 'Waiter/Waitress',
    'Barista - Full-time': 'Barista - Full-time',
    'Ca Đêm - Nhân viên bếp': 'Night Shift - Kitchen Staff',
    'Ca Sáng - Nhân viên bếp': 'Morning Shift - Kitchen Staff',
    'Ca Chiều - Nhân viên phục vụ': 'Afternoon Shift - Service Staff',
    'Shift Supervisor - Ca đêm': 'Shift Supervisor - Night Shift',
    'Ca Linh Động - Nhân viên giao đồ ăn': 'Flexible Shift - Food Delivery',
    'Ca Sáng - Nhân viên bán hàng': 'Morning Shift - Sales Staff',
    'Ca Chiều - Nhân viên pha chế': 'Afternoon Shift - Barista',
    'Ca Tối - Thu ngân nhà hàng': 'Evening Shift - Restaurant Cashier',
    'Ca Sáng - Phục vụ nhà hàng': 'Morning Shift - Restaurant Server',
    'Ca Linh Động - Giao đồ ăn nhanh': 'Flexible Shift - Fast Food Delivery',
    'Ca Chiều - Nhân viên bếp': 'Afternoon Shift - Kitchen Staff',
    'Ca Tối - Nhân viên Café': 'Evening Shift - Café Staff',
    'Ca Sáng - Phục vụ Quán ăn': 'Morning Shift - Eatery Server',
    'Ca Chiều - Nhân viên bếp nóng': 'Afternoon Shift - Hot Kitchen Staff',
    'Ca Đêm - Giao đồ ăn đêm': 'Night Shift - Night Food Delivery',
    'Ca Sáng - Nhân viên pha chế': 'Morning Shift - Barista',
    'Ca Chiều - Phục vụ Trà sữa': 'Afternoon Shift - Bubble Tea Server',
    'Ca Sáng - Thu ngân quán café': 'Morning Shift - Café Cashier',
    'Ca Tối - Bartender': 'Evening Shift - Bartender',
    'Ca Linh Động - Shipper đồ ăn': 'Flexible Shift - Food Delivery',
    'Ca Chiều - Nhân viên KFC': 'Afternoon Shift - KFC Staff',
    'Ca Sáng - Lễ tân nhà hàng': 'Morning Shift - Restaurant Receptionist',
    'Ca Sáng - Pha chế': 'Morning Shift - Barista',
    'Ca Chiều - Phục vụ nhà hàng': 'Afternoon Shift - Restaurant Server',
    'Ca Tối - Thu ngân quán ăn': 'Evening Shift - Eatery Cashier',
    'Ca Sáng - Nhân viên bếp sáng': 'Morning Shift - Kitchen Staff',
    'Ca Chiều - Barista': 'Afternoon Shift - Barista',
    'Ca Tối - Phục vụ Lẩu': 'Evening Shift - Hot Pot Server',
    'Ca Sáng - Nhân viên McDonald\'s': 'Morning Shift - McDonald\'s Staff',
    'Ca Chiều - Pha chế Phúc Long': 'Afternoon Shift - Phuc Long Barista',
    'Ca Tối - Nhân viên KFC': 'Evening Shift - KFC Staff',
    'Ca Sáng - Phục vụ Jollibee': 'Morning Shift - Jollibee Staff',
    'Ca Chiều - Nhân viên Lotteria': 'Afternoon Shift - Lotteria Staff',
    'Ca Sáng - Pha chế Katinat': 'Morning Shift - Katinat Barista',
    'Ca Chiều - Phục vụ Pizza': 'Afternoon Shift - Pizza Server',
    'Ca Linh Động - Giao đồ ăn': 'Flexible Shift - Food Delivery',
    'Ca Đêm - Nhân viên bếp đêm': 'Night Shift - Kitchen Staff',
    'Ca Sáng - Thu ngân Highlands': 'Morning Shift - Highlands Cashier'
  };

  return titleMap[titleStr] || titleStr;
};

// Translate tags
const translateTag = (tagStr, language) => {
  if (language === 'vi') return tagStr;

  const tagMap = {
    'Kế toán': 'Accounting',
    'Excel': 'Excel',
    'MISA': 'MISA',
    'Kinh doanh': 'Sales',
    'B2B': 'B2B',
    'Hoa hồng cao': 'High Commission',
    'Marketing': 'Marketing',
    'Facebook Ads': 'Facebook Ads',
    'SEO': 'SEO',
    'Nhân sự': 'HR',
    'Hành chính': 'Admin',
    'Office': 'Office',
    'Pha chế': 'Bartending',
    'Part-time': 'Part-time',
    'F&B': 'F&B',
    'Thu ngân': 'Cashier',
    'Bán lẻ': 'Retail',
    'Phục vụ': 'Service',
    'Coffee': 'Coffee',
    'Trà sữa': 'Bubble Tea',
    'Telesales': 'Telesales',
    'Gọi điện': 'Cold Calling',
    'Hoa hồng': 'Commission',
    'Văn phòng': 'Office Work',
    'Word/Excel': 'Word/Excel',
    'Giao tiếp': 'Communication',
    'Giáo viên': 'Teacher',
    'Tiếng Anh': 'English',
    'IELTS': 'IELTS',
    'Lễ tân': 'Receptionist',
    'Khách sạn': 'Hotel',
    'Ca đêm': 'Night Shift',
    'Bảo vệ': 'Security',
    'An ninh': 'Security',
    'Ca sáng': 'Morning Shift',
    'Kho vận': 'Warehouse',
    'Logistics': 'Logistics',
    'Ca chiều': 'Afternoon Shift',
    'Quản lý': 'Management',
    'Linh động': 'Flexible',
    'Giao hàng': 'Delivery',
    'Xe máy': 'Motorbike',
    'Bán hàng': 'Sales',
    'Cửa hàng': 'Store',
    'Nhà hàng': 'Restaurant',
    'Ca tối': 'Evening Shift',
    'Siêu thị': 'Supermarket',
    'Đầu bếp': 'Chef',
    'Bếp': 'Kitchen',
    'Pizza': 'Pizza',
    'Lẩu': 'Hot Pot',
    'Chế biến': 'Processing',
    'Fast food': 'Fast Food',
    'Quán ăn': 'Eatery',
    'Bartender': 'Bartender'
  };

  return tagMap[tagStr] || tagStr;
};

// Translate job type
const translateJobType = (typeStr, language) => {
  if (language === 'vi') return typeStr;

  return typeStr
    .replace(/Ca đêm/g, 'Night Shift')
    .replace(/Ca sáng/g, 'Morning Shift')
    .replace(/Ca chiều/g, 'Afternoon Shift')
    .replace(/Ca tối/g, 'Evening Shift')
    .replace(/Ca linh động/g, 'Flexible Shift')
    .replace(/Part-time/g, 'Part-time')
    .replace(/Full-time/g, 'Full-time');
};

// Jobs data - moved outside component to avoid re-creation on each render
// Helper function to get jobs from localStorage
const getStoredJobs = () => {
  try {
    const storedJobs = localStorage.getItem('employerJobs');
    if (storedJobs) {
      const jobs = JSON.parse(storedJobs);
      // Transform employer jobs to candidate job format
      return jobs.map(job => ({
        id: job.id,
        title: job.title,
        company: job.department || 'Công ty',
        location: job.location,
        lat: 10.7769, // Default HCM location
        lng: 106.7009,
        type: job.jobType === 'full-time' ? 'Full-time' :
          job.jobType === 'part-time' ? 'Part-time' :
            job.jobType === 'contract' ? 'Contract' :
              job.jobType === 'freelance' ? 'Freelance' : 'Full-time',
        category: 'standard',
        salary: job.salaryMin && job.salaryMax
          ? `${job.salaryMin} - ${job.salaryMax}`
          : job.salaryMin
            ? `Từ ${job.salaryMin}`
            : job.salaryMax
              ? `Tối đa ${job.salaryMax}`
              : 'Thỏa thuận',
        postedAt: job.posted || 'Vừa xong',
        tags: [
          job.experienceLevel === 'entry' ? 'Entry Level' :
            job.experienceLevel === 'mid' ? 'Mid Level' :
              job.experienceLevel === 'senior' ? 'Senior' :
                job.experienceLevel === 'lead' ? 'Lead/Manager' : '',
          job.department || ''
        ].filter(Boolean),
        featured: false,
        urgent: false,
        views: job.views || 0
      }));
    }
  } catch (error) {
    console.error('Error loading jobs from localStorage:', error);
  }
  return [];
};

const JOBS_DATA = [
  // Standard Jobs - F&B tại TP.HCM
  {
    id: 1,
    title: 'Nhân viên Phục Vụ Quán Cafe - Part-time',
    company: 'Highlands Coffee',
    location: 'Quận 1, TP.HCM',
    lat: 10.7769,
    lng: 106.7009,
    type: 'Part-time',
    category: 'standard',
    salary: '28.000 VNĐ/giờ',
    postedAt: '2 ngày trước',
    tags: ['Phục vụ', 'F&B', 'Coffee'],
    featured: true,
    urgent: false,
    views: 345
  },
  {
    id: 2,
    title: 'Nhân viên Pha Chế - Part-time',
    company: 'The Coffee House',
    location: 'Quận 7, TP.HCM',
    lat: 10.7333,
    lng: 106.7182,
    type: 'Part-time',
    category: 'standard',
    salary: '25.000 VNĐ/giờ',
    postedAt: '1 ngày trước',
    tags: ['Pha chế', 'F&B', 'Coffee'],
    featured: true,
    urgent: false,
    views: 412
  },
  {
    id: 3,
    title: 'Nhân viên Phục Vụ - Part-time',
    company: 'Golden Gate Group',
    location: 'Quận 3, TP.HCM',
    lat: 10.7866,
    lng: 106.6906,
    type: 'Part-time',
    category: 'standard',
    salary: '25.000 VNĐ/giờ',
    postedAt: '3 ngày trước',
    tags: ['Phục vụ', 'Nhà hàng', 'F&B'],
    featured: false,
    urgent: false,
    views: 289
  },
  {
    id: 4,
    title: 'Phụ bếp nhà hàng - Part-time',
    company: 'Pizza 4P\'s',
    location: 'Quận 2, TP.HCM',
    lat: 10.7825,
    lng: 106.7500,
    type: 'Part-time',
    category: 'standard',
    salary: '30.000 VNĐ/giờ',
    postedAt: '2 ngày trước',
    tags: ['Phụ bếp', 'Nhà hàng', 'Pizza'],
    featured: true,
    urgent: false,
    views: 521
  },
  {
    id: 5,
    title: 'Nhân viên Pha Chế - Part-time',
    company: 'Phúc Long Coffee & Tea',
    location: 'Quận 1, TP.HCM',
    lat: 10.7756,
    lng: 106.7004,
    type: 'Full-time',
    category: 'standard',
    salary: '6 triệu VND',
    postedAt: '1 ngày trước',
    tags: ['Pha chế', 'Full-time', 'F&B'],
    featured: false,
    urgent: false,
    views: 334
  },
  {
    id: 12,
    title: 'Nhân viên Thu Ngân Nhà Hàng - Part-time',
    company: 'Lẩu Phan',
    location: 'Quận 7, TP.HCM',
    lat: 10.7295,
    lng: 106.7195,
    type: 'Part-time',
    category: 'standard',
    salary: '24.000 VNĐ/giờ',
    postedAt: '3 ngày trước',
    tags: ['Thu ngân', 'Part-time', 'Nhà hàng'],
    featured: false,
    urgent: false,
    views: 189
  },
  {
    id: 13,
    title: 'Nhân viên Phục Vụ - Part-time',
    company: 'Starbucks Vietnam',
    location: 'Bình Thạnh, TP.HCM',
    lat: 10.8065,
    lng: 106.7147,
    type: 'Part-time',
    category: 'standard',
    salary: '23.000 VNĐ/giờ',
    postedAt: '1 ngày trước',
    tags: ['Phục vụ', 'Part-time', 'Coffee'],
    featured: false,
    urgent: false,
    views: 267
  },
  {
    id: 14,
    title: 'Nhân viên Pha Chế Trà Sữa - Part-time',
    company: 'TocoToco',
    location: 'Tân Bình, TP.HCM',
    lat: 10.7985,
    lng: 106.6635,
    type: 'Part-time',
    category: 'standard',
    salary: '22.000 VNĐ/giờ',
    postedAt: '4 ngày trước',
    tags: ['Pha chế', 'Part-time', 'Trà sữa'],
    featured: false,
    urgent: false,
    views: 198
  },
  {
    id: 6,
    title: 'Nhân viên phụ bếp',
    company: 'Wrap & Roll',
    location: 'Bình Thạnh, TP.HCM',
    lat: 10.8100,
    lng: 106.7089,
    type: 'Part-time',
    category: 'standard',
    salary: '27.000 VNĐ/giờ',
    postedAt: '4 ngày trước',
    tags: ['Phụ bếp', 'Nhà hàng', 'F&B'],
    featured: true,
    urgent: false,
    views: 278
  },
  {
    id: 15,
    title: 'Nhân viên Thu Ngân Cửa Hàng - Part-time',
    company: 'Jollibee Vietnam',
    location: 'Quận 10, TP.HCM',
    lat: 10.7735,
    lng: 106.6676,
    type: 'Part-time',
    category: 'standard',
    salary: '24.000 VNĐ/giờ',
    postedAt: '2 ngày trước',
    tags: ['Thu ngân', 'Fast food', 'F&B'],
    featured: false,
    urgent: false,
    views: 312
  },
  {
    id: 16,
    title: 'Nhân viên bưng bê - Part-time',
    company: 'Haidilao Việt Nam',
    location: 'Quận 1, TP.HCM',
    lat: 10.7801,
    lng: 106.7002,
    type: 'Part-time',
    category: 'standard',
    salary: '28.000 VNĐ/giờ',
    postedAt: '1 ngày trước',
    tags: ['Phục vụ', 'Nhà hàng', 'Lẩu'],
    featured: false,
    urgent: false,
    views: 356
  },
  {
    id: 17,
    title: 'Barista - Part-time',
    company: 'Katinat chi nhánh quận 8',
    location: 'Quận 3, TP.HCM',
    lat: 10.7830,
    lng: 106.6920,
    type: 'Part-time',
    category: 'standard',
    salary: '27.000 VNĐ/giờ',
    postedAt: '3 ngày trước',
    tags: ['Pha chế', 'Coffee', 'F&B'],
    featured: false,
    urgent: false,
    views: 289
  },
  // Shift Jobs - F&B Tuyển gấp
  {
    id: 7,
    title: 'Ca Đêm - Nhân viên bếp',
    company: 'Bánh Mì Huynh Hoa',
    location: 'Quận 1, TP.HCM',
    lat: 10.7730,
    lng: 106.6985,
    type: 'Ca đêm (22:00 - 06:00)',
    category: 'shift',
    salary: '30.000 VNĐ/giờ',
    postedAt: '1 ngày trước',
    tags: ['Ca đêm', 'Bếp', 'F&B'],
    featured: false,
    urgent: true,
    views: 156
  },
  {
    id: 8,
    title: 'Ca Sáng - Nhân viên bếp',
    company: 'McDonald\'s Việt Nam',
    location: 'Tân Bình, TP.HCM',
    lat: 10.7750,
    lng: 106.7000,
    type: 'Ca sáng (06:00 - 14:00)',
    category: 'shift',
    salary: '28.500 VNĐ/giờ',
    postedAt: '2 ngày trước',
    tags: ['Ca sáng', 'Fast food', 'F&B'],
    featured: true,
    urgent: true,
    views: 234
  },
  {
    id: 9,
    title: 'Ca Chiều - Nhân viên Phục Vụ',
    company: 'Highlands Coffee',
    location: 'Phú Nhuận, TP.HCM',
    lat: 10.7700,
    lng: 106.6970,
    type: 'Ca chiều (14:00 - 22:00)',
    category: 'shift',
    salary: '29.500 VNĐ/giờ',
    postedAt: '1 ngày trước',
    tags: ['Ca chiều', 'F&B', 'Phục vụ'],
    featured: false,
    urgent: true,
    views: 198
  },
  {
    id: 10,
    title: 'Shift Supervisor - Ca đêm',
    company: 'Cơm Tấm Phúc Lộc Thọ',
    location: 'Quận 7, TP.HCM',
    lat: 10.7690,
    lng: 106.6990,
    type: 'Ca đêm (20:00 - 04:00)',
    category: 'shift',
    salary: '32.000 VNĐ/giờ',
    postedAt: '3 ngày trước',
    tags: ['Ca đêm', 'Quản lý', 'F&B'],
    featured: true,
    urgent: true,
    views: 312
  },
  {
    id: 11,
    title: 'Ca Sáng - Nhân viên Phục Vụ',
    company: 'Cơm Tấm Bụi Sài Gòn',
    location: 'Quận 3, TP.HCM',
    lat: 10.7740,
    lng: 106.6995,
    type: 'Ca sáng (06:00 - 14:00)',
    category: 'shift',
    salary: '28.050 VNĐ/giờ',
    postedAt: '1 ngày trước',
    tags: ['Ca sáng', 'Phục vụ', 'F&B'],
    featured: false,
    urgent: true,
    views: 445
  },
  {
    id: 18,
    title: 'Ca Sáng - Nhân viên bán hàng',
    company: 'Phúc Long Coffee & Tea',
    location: 'Quận 1, TP.HCM',
    lat: 10.7715,
    lng: 106.6975,
    type: 'Ca sáng (06:00 - 14:00)',
    category: 'shift',
    salary: '29.000 VNĐ/giờ',
    postedAt: '1 ngày trước',
    tags: ['Ca sáng', 'Bán hàng', 'Coffee'],
    featured: false,
    urgent: true,
    views: 167
  },
  {
    id: 19,
    title: 'Ca Chiều - Nhân viên Pha Chế',
    company: 'The Coffee House',
    location: 'Quận 1, TP.HCM',
    lat: 10.7735,
    lng: 106.7005,
    type: 'Ca chiều (14:00 - 22:00)',
    category: 'shift',
    salary: '30.500 VNĐ/giờ',
    postedAt: '2 giờ trước',
    tags: ['Ca chiều', 'Pha chế', 'F&B'],
    featured: true,
    urgent: true,
    views: 223
  },
  {
    id: 20,
    title: 'Ca Tối - Nhân viên Thu Ngân Nhà Hàng',
    company: 'Lotteria chi nhánh quận 1',
    location: 'Quận 3, TP.HCM',
    lat: 10.7760,
    lng: 106.6960,
    type: 'Ca tối (18:00 - 22:00)',
    category: 'shift',
    salary: '28.800 VNĐ/giờ',
    postedAt: '3 giờ trước',
    tags: ['Ca tối', 'Thu ngân', 'Fast food'],
    featured: false,
    urgent: true,
    views: 189
  },
  {
    id: 21,
    title: 'Ca Sáng - Nhân viên Phục Vụ Nhà Hàng',
    company: 'KFC Việt Nam',
    location: 'Quận 1, TP.HCM',
    lat: 10.7710,
    lng: 106.6965,
    type: 'Ca sáng (07:00 - 15:00)',
    category: 'shift',
    salary: '28.200 VNĐ/giờ',
    postedAt: '5 giờ trước',
    tags: ['Ca sáng', 'Phục vụ', 'Fast food'],
    featured: false,
    urgent: true,
    views: 201
  },
  {
    id: 22,
    title: 'Ca Chiều - Nhân viên bếp',
    company: 'Bánh Mì Hòa Mã',
    location: 'Quận 1, TP.HCM',
    lat: 10.7745,
    lng: 106.6955,
    type: 'Ca chiều (14:00 - 22:00)',
    category: 'shift',
    salary: '30.000 VNĐ/giờ',
    postedAt: '1 ngày trước',
    tags: ['Ca chiều', 'Bếp', 'F&B'],
    featured: false,
    urgent: true,
    views: 356
  },
  {
    id: 23,
    title: 'Ca Chiều - Nhân viên bếp',
    company: 'Gong Cha Vietnam',
    location: 'Quận 5, TP.HCM',
    lat: 10.7720,
    lng: 106.7010,
    type: 'Ca chiều (14:00 - 22:00)',
    category: 'shift',
    salary: '28.350 VNĐ/giờ',
    postedAt: '4 giờ trước',
    tags: ['Ca chiều', 'Pha chế', 'Trà sữa'],
    featured: false,
    urgent: true,
    views: 234
  },
  {
    id: 24,
    title: 'Ca Tối - Nhân viên Café',
    company: 'Katinat chi nhánh quận 8',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8520,
    lng: 106.8360,
    type: 'Ca tối (18:00 - 23:00)',
    category: 'shift',
    salary: '31.000 VNĐ/giờ',
    postedAt: '3 giờ trước',
    tags: ['Ca tối', 'F&B', 'Pha chế'],
    featured: false,
    urgent: true,
    views: 178
  },
  {
    id: 25,
    title: 'Ca Sáng - Nhân viên Phục Vụ Quán Ăn',
    company: 'Cơm Tấm Bụi Sài Gòn',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8490,
    lng: 106.8380,
    type: 'Ca sáng (06:00 - 12:00)',
    category: 'shift',
    salary: '28.500 VNĐ/giờ',
    postedAt: '5 giờ trước',
    tags: ['Ca sáng', 'Phục vụ', 'Quán ăn'],
    featured: false,
    urgent: true,
    views: 145
  },
  {
    id: 26,
    title: 'Ca Chiều - Nhân viên bếp nóng',
    company: 'Pizza Hut Việt Nam',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8530,
    lng: 106.8350,
    type: 'Ca chiều (14:00 - 22:00)',
    category: 'shift',
    salary: '30.000 VNĐ/giờ',
    postedAt: '1 ngày trước',
    tags: ['Ca chiều', 'Bếp', 'Pizza'],
    featured: true,
    urgent: true,
    views: 267
  },
  {
    id: 27,
    title: 'Ca Đêm - Nhân viên Phục Vụ',
    company: 'Quán Ốc Đào - Thủ Đức',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8480,
    lng: 106.8390,
    type: 'Ca đêm (20:00 - 02:00)',
    category: 'shift',
    salary: '30.000 VNĐ/giờ',
    postedAt: '6 giờ trước',
    tags: ['Ca đêm', 'Phục vụ', 'F&B'],
    featured: false,
    urgent: true,
    views: 198
  },
  {
    id: 28,
    title: 'Ca Sáng - Nhân viên Pha Chế',
    company: 'Starbucks Vietnam',
    location: 'Quận 2, TP.HCM',
    lat: 10.8510,
    lng: 106.8340,
    type: 'Ca sáng (07:00 - 15:00)',
    category: 'shift',
    salary: '31.500 VNĐ/giờ',
    postedAt: '2 ngày trước',
    tags: ['Ca sáng', 'Pha chế', 'Coffee'],
    featured: false,
    urgent: true,
    views: 223
  },
  {
    id: 29,
    title: 'Ca Chiều - Nhân viên Phục Vụ Trà Sữa',
    company: 'Koi Thé - Thủ Đức',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8500,
    lng: 106.8370,
    type: 'Ca chiều (14:00 - 22:00)',
    category: 'shift',
    salary: '28.800 VNĐ/giờ',
    postedAt: '4 giờ trước',
    tags: ['Ca chiều', 'Phục vụ', 'Trà sữa'],
    featured: false,
    urgent: true,
    views: 187
  },
  {
    id: 30,
    title: 'Ca Sáng - Nhân viên Thu Ngân Quán Café',
    company: 'Passio Coffee',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8540,
    lng: 106.8330,
    type: 'Ca sáng (06:00 - 14:00)',
    category: 'shift',
    salary: '28.050 VNĐ/giờ',
    postedAt: '2 giờ trước',
    tags: ['Ca sáng', 'Thu ngân', 'Coffee'],
    featured: true,
    urgent: true,
    views: 234
  },
  {
    id: 31,
    title: 'Ca Tối - Bartender',
    company: 'Pub & Beer Garden',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8470,
    lng: 106.8400,
    type: 'Ca tối (18:00 - 01:00)',
    category: 'shift',
    salary: '32.000 VNĐ/giờ',
    postedAt: '5 giờ trước',
    tags: ['Ca tối', 'Bartender', 'Pha chế'],
    featured: false,
    urgent: true,
    views: 156
  },
  {
    id: 32,
    title: 'Ca Tối - Nhân viên Pha Chế',
    company: 'Trà Sữa Bobapop - Thủ Đức',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8495,
    lng: 106.8385,
    type: 'Ca tối (18:00 - 23:00)',
    category: 'shift',
    salary: '32.000 VNĐ/giờ',
    postedAt: '1 ngày trước',
    tags: ['Ca tối', 'Pha chế', 'Trà sữa'],
    featured: true,
    urgent: true,
    views: 412
  },
  {
    id: 33,
    title: 'Ca Chiều - Nhân viên KFC',
    company: 'KFC - Đại học Quốc gia',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8515,
    lng: 106.8365,
    type: 'Ca chiều (15:00 - 23:00)',
    category: 'shift',
    salary: '28.700 VNĐ/giờ',
    postedAt: '3 giờ trước',
    tags: ['Ca chiều', 'Fast food', 'Phục vụ'],
    featured: false,
    urgent: true,
    views: 289
  },
  {
    id: 34,
    title: 'Ca Sáng - Lễ tân nhà hàng',
    company: 'Golden Gate - Thủ Đức',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8485,
    lng: 106.8355,
    type: 'Ca sáng (08:00 - 16:00)',
    category: 'shift',
    salary: '29.800 VNĐ/giờ',
    postedAt: '1 ngày trước',
    tags: ['Ca sáng', 'Lễ tân', 'Nhà hàng'],
    featured: false,
    urgent: true,
    views: 167
  },
  // Thêm shift jobs trải rộng khắp TP.HCM
  {
    id: 35,
    title: 'Ca Sáng - Nhân viên Pha Chế',
    company: 'Highlands Coffee - Q1',
    location: 'Quận 1, TP.HCM',
    lat: 10.7756,
    lng: 106.7004,
    type: 'Ca sáng (06:00 - 14:00)',
    category: 'shift',
    salary: '30.000 VNĐ/giờ',
    postedAt: '1 giờ trước',
    tags: ['Ca sáng', 'Pha chế', 'Coffee'],
    featured: true,
    urgent: true,
    views: 312
  },
  {
    id: 36,
    title: 'Ca Chiều - Nhân viên Phục Vụ Nhà Hàng',
    company: 'Golden Gate - Q3',
    location: 'Quận 3, TP.HCM',
    lat: 10.7834,
    lng: 106.6876,
    type: 'Ca chiều (14:00 - 22:00)',
    category: 'shift',
    salary: '29.200 VNĐ/giờ',
    postedAt: '2 giờ trước',
    tags: ['Ca chiều', 'Phục vụ', 'Nhà hàng'],
    featured: false,
    urgent: true,
    views: 198
  },
  {
    id: 37,
    title: 'Ca Tối - Nhân viên Thu Ngân Quán Ăn',
    company: 'Cơm Tấm Bụi - Q4',
    location: 'Quận 4, TP.HCM',
    lat: 10.7579,
    lng: 106.7065,
    type: 'Ca tối (17:00 - 23:00)',
    category: 'shift',
    salary: '28.300 VNĐ/giờ',
    postedAt: '3 giờ trước',
    tags: ['Ca tối', 'Thu ngân', 'F&B'],
    featured: false,
    urgent: true,
    views: 145
  },
  {
    id: 38,
    title: 'Ca Sáng - Nhân viên bếp',
    company: 'Phở 24 - Q5',
    location: 'Quận 5, TP.HCM',
    lat: 10.7539,
    lng: 106.6633,
    type: 'Ca sáng (06:00 - 14:00)',
    category: 'shift',
    salary: '29.500 VNĐ/giờ',
    postedAt: '2 giờ trước',
    tags: ['Ca sáng', 'Bếp', 'F&B'],
    featured: false,
    urgent: true,
    views: 176
  },
  {
    id: 39,
    title: 'Ca Chiều - Barista',
    company: 'The Coffee House - Q7',
    location: 'Quận 7, TP.HCM',
    lat: 10.7350,
    lng: 106.7220,
    type: 'Ca chiều (14:00 - 22:00)',
    category: 'shift',
    salary: '29.200 VNĐ/giờ',
    postedAt: '1 giờ trước',
    tags: ['Ca chiều', 'Pha chế', 'Coffee'],
    featured: true,
    urgent: true,
    views: 287
  },
  {
    id: 40,
    title: 'Ca Tối - Nhân viên Phục Vụ Lẩu',
    company: 'Haidilao - Bình Thạnh',
    location: 'Bình Thạnh, TP.HCM',
    lat: 10.8050,
    lng: 106.7100,
    type: 'Ca tối (17:00 - 23:00)',
    category: 'shift',
    salary: '33.000 VNĐ/giờ',
    postedAt: '30 phút trước',
    tags: ['Ca tối', 'Phục vụ', 'Lẩu'],
    featured: false,
    urgent: true,
    views: 234
  },
  {
    id: 41,
    title: 'Ca Sáng - Nhân viên McDonald\'s',
    company: 'McDonald\'s - Tân Bình',
    location: 'Tân Bình, TP.HCM',
    lat: 10.8017,
    lng: 106.6528,
    type: 'Ca sáng (07:00 - 15:00)',
    category: 'shift',
    salary: '28.600 VNĐ/giờ',
    postedAt: '1 giờ trước',
    tags: ['Ca sáng', 'Fast food', 'F&B'],
    featured: false,
    urgent: true,
    views: 198
  },
  {
    id: 42,
    title: 'Ca Chiều - Nhân viên Pha Chế Phúc Long',
    company: 'Phúc Long - Phú Nhuận',
    location: 'Phú Nhuận, TP.HCM',
    lat: 10.7992,
    lng: 106.6780,
    type: 'Ca chiều (14:00 - 22:00)',
    category: 'shift',
    salary: '30.200 VNĐ/giờ',
    postedAt: '2 giờ trước',
    tags: ['Ca chiều', 'Pha chế', 'Coffee'],
    featured: false,
    urgent: true,
    views: 223
  },
  {
    id: 43,
    title: 'Ca Tối - Nhân viên KFC',
    company: 'KFC - Gò Vấp',
    location: 'Gò Vấp, TP.HCM',
    lat: 10.8385,
    lng: 106.6497,
    type: 'Ca tối (17:00 - 23:00)',
    category: 'shift',
    salary: '28.900 VNĐ/giờ',
    postedAt: '3 giờ trước',
    tags: ['Ca tối', 'Fast food', 'F&B'],
    featured: false,
    urgent: true,
    views: 167
  },
  {
    id: 44,
    title: 'Ca Sáng - Nhân viên Phục Vụ Jollibee',
    company: 'Jollibee - Tân Phú',
    location: 'Tân Phú, TP.HCM',
    lat: 10.7918,
    lng: 106.6280,
    type: 'Ca sáng (07:00 - 15:00)',
    category: 'shift',
    salary: '28.050 VNĐ/giờ',
    postedAt: '1 giờ trước',
    tags: ['Ca sáng', 'Fast food', 'Phục vụ'],
    featured: false,
    urgent: true,
    views: 189
  },
  {
    id: 45,
    title: 'Ca Chiều - Nhân viên Lotteria',
    company: 'Lotteria - Bình Tân',
    location: 'Bình Tân, TP.HCM',
    lat: 10.7654,
    lng: 106.6042,
    type: 'Ca chiều (14:00 - 22:00)',
    category: 'shift',
    salary: '28.100 VNĐ/giờ',
    postedAt: '4 giờ trước',
    tags: ['Ca chiều', 'Fast food', 'F&B'],
    featured: false,
    urgent: true,
    views: 156
  },
  {
    id: 46,
    title: 'Ca Tối - Bartender',
    company: 'Quán Bar Bùi Viện',
    location: 'Quận 1, TP.HCM',
    lat: 10.7680,
    lng: 106.6935,
    type: 'Ca tối (19:00 - 02:00)',
    category: 'shift',
    salary: '35.000 VNĐ/giờ',
    postedAt: '1 giờ trước',
    tags: ['Ca tối', 'Bartender', 'Pha chế'],
    featured: true,
    urgent: true,
    views: 345
  },
  {
    id: 47,
    title: 'Ca Sáng - Nhân viên Pha Chế Katinat',
    company: 'Katinat - Quận 2',
    location: 'Quận 2, TP.HCM',
    lat: 10.7870,
    lng: 106.7500,
    type: 'Ca sáng (07:00 - 15:00)',
    category: 'shift',
    salary: '29.500 VNĐ/giờ',
    postedAt: '2 giờ trước',
    tags: ['Ca sáng', 'Pha chế', 'Coffee'],
    featured: false,
    urgent: true,
    views: 201
  },
  {
    id: 48,
    title: 'Ca Chiều - Nhân viên Phục Vụ Pizza',
    company: 'Pizza 4P\'s - Q10',
    location: 'Quận 10, TP.HCM',
    lat: 10.7735,
    lng: 106.6676,
    type: 'Ca chiều (14:00 - 22:00)',
    category: 'shift',
    salary: '31.000 VNĐ/giờ',
    postedAt: '3 giờ trước',
    tags: ['Ca chiều', 'Phục vụ', 'Pizza'],
    featured: false,
    urgent: true,
    views: 212
  },
  {
    id: 49,
    title: 'Ca Sáng - Nhân viên Thu Ngân',
    company: 'Lẩu Dê Ninh Bình - Q12',
    location: 'Quận 12, TP.HCM',
    lat: 10.8671,
    lng: 106.6413,
    type: 'Ca sáng (07:00 - 15:00)',
    category: 'shift',
    salary: '28.400 VNĐ/giờ',
    postedAt: '30 phút trước',
    tags: ['Ca sáng', 'Thu ngân', 'F&B'],
    featured: false,
    urgent: true,
    views: 278
  },
  {
    id: 50,
    title: 'Ca Đêm - Nhân viên bếp',
    company: 'Bún Bò Huế 3A3 - Q6',
    location: 'Quận 6, TP.HCM',
    lat: 10.7478,
    lng: 106.6350,
    type: 'Ca đêm (20:00 - 04:00)',
    category: 'shift',
    salary: '32.000 VNĐ/giờ',
    postedAt: '2 giờ trước',
    tags: ['Ca đêm', 'Bếp', 'F&B'],
    featured: false,
    urgent: true,
    views: 134
  },
  {
    id: 51,
    title: 'Ca Sáng - Nhân viên Thu Ngân Highlands',
    company: 'Highlands Coffee - Q8',
    location: 'Quận 8, TP.HCM',
    lat: 10.7380,
    lng: 106.6630,
    type: 'Ca sáng (06:00 - 14:00)',
    category: 'shift',
    salary: '28.250 VNĐ/giờ',
    postedAt: '1 giờ trước',
    tags: ['Ca sáng', 'Thu ngân', 'Coffee'],
    featured: false,
    urgent: true,
    views: 156
  }
];

const JobListing = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const resultsRef = useRef(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [jobCategory, setJobCategory] = useState('standard'); // 'standard' or 'shift'

  // Merge stored jobs with default jobs data
  const allJobs = useMemo(() => {
    const storedJobs = getStoredJobs();
    return [...storedJobs, ...JOBS_DATA];
  }, []); // Re-calculate when component mounts

  const [quickFilter, setQuickFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list');
  const [expandedFilters, setExpandedFilters] = useState({
    jobType: true,
    salary: true,
    company: true
  });

  // Filter states
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  // Location-based states
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showNearbyJobs, setShowNearbyJobs] = useState(false);
  const [nearbyRadius, setNearbyRadius] = useState(3); // km
  const [showSavedJobsOnly, setShowSavedJobsOnly] = useState(false);

  // Job search status states
  const [isAvailable, setIsAvailable] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [applyModal, setApplyModal] = useState(null); // { job } or null
  const [detailModal, setDetailModal] = useState(null); // { job } or null
  const [applySuccess, setApplySuccess] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const banners = [
    { src: "/OpPoReview/images/seoul.jpg", alt: "Seoul Vua Mì Cay" },
    { src: "/OpPoReview/images/bamosbanner.jpg", alt: "Bamos Coffee" },
    { src: "/OpPoReview/images/lebanner.jpg", alt: "Le Banner" }
  ];

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(bannerInterval);
  }, [banners.length]);

  const handleToggleAvailability = () => {
    setShowConfirmModal(true);
  };

  const confirmToggle = () => {
    setIsAvailable(!isAvailable);
    setShowConfirmModal(false);
  };

  // Check if we're on saved jobs page
  useEffect(() => {
    // Removed - no longer using separate route for saved jobs
  }, [location.pathname]);

  // Load saved jobs from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(saved.map(job => job.id));
  }, []);

  // Handle search from Navbar
  useEffect(() => {
    if (location.state?.searchKeyword) {
      setSearchKeyword(location.state.searchKeyword);
    }
  }, [location.state]);

  // Scroll to results function
  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Auto scroll to results when searching
  useEffect(() => {
    if (searchKeyword || selectedLocation) {
      const timer = setTimeout(() => {
        scrollToResults();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [searchKeyword, selectedLocation]);

  // Auto scroll when filters change
  useEffect(() => {
    if (selectedJobTypes.length > 0 ||
      selectedSalaryRanges.length > 0 || selectedCompanies.length > 0) {
      scrollToResults();
    }
  }, [selectedJobTypes, selectedSalaryRanges, selectedCompanies]);

  // Reset nearby jobs when switching from shift to standard category
  useEffect(() => {
    if (jobCategory === 'standard') {
      setShowNearbyJobs(false);
    }
  }, [jobCategory]);

  // Get user's current location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoadingLocation(false);
          setShowNearbyJobs(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to a default location in Ho Chi Minh City (Ben Thanh Market)
          setUserLocation({
            lat: 10.7723,
            lng: 106.6981
          });
          setIsLoadingLocation(false);
          setShowNearbyJobs(true);
        }
      );
    } else {
      // Browser doesn't support geolocation, use default location
      setUserLocation({
        lat: 10.7723,
        lng: 106.6981
      });
      setIsLoadingLocation(false);
      setShowNearbyJobs(true);
    }
  };

  const handleSaveJob = (jobId, e) => {
    e?.stopPropagation();

    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;

    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const isAlreadySaved = saved.some(j => j.id === jobId);

    let updated;
    if (isAlreadySaved) {
      updated = saved.filter(j => j.id !== jobId);
    } else {
      updated = [...saved, job];
    }

    localStorage.setItem('savedJobs', JSON.stringify(updated));

    setSavedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleJobClick = (jobId) => {
    const job = allJobs.find(j => j.id === jobId);
    if (job) setDetailModal({ job });
  };

  const handleApplyJob = (job) => {
    if (job) setApplyModal({ job });
  };

  const confirmApply = () => {
    setApplyModal(null);
    setApplySuccess(true);
    setTimeout(() => setApplySuccess(false), 3000);
  };

  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Toggle filter handlers
  const toggleJobType = (type) => {
    setSelectedJobTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleSalaryRange = (range) => {
    setSelectedSalaryRanges(prev =>
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const toggleCompany = (company) => {
    setSelectedCompanies(prev =>
      prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
    );
  };

  const clearAllFilters = () => {
    setSearchKeyword('');
    setSelectedLocation('');
    setSelectedJobTypes([]);
    setSelectedSalaryRanges([]);
    setSelectedCompanies([]);
    setQuickFilter('all');
  };

  // Helper functions for filtering
  const getSalaryValue = (salaryStr) => {
    const match = salaryStr.match(/(\d+)/);
    return match ? parseInt(match[0]) : 0;
  };

  const isInSalaryRange = (salary, range) => {
    const value = getSalaryValue(salary);

    if (jobCategory === 'standard') {
      const isHourly = salary.toLowerCase().includes('giờ') || salary.toLowerCase().includes('hour');
      switch (range) {
        case 'hourly': return isHourly;
        case 'under-10m': return !isHourly && value < 5;
        case '10m-20m': return !isHourly && value >= 5 && value <= 10;
        case 'over-20m': return !isHourly && value > 10;
        default: return true;
      }
    } else {
      switch (range) {
        case '26-30k': return value >= 26 && value < 30;
        case '30-35k': return value >= 30 && value <= 35;
        case '35k+': return value > 35;
        default: return true;
      }
    }
  };

  // Get nearby jobs
  const nearbyJobs = useMemo(() => {
    if (!userLocation) return [];

    return allJobs
      .filter(job => job.category === jobCategory)
      .map(job => ({
        ...job,
        distance: calculateDistance(userLocation.lat, userLocation.lng, job.lat, job.lng)
      }))
      .filter(job => job.distance <= nearbyRadius)
      .sort((a, b) => a.distance - b.distance);
  }, [userLocation, jobCategory, nearbyRadius, allJobs]);

  // Advanced filtering with useMemo for performance
  const filteredJobs = useMemo(() => {
    let result = allJobs;

    // Filter by saved jobs only
    if (showSavedJobsOnly) {
      result = result.filter(job => savedJobs.includes(job.id));
      // Don't apply category filter for saved jobs
    } else {
      // For shift jobs
      if (jobCategory === 'shift') {
        if (showNearbyJobs) {
          // Location enabled: only show jobs within radius (strict ≤3km)
          return nearbyJobs;
        }
        // Location not enabled: show all shift jobs for browsing
        result = result.filter(job => job.category === 'shift');
      } else {
        result = result.filter(job => job.category === jobCategory);
      }
    }

    // Add distance if user location is available
    if (userLocation) {
      result = result.map(job => ({
        ...job,
        distance: calculateDistance(userLocation.lat, userLocation.lng, job.lat, job.lng)
      }));
    }

    // Search by keyword
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim();
      result = result.filter(job => {
        const locationParts = job.location.toLowerCase().split(',').map(part => part.trim());
        const locationMatch = locationParts.some(part =>
          part === keyword || part.startsWith(keyword + ' ') || part.includes(keyword)
        );
        return (
          job.title.toLowerCase().includes(keyword) ||
          job.company.toLowerCase().includes(keyword) ||
          job.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
          locationMatch
        );
      });
    }

    // Filter by location
    if (selectedLocation.trim()) {
      const location = selectedLocation.toLowerCase().trim();
      result = result.filter(job => {
        const locationParts = job.location.toLowerCase().split(',').map(part => part.trim());
        // Exact match or starts with search term followed by space
        return locationParts.some(part => {
          return part === location || part.startsWith(location + ' ');
        });
      });
    }

    // Filter by job type
    if (selectedJobTypes.length > 0) {
      result = result.filter(job =>
        selectedJobTypes.some(type => job.type.toLowerCase().includes(type.toLowerCase()))
      );
    }

    // Filter by salary range
    if (selectedSalaryRanges.length > 0) {
      result = result.filter(job =>
        selectedSalaryRanges.some(range => isInSalaryRange(job.salary, range))
      );
    }

    // Filter by company
    if (selectedCompanies.length > 0) {
      result = result.filter(job =>
        selectedCompanies.includes(job.company)
      );
    }

    // Quick filters
    if (quickFilter === 'urgent') result = result.filter(job => job.urgent);
    if (quickFilter === 'featured') result = result.filter(job => job.featured);
    if (quickFilter === 'saved') result = result.filter(job => savedJobs.includes(job.id));

    // Sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'salary':
          return getSalaryValue(b.salary) - getSalaryValue(a.salary);
        case 'views':
          return b.views - a.views;
        case 'newest':
          // Sort by posted time (newer jobs first - smaller hours value = more recent)
          return parseTimeToHours(a.postedAt) - parseTimeToHours(b.postedAt);
        case 'relevant':
        default:
          return 0;
      }
    });

    return result;
  }, [jobCategory, searchKeyword, selectedLocation, selectedJobTypes,
    selectedSalaryRanges, selectedCompanies,
    quickFilter, savedJobs, sortBy, userLocation, showNearbyJobs, nearbyJobs, allJobs, showSavedJobsOnly]);

  const categoryJobs = allJobs.filter(job => job.category === jobCategory);

  return (
    <DashboardLayout role="candidate" key={language}>
      <Container>
        {/* Hero Search Section */}
        <HeroSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeroContent>
            <HeroTitle>
              {showSavedJobsOnly
                ? (language === 'vi' ? 'Công việc đã lưu' : 'Saved Jobs')
                : jobCategory === 'standard'
                  ? (language === 'vi' ? 'Tìm công việc mơ ước của bạn ' : 'Find Your Dream Job ')
                  : (language === 'vi' ? 'Công việc Tuyển gấp ' : 'Shift Jobs - Hiring Now ')}
            </HeroTitle>
            <HeroSubtitle>
              {showSavedJobsOnly
                ? (language === 'vi'
                  ? `Bạn đang theo dõi ${filteredJobs.length} công việc đã lưu`
                  : `You are tracking ${filteredJobs.length} saved jobs`)
                : jobCategory === 'standard'
                  ? (language === 'vi'
                    ? `Hơn ${allJobs.filter(j => j.category === 'standard').length} công việc tiêu chuẩn đang chờ bạn khám phá`
                    : `Over ${allJobs.filter(j => j.category === 'standard').length} standard jobs waiting for you to explore`)
                  : (language === 'vi'
                    ? `${allJobs.filter(j => j.category === 'shift').length} công việc theo ca đang tuyển gấp, làm ngay hôm nay!`
                    : `${allJobs.filter(j => j.category === 'shift').length} shift jobs hiring urgently, start today!`)}
            </HeroSubtitle>

            <SearchContainer>
              <SearchInput>
                <Search />
                <input
                  type="text"
                  placeholder={language === 'vi' ? 'Tìm theo vị trí, công ty, kỹ năng...' : 'Search by position, company, skills...'}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      scrollToResults();
                    }
                  }}
                />
              </SearchInput>

              <SearchInput $narrow>
                <MapPin />
                <input
                  type="text"
                  placeholder={language === 'vi' ? 'Địa điểm' : 'Location'}
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      scrollToResults();
                    }
                  }}
                />
              </SearchInput>

              <SearchButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToResults}
              >
                <Search />
                {language === 'vi' ? 'Tìm kiếm' : 'Search'}
              </SearchButton>
            </SearchContainer>

            {/* Location-based search & Job Status - Only for shift jobs, not saved jobs */}
            {jobCategory === 'shift' && !showSavedJobsOnly && (
              <motion.div
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Job Search Status Toggle */}
                {!showSavedJobsOnly && (
                  <StatusCard
                    $active={isAvailable}
                    as={motion.div}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="status-content">
                      <div className="status-info">
                        <div className="status-badge">
                          {isAvailable ? <CheckCircle /> : <XCircle />}
                          {isAvailable
                            ? (language === 'vi' ? 'Trạng thái tìm việc đang bật' : 'Job Search Active')
                            : (language === 'vi' ? 'Trạng thái tìm việc đang tắt' : 'Job Search Paused')}
                        </div>
                      </div>
                      <ToggleButton
                        onClick={handleToggleAvailability}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Power />
                        {isAvailable
                          ? (language === 'vi' ? 'Tắt' : 'Pause')
                          : (language === 'vi' ? 'Bật' : 'Activate')}
                      </ToggleButton>
                    </div>
                  </StatusCard>
                )}

                {/* Location button - Only show when job search is active */}
                {isAvailable && (
                  <>
                    <LocationButton
                      $active={showNearbyJobs}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={getUserLocation}
                      disabled={isLoadingLocation}
                    >
                      {isLoadingLocation ? (
                        <>
                          <div className="spinner" />
                          {language === 'vi' ? 'Đang lấy vị trí...' : 'Getting location...'}
                        </>
                      ) : (
                        <>
                          <Navigation size={16} />
                          {showNearbyJobs
                            ? (language === 'vi' ? 'Vị trí đã bật' : 'Location Enabled')
                            : (language === 'vi' ? 'Tìm việc gần tôi' : 'Find Jobs Near Me')}
                        </>
                      )}
                    </LocationButton>

                    {showNearbyJobs && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                          color: 'rgba(255,255,255,0.9)',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        {language === 'vi'
                          ? `Tìm thấy ${nearbyJobs.length} việc làm trong bán kính ${nearbyRadius}km`
                          : `Found ${nearbyJobs.length} jobs within ${nearbyRadius}km radius`}
                      </motion.span>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </HeroContent>
        </HeroSection>

        {/* Category Tabs */}
        <CategoryTabs>
          <CategoryTab
            $active={jobCategory === 'standard' && !showSavedJobsOnly}
            onClick={() => {
              setJobCategory('standard');
              setQuickFilter('all');
              setShowSavedJobsOnly(false);
              navigate('/candidate/jobs');
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Briefcase />
            {language === 'vi' ? 'Công việc tiêu chuẩn' : 'Standard Jobs'}
            <span style={{ marginLeft: 'auto', fontSize: '14px', opacity: 0.9 }}>
              ({allJobs.filter(j => j.category === 'standard').length})
            </span>
          </CategoryTab>

          <CategoryTab
            $active={jobCategory === 'shift' && !showSavedJobsOnly}
            onClick={() => {
              setJobCategory('shift');
              setQuickFilter('all');
              setShowSavedJobsOnly(false);
              navigate('/candidate/jobs');
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Zap />
            {language === 'vi' ? 'Công việc Tuyển gấp' : 'Shift Jobs - Hiring Now'}
            <span style={{ marginLeft: 'auto', fontSize: '14px', opacity: 0.9 }}>
              ({allJobs.filter(j => j.category === 'shift').length})
            </span>
          </CategoryTab>

          <CategoryTab
            $active={showSavedJobsOnly}
            onClick={() => {
              setShowSavedJobsOnly(true);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Bookmark />
            {language === 'vi' ? 'Công việc đã lưu' : 'Saved Jobs'}
            <span style={{ marginLeft: 'auto', fontSize: '14px', opacity: 0.9 }}>
              ({savedJobs.length})
            </span>
          </CategoryTab>
        </CategoryTabs>

        {/* Nearby Jobs Section - Hidden now, jobs shown in main list */}

        {/* Main Content with Filters */}
        <MainLayout>
          {/* Filter Sidebar */}
          <FilterSidebar
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FilterHeader>
              <h3>
                <SlidersHorizontal />
                {language === 'vi' ? 'Bộ lọc' : 'Filters'}
              </h3>
              <ClearButton onClick={clearAllFilters}>{language === 'vi' ? 'Xóa' : 'Clear'}</ClearButton>
            </FilterHeader>

            <FilterSection>
              <FilterTitle onClick={() => toggleFilter('jobType')} $expanded={expandedFilters.jobType}>
                <h4>{jobCategory === 'standard'
                  ? (language === 'vi' ? 'Loại hình công việc' : 'Job Type')
                  : (language === 'vi' ? 'Loại ca làm việc' : 'Shift Type')}</h4>
                <ChevronDown />
              </FilterTitle>
              {expandedFilters.jobType && (
                <FilterOptions
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                >
                  {jobCategory === 'standard' ? (
                    <>
                      <FilterOption>
                        <input
                          type="checkbox"
                          id="fulltime"
                          checked={selectedJobTypes.includes('full-time')}
                          onChange={() => toggleJobType('full-time')}
                        />
                        <span>{language === 'vi' ? 'Toàn thời gian' : 'Full-time'}</span>
                        <small>28</small>
                      </FilterOption>
                      <FilterOption>
                        <input
                          type="checkbox"
                          id="parttime"
                          checked={selectedJobTypes.includes('part-time')}
                          onChange={() => toggleJobType('part-time')}
                        />
                        <span>{language === 'vi' ? 'Bán thời gian' : 'Part-time'}</span>
                        <small>12</small>
                      </FilterOption>
                    </>
                  ) : (
                    <>
                      <FilterOption>
                        <input
                          type="checkbox"
                          id="morning"
                          checked={selectedJobTypes.includes('sáng')}
                          onChange={() => toggleJobType('sáng')}
                        />
                        <span>{language === 'vi' ? 'Ca sáng (6h-14h)' : 'Morning Shift (6AM-2PM)'}</span>
                        <small>8</small>
                      </FilterOption>
                      <FilterOption>
                        <input
                          type="checkbox"
                          id="afternoon"
                          checked={selectedJobTypes.includes('chiều')}
                          onChange={() => toggleJobType('chiều')}
                        />
                        <span>{language === 'vi' ? 'Ca chiều (14h-22h)' : 'Afternoon Shift (2PM-10PM)'}</span>
                        <small>5</small>
                      </FilterOption>
                      <FilterOption>
                        <input
                          type="checkbox"
                          id="night"
                          checked={selectedJobTypes.includes('đêm')}
                          onChange={() => toggleJobType('đêm')}
                        />
                        <span>{language === 'vi' ? 'Ca đêm (22h-6h)' : 'Night Shift (10PM-6AM)'}</span>
                        <small>5</small>
                      </FilterOption>

                    </>
                  )}
                </FilterOptions>
              )}
            </FilterSection>

            <FilterSection>
              <FilterTitle onClick={() => toggleFilter('salary')} $expanded={expandedFilters.salary}>
                <h4>{jobCategory === 'standard'
                  ? (language === 'vi' ? 'Mức lương' : 'Salary')
                  : (language === 'vi' ? 'Thu nhập/giờ' : 'Income/Shift')}</h4>
                <ChevronDown />
              </FilterTitle>
              {expandedFilters.salary && (
                <FilterOptions
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                >
                  {jobCategory === 'standard' ? (
                    <>
                      <FilterOption>
                        <input
                          type="checkbox"
                          id="hourly"
                          checked={selectedSalaryRanges.includes('hourly')}
                          onChange={() => toggleSalaryRange('hourly')}
                        />
                        <span>{language === 'vi' ? 'Trả theo giờ' : 'Hourly wage'}</span>
                        <small>8</small>
                      </FilterOption>
                      <FilterOption>
                        <input
                          type="checkbox"
                          id="under-10m"
                          checked={selectedSalaryRanges.includes('under-10m')}
                          onChange={() => toggleSalaryRange('under-10m')}
                        />
                        <span>{language === 'vi' ? 'Dưới 5 triệu' : 'Under 5 million'}</span>
                        <small>4</small>
                      </FilterOption>
                      <FilterOption>
                        <input
                          type="checkbox"
                          id="10m-20m"
                          checked={selectedSalaryRanges.includes('10m-20m')}
                          onChange={() => toggleSalaryRange('10m-20m')}
                        />
                        <span>{language === 'vi' ? '5 - 10 triệu' : '5 - 10 million'}</span>
                        <small>0</small>
                      </FilterOption>
                      <FilterOption>
                        <input
                          type="checkbox"
                          id="over-20m"
                          checked={selectedSalaryRanges.includes('over-20m')}
                          onChange={() => toggleSalaryRange('over-20m')}
                        />
                        <span>{language === 'vi' ? 'Trên 10 triệu' : 'Over 10 million'}</span>
                        <small>0</small>
                      </FilterOption>
                    </>
                  ) : (
                    <>
                      <FilterOption>
                        <input
                          type="checkbox"
                          id="26-30k"
                          checked={selectedSalaryRanges.includes('26-30k')}
                          onChange={() => toggleSalaryRange('26-30k')}
                        />
                        <span>{language === 'vi' ? '26.000 - 30.000 VNĐ/giờ' : '26k - 30k/hour'}</span>
                        <small>35</small>
                      </FilterOption>
                      <FilterOption>
                        <input
                          type="checkbox"
                          id="30-35k"
                          checked={selectedSalaryRanges.includes('30-35k')}
                          onChange={() => toggleSalaryRange('30-35k')}
                        />
                        <span>{language === 'vi' ? '30.000 - 35.000 VNĐ/giờ' : '30k - 35k/hour'}</span>
                        <small>5</small>
                      </FilterOption>
                    </>
                  )}
                </FilterOptions>
              )}
            </FilterSection>
          </FilterSidebar>

          {/* Jobs List */}
          <MainContent ref={resultsRef}>
            <ContentHeader>
              <ResultsInfo>
                <h2>
                  {showSavedJobsOnly
                    ? (language === 'vi' ? 'Công việc đã lưu' : 'Saved Jobs')
                    : jobCategory === 'standard'
                      ? (language === 'vi' ? 'Công việc tiêu chuẩn' : 'Standard Jobs')
                      : (language === 'vi' ? 'Công việc theo ca' : 'Shift Jobs')}
                </h2>
                <p>{language === 'vi'
                  ? (showSavedJobsOnly
                    ? `Bạn đang theo dõi ${filteredJobs.length} công việc đã lưu`
                    : `Tìm thấy ${filteredJobs.length} công việc phù hợp`)
                  : (showSavedJobsOnly
                    ? `You are tracking ${filteredJobs.length} saved jobs`
                    : `Found ${filteredJobs.length} matching jobs`)}</p>
              </ResultsInfo>

              <ViewControls>
                <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">{language === 'vi' ? 'Mới nhất' : 'Newest'}</option>
                  <option value="salary">{language === 'vi' ? 'Lương cao nhất' : 'Highest Salary'}</option>
                  <option value="relevant">{language === 'vi' ? 'Phù hợp nhất' : 'Most Relevant'}</option>
                </SortSelect>

                <ViewToggle>
                  <ViewButton
                    $active={viewMode === 'list'}
                    onClick={() => setViewMode('list')}
                  >
                    <List />
                  </ViewButton>
                  <ViewButton
                    $active={viewMode === 'grid'}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid />
                  </ViewButton>
                </ViewToggle>
              </ViewControls>
            </ContentHeader>

            <BoostBannerWrap>
              <BoostTag>🔥Hot deal</BoostTag>
              <motion.img 
                key={currentBannerIndex}
                initial={{ opacity: 0.8, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                src={banners[currentBannerIndex].src} 
                alt={banners[currentBannerIndex].alt} 
              />
              <BannerDots>
                {banners.map((_, idx) => (
                  <BannerDot 
                    key={idx} 
                    $active={currentBannerIndex === idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentBannerIndex(idx);
                    }}
                  />
                ))}
              </BannerDots>
            </BoostBannerWrap>

            <JobsGrid>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <JobCardComponent
                    key={job.id}
                    job={job}
                    saved={savedJobs.includes(job.id)}
                    onSave={handleSaveJob}
                    onClick={handleJobClick}
                    onApply={handleApplyJob}
                    delay={index * 0.05}
                    showDistance={jobCategory === 'shift' && showNearbyJobs}
                    language={language}
                  />
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  gridColumn: '1 / -1',
                  color: '#6b7280'
                }}>
                  {showSavedJobsOnly ? (
                    <>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔖</div>
                      <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                        {language === 'vi' ? 'Bạn chưa lưu công việc nào' : "You haven't saved any jobs yet"}
                      </p>
                      <p style={{ fontSize: '15px', color: '#6b7280' }}>
                        {language === 'vi'
                          ? 'Nhấn vào biểu tượng lưu ở tin tuyển dụng mà bạn quan tâm để thêm vào danh sách.'
                          : 'Click the save icon on any job to add it here.'}
                      </p>
                    </>
                  ) : jobCategory === 'shift' && !showNearbyJobs ? (
                    <>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
                      <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                        {language === 'vi' ? 'Bật vị trí để tìm việc gần bạn' : 'Enable location to find jobs near you'}
                      </p>
                      <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '20px' }}>
                        {language === 'vi'
                          ? 'Nhấn nút "Tìm việc gần tôi" ở phía trên để xem các công việc theo ca trong bán kính 3km'
                          : 'Click "Find Jobs Near Me" button above to see shift jobs within 3km radius'}
                      </p>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                      <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                        {language === 'vi' ? 'Không tìm thấy công việc phù hợp' : 'No matching jobs found'}
                      </p>
                      <p style={{ fontSize: '15px', color: '#6b7280' }}>
                        {jobCategory === 'shift'
                          ? (language === 'vi'
                            ? 'Không có công việc theo ca trong bán kính 3km. Thử mở rộng bán kính tìm kiếm.'
                            : 'No shift jobs within 3km radius. Try expanding the search radius.')
                          : (language === 'vi'
                            ? 'Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn'
                            : 'Try adjusting your filters or search keywords')
                        }
                      </p>
                    </>
                  )}
                </div>
              )}
            </JobsGrid>
          </MainContent>
        </MainLayout>
      </Container>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title=""
      >
        <ConfirmationContent $isActive={isAvailable}>
          <div className="icon-wrapper">
            {isAvailable ? <XCircle /> : <CheckCircle />}
          </div>
          <h3>
            {isAvailable
              ? (language === 'vi' ? 'Tắt tìm việc?' : 'Pause Job Search?')
              : (language === 'vi' ? 'Bật tìm việc?' : 'Activate Job Search?')}
          </h3>
          <p>
            {isAvailable
              ? (language === 'vi'
                ? 'Hồ sơ của bạn sẽ bị ẩn với nhà tuyển dụng và bạn sẽ không nhận được thông báo về cơ hội việc làm.'
                : 'Your profile will be hidden from employers and you will not receive job opportunity notifications.')
              : (language === 'vi'
                ? 'Hồ sơ của bạn sẽ hiển thị với nhà tuyển dụng và bạn sẽ nhận được thông báo về cơ hội việc làm phù hợp.'
                : 'Your profile will be visible to employers and you will receive notifications about suitable job opportunities.')}
          </p>
          <div className="button-group">
            <button className="cancel" onClick={() => setShowConfirmModal(false)}>
              {language === 'vi' ? 'Hủy' : 'Cancel'}
            </button>
            <button className="confirm" onClick={confirmToggle}>
              {isAvailable
                ? (language === 'vi' ? 'Tắt ngay' : 'Pause Now')
                : (language === 'vi' ? 'Bật ngay' : 'Activate Now')}
            </button>
          </div>
        </ConfirmationContent>
      </Modal>

      {/* Apply Confirmation Modal */}
      <Modal
        isOpen={!!applyModal}
        onClose={() => setApplyModal(null)}
        title=""
      >
        {applyModal && (
          <ApplyModalWrap onClick={e => e.stopPropagation()}>
            <div className="apply-emoji">📋</div>

            <h3>{language === 'vi' ? 'Xác nhận ứng tuyển' : 'Confirm Application'}</h3>

            <p className="apply-desc">
              {language === 'vi'
                ? <>Bạn muốn gửi CV ứng tuyển vào vị trí <strong>{applyModal.job.title}</strong> tại <strong>{applyModal.job.company}</strong>?</>
                : <>Send your CV for <strong>{applyModal.job.title}</strong> at <strong>{applyModal.job.company}</strong>?</>
              }
            </p>

            <div className="apply-info-card">
              <div className="info-row">
                <span className="info-label">{language === 'vi' ? 'Vị trí' : 'Position'}:</span>
                <span className="info-value">{translateJobTitle(applyModal.job.title, language)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{language === 'vi' ? 'Công ty' : 'Company'}:</span>
                <span className="info-value">{applyModal.job.company}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{language === 'vi' ? 'Địa điểm' : 'Location'}:</span>
                <span className="info-value">{applyModal.job.location}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{language === 'vi' ? 'Mức lương' : 'Salary'}:</span>
                <span className="info-value salary">{translateSalary(applyModal.job.category === 'shift' ? calculateShiftSalary(applyModal.job) : applyModal.job.salary, language)}</span>
              </div>
            </div>

            <div className="apply-buttons">
              <button className="btn-cancel" onClick={() => setApplyModal(null)}>
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button className="btn-confirm" onClick={confirmApply}>
                {language === 'vi' ? 'Gửi CV ngay' : 'Send CV'}
              </button>
            </div>
          </ApplyModalWrap>
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={!!detailModal}
        onClose={() => setDetailModal(null)}
        title=""
      >
        {detailModal && (
          <ApplyModalWrap onClick={e => e.stopPropagation()}>
            <div className="apply-emoji" style={{ fontSize: '40px' }}>💼</div>
            <h3>{translateJobTitle(detailModal.job.title, language)}</h3>
            <p className="apply-desc" style={{ marginBottom: '10px' }}>
              <strong>{detailModal.job.company}</strong>
            </p>

            <div className="apply-info-card" style={{ marginBottom: '15px' }}>
              <div className="info-row">
                <span className="info-label">{language === 'vi' ? 'Địa điểm' : 'Location'}:</span>
                <span className="info-value">{detailModal.job.location}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{language === 'vi' ? 'Mức lương' : 'Salary'}:</span>
                <span className="info-value salary">{translateSalary(detailModal.job.category === 'shift' ? calculateShiftSalary(detailModal.job) : detailModal.job.salary, language)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{language === 'vi' ? 'Loại hình' : 'Type'}:</span>
                <span className="info-value">{detailModal.job.type}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{language === 'vi' ? 'Ngày đăng' : 'Posted at'}:</span>
                <span className="info-value">{detailModal.job.postedAt}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{language === 'vi' ? 'Ngày làm' : 'Date'}:</span>
                <span className="info-value">
                  {detailModal.job.shiftDetails?.date || (detailModal.job.urgent ? '09/03/2026' : '15/03/2026')}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">{language === 'vi' ? 'Thời gian' : 'Time'}:</span>
                <span className="info-value">
                  {detailModal.job.shiftDetails?.time || detailModal.job.type?.match(/\((.*?)\)/)?.[1] || '07:00 - 10:00'}
                </span>
              </div>
            </div>

            <div className="apply-buttons">
              <button className="btn-cancel" onClick={() => setDetailModal(null)}>
                {language === 'vi' ? 'Đóng' : 'Close'}
              </button>
              <button className="btn-confirm" onClick={() => {
                setDetailModal(null);
                setApplyModal({ job: detailModal.job });
              }}>
                {language === 'vi' ? 'Ứng tuyển ngay' : 'Apply Now'}
              </button>
            </div>
          </ApplyModalWrap>
        )}
      </Modal>

      {/* Apply Success Toast */}
      {applySuccess && (
        <div style={{
          position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          background: '#10b981', color: 'white', padding: '14px 28px', borderRadius: '50px',
          fontWeight: '600', fontSize: '15px', zIndex: 9999,
          boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          ✅ {language === 'vi' ? 'Gửi CV thành công! Nhà tuyển dụng sẽ liên hệ sớm.' : 'CV sent! The employer will contact you soon.'}
        </div>
      )}

    </DashboardLayout>
  );
};

// Add keyframe animation for loading spinner
const GlobalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = GlobalStyles;
  document.head.appendChild(styleSheet);
}

// Job Card Component
const JobCardComponent = ({ job, saved, onSave, onClick, onApply, delay = 0, showDistance = false, language }) => {
  const getCompanyInitial = (company) => {
    return company.charAt(0).toUpperCase();
  };

  return (
    <JobCardWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onClick(job.id)}
    >
      <JobCardHeader>
        <CompanyLogo>
          {getCompanyInitial(job.company)}
        </CompanyLogo>
        <JobInfo>
          <JobTitle>
            {translateJobTitle(job.title, language)}
            {job.urgent && <StatusBadge status="urgent" size="sm">{language === 'vi' ? 'Tuyển gấp' : 'Urgent'}</StatusBadge>}
            {job.featured && <Star size={18} fill="#F59E0B" color="#F59E0B" />}
          </JobTitle>
          <CompanyName>
            <Building2 />
            {job.company}
          </CompanyName>
          <JobMeta>
            <MetaItem>
              <MapPin />
              {translateLocation(job.location, language)}
            </MetaItem>
            {showDistance && job.distance !== undefined && (
              <MetaItem style={{ color: '#10b981', fontWeight: '600' }}>
                <Target size={16} />
                {job.distance < 1
                  ? `${(job.distance * 1000).toFixed(0)}m`
                  : `${job.distance.toFixed(1)}km`}
              </MetaItem>
            )}
            <MetaItem>
              <Briefcase />
              {translateJobType(job.type, language)}
            </MetaItem>
            <MetaItem>
              <Eye />
              {job.views} {language === 'vi' ? 'lượt xem' : 'views'}
            </MetaItem>
          </JobMeta>
        </JobInfo>
      </JobCardHeader>

      <JobCardBody>
        <JobTags>
          {job.tags.map((tag, idx) => (
            <Tag key={idx}>{translateTag(tag, language)}</Tag>
          ))}
        </JobTags>

        <JobSalary>
          <span style={{ fontWeight: '500' }}>{language === 'vi' ? 'Thu nhập:' : 'Income:'}</span>
          <span>{translateSalary(job.category === 'shift' ? calculateShiftSalary(job) : job.salary, language)}</span>
        </JobSalary>
      </JobCardBody>

      <JobCardFooter>
        <JobPosted>
          <Clock />
          {translateTimePosted(job.postedAt, language)}
        </JobPosted>

        <JobActions>
          <ActionButton
            $primary
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onApply(job);
            }}
          >
            {language === 'vi' ? 'Ứng tuyển ngay' : 'Apply Now'}
            <ArrowUpRight />
          </ActionButton>

          <SaveButton
            $saved={saved}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => onSave(job.id, e)}
          >
            <Bookmark />
          </SaveButton>
        </JobActions>
      </JobCardFooter>
    </JobCardWrapper>
  );
};

export default JobListing;
