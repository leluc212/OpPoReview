import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import JobCard from '../../components/JobCard';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  FileText, 
  Star, 
  TrendingUp, 
  Search, 
  CheckCircle, 
  Clock, 
  Calendar,
  Target,
  Award,
  Bell,
  ArrowUpRight,
  Eye,
  MapPin,
  DollarSign,
  Users,
  Upload,
  Edit3,
  Sparkles,
  X,
  Building2,
  StarIcon
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;


const DashboardContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
`;

const WelcomeBanner = styled(motion.div)`
  background: linear-gradient(135deg, #1e40af 0%, #1e40af 100%);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 40px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(14, 57, 149, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    right: 20%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
  color: white;
  flex: 1;
  
  h1 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 16px;
    opacity: 0.95;
    margin-bottom: 24px;
    font-weight: 500;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled(motion.button)`
  padding: 14px 28px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.$variant === 'primary' ? 'white' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.$variant === 'primary' ? props.theme.colors.primary : 'white'};
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 2px solid ${props => props.$variant === 'primary' ? 'white' : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const IllustrationContainer = styled.div`
  position: relative;
  z-index: 1;
  
  svg {
    width: 180px;
    height: 180px;
    animation: ${float} 3s ease-in-out infinite;
  }
`;

const ProfileCompletionBanner = styled(motion.div)`
  background: linear-gradient(135deg, #93C5FD 0%, #60A5FA 100%);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  box-shadow: 0 8px 20px rgba(96, 165, 250, 0.25);
  flex: 1;
  min-width: 0;
  
  h3 {
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
    line-height: 1.3;

    svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
  }
  
  p {
    font-size: 11px;
    opacity: 0.95;
    white-space: nowrap;
  }
`;

const ProgressBar = styled.div`
  width: 140px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
  margin-top: 6px;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.$progress || 0}%;
    height: 100%;
    background: white;
    border-radius: ${props => props.theme.borderRadius.full};
    transition: width 0.5s ease;
  }
`;

const TopInfoRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: stretch;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  flex: 2;
  min-width: 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
`;

const Section = styled(motion.section)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 28px;
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.card};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary}30;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  
  h2 {
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 10px;
    
    svg {
      width: 24px;
      height: 24px;
      color: ${props => props.theme.colors.primary};
    }
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.3s ease;
    
    &:hover {
      gap: 8px;
    }
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const ApplicationCard = styled(motion.div)`
  padding: 14px 18px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateX(8px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const ApplicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const ApplicationInfo = styled.div`
  flex: 1;
  
  h4 {
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 2px;
  }
  
  p {
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 500;
  }
`;

const ApplicationMeta = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  font-size: 12px;
  color: ${props => props.theme.colors.textLight};
  
  span {
    display: flex;
    align-items: center;
    gap: 4px;
    
    svg {
      width: 13px;
      height: 13px;
    }
  }
`;

const ActivityFeed = styled.div``;

const ActivityItem = styled(motion.div)`
  display: flex;
  gap: 16px;
  padding: 24px;
  border-left: 4px solid ${props => props.$color || props.theme.colors.border};
  margin-bottom: 12px;
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: ${props => props.theme.shadows.md};
    border-color: ${props => props.$color || props.theme.colors.primary};
  }
`;

const ActivityIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.$color || props.theme.colors.primary}15;
  color: ${props => props.$color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 28px;
    height: 28px;
  }
`;

const ActivityContent = styled.div`
  flex: 1;
  
  h5 {
    font-size: 17px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 6px;
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const RecommendedJobCard = styled(motion.div)`
  padding: 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const JobHeader = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

const CompanyLogo = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.primary}15;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 20px;
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
`;

const JobInfo = styled.div`
  flex: 1;
  
  h4 {
    font-size: 16px;
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

const JobDetails = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  
  span {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 500;
    
    svg {
      width: 16px;
      height: 16px;
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const JobTags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  
  span {
    padding: 6px 14px;
    background: ${props => props.theme.colors.primary}12;
    color: ${props => props.theme.colors.primary};
    border-radius: ${props => props.theme.borderRadius.full};
    font-size: 12px;
    font-weight: 700;
    border: 1px solid ${props => props.theme.colors.primary}25;
  }
`;

const CurrentJobSection = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 24px 28px;
  margin-bottom: 32px;
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.card};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary}30;
  }
`;

const CurrentJobHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme.colors.border};

  h2 {
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.theme.colors.primary};
  }
`;

const CurrentJobCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border: 2px solid ${props => props.theme.colors.primary}20;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.primary}05;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const CurrentJobLogo = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.primary}15;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 22px;
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
`;

const CurrentJobInfo = styled.div`
  flex: 1;

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 6px;
  }

  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 500;
    margin-bottom: 4px;
  }
`;

const CurrentJobMeta = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 8px;
  flex-wrap: wrap;

  span {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 500;

    svg {
      width: 15px;
      height: 15px;
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const CurrentJobBadge = styled.span`
  padding: 6px 16px;
  background: ${props => props.theme.colors.success}15;
  color: ${props => props.theme.colors.success};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 13px;
  font-weight: 700;
  border: 1px solid ${props => props.theme.colors.success}30;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ViewDetailButton = styled(motion.button)`
  padding: 8px 20px;
  background: ${props => props.theme.colors.primary}10;
  color: ${props => props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.primary}30;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-left: 12px;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 2px solid ${props => props.theme.colors.border};

  h2 {
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      width: 24px;
      height: 24px;
      color: ${props => props.theme.colors.primary};
    }
  }

  button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.textLight};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: ${props => props.theme.colors.error}15;
      color: ${props => props.theme.colors.error};
    }
  }
`;

const ModalBody = styled.div`
  padding: 28px;
`;

const JobDetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.primary};
    flex-shrink: 0;
  }

  .label {
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 500;
    min-width: 120px;
  }

  .value {
    font-size: 14px;
    color: ${props => props.theme.colors.text};
    font-weight: 600;
  }
`;

const JobStatusTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: ${props => props.$completed ? props.theme.colors.success + '15' : '#F59E0B15'};
  color: ${props => props.$completed ? props.theme.colors.success : '#F59E0B'};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 13px;
  font-weight: 700;
  border: 1px solid ${props => props.$completed ? props.theme.colors.success + '30' : '#F59E0B30'};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 2px solid ${props => props.theme.colors.border};
`;

const ModalButton = styled(motion.button)`
  flex: 1;
  padding: 14px 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &.primary {
    background: ${props => props.theme.colors.primary};
    color: white;

    &:hover {
      background: ${props => props.theme.colors.primary}dd;
      box-shadow: 0 8px 20px ${props => props.theme.colors.primary}40;
    }
  }

  &.secondary {
    background: transparent;
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary}30;

    &:hover {
      background: ${props => props.theme.colors.primary}10;
    }
  }

  &.success {
    background: ${props => props.theme.colors.success};
    color: white;

    &:hover {
      background: ${props => props.theme.colors.success}dd;
      box-shadow: 0 8px 20px ${props => props.theme.colors.success}40;
    }
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SuccessMessage = styled(motion.div)`
  text-align: center;
  padding: 20px 0;

  .icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: ${props => props.theme.colors.success}15;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;

    svg {
      width: 32px;
      height: 32px;
      color: ${props => props.theme.colors.success};
    }
  }

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    line-height: 1.6;
  }
`;

const ReviewForm = styled(motion.div)`
  margin-top: 20px;
`;

const ReviewCategory = styled.div`
  margin-bottom: 20px;

  .category-label {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;

    svg {
      width: 18px;
      height: 18px;
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const StarRow = styled.div`
  display: flex;
  gap: 6px;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }

  svg {
    width: 28px;
    height: 28px;
    fill: ${props => props.$active ? '#F59E0B' : 'transparent'};
    stroke: ${props => props.$active ? '#F59E0B' : props.theme.colors.textLight + '60'};
    stroke-width: 2;
    transition: all 0.2s;
  }
`;

const ReviewTextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 14px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 14px;
  font-family: inherit;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.bgLight};
  resize: vertical;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight}80;
  }
`;

const ReviewSubmittedMessage = styled(motion.div)`
  text-align: center;
  padding: 24px 0;

  .icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: ${props => props.theme.colors.success}15;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;

    svg {
      width: 32px;
      height: 32px;
      color: ${props => props.theme.colors.success};
    }
  }

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    line-height: 1.6;
  }
`;

const CandidateDashboard = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime] = useState(new Date());
  const [profileCompletion] = useState(75);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [jobCompleted, setJobCompleted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [ratings, setRatings] = useState({ environment: 0, attitude: 0, accuracy: 0 });
  const [reviewText, setReviewText] = useState('');

  const handleSubmitReview = () => {
    setReviewSubmitted(true);
  };

  const handleCloseModal = () => {
    setShowJobDetail(false);
    setJobCompleted(false);
    setShowReviewForm(false);
    setReviewSubmitted(false);
    setRatings({ environment: 0, attitude: 0, accuracy: 0 });
    setReviewText('');
  };

  const canCloseModal = !jobCompleted || reviewSubmitted;

  const renderStars = (category) => (
    <StarRow>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarButton
          key={star}
          $active={ratings[category] >= star}
          onClick={() => setRatings(prev => ({ ...prev, [category]: star }))}
        >
          <Star />
        </StarButton>
      ))}
    </StarRow>
  );

  // Translation helper functions
  const translateSalary = (salaryStr) => {
    if (language === 'vi') return salaryStr;
    return salaryStr
      .replace(/triệu/g, 'million')
      .replace(/\/ca/g, '/shift')
      .replace(/\/giờ/g, '/hour');
  };

  const translateLocation = (locationStr) => {
    if (language === 'vi') return locationStr;
    return locationStr
      .replace(/Quận/g, 'District')
      .replace(/TP\.HCM/g, 'HCMC')
      .replace(/Hà Nội/g, 'Hanoi')
      .replace(/Đà Nẵng/g, 'Da Nang')
      .replace(/Tân Bình/g, 'Tan Binh')
      .replace(/Phú Nhuận/g, 'Phu Nhuan');
  };

  // Translate job titles
  const translateJobTitle = (titleVi) => {
    if (language === 'vi') return titleVi;
    const titleMap = {
      'Nhân viên Pha Chế': 'Barista',
      'Nhân viên Phục Vụ': 'Service Staff',
      'Đầu Bếp Phụ': 'Assistant Chef'
    };
    return titleMap[titleVi] || titleVi;
  };

  // Translate job type
  const translateJobType = (typeVi) => {
    if (language === 'vi') return typeVi;
    const typeMap = {
      'Toàn thời gian': 'Full-time',
      'Bán thời gian': 'Part-time',
      'Hợp đồng': 'Contract',
      'Thực tập': 'Internship'
    };
    return typeMap[typeVi] || typeVi;
  };

  // Translate job tags
  const translateTag = (tagVi) => {
    if (language === 'vi') return tagVi;
    const tagMap = {
      'Bán hàng': 'Sales',
      'Giao tiếp': 'Communication',
      'Nhiệt tình': 'Enthusiastic',
      'Văn phòng': 'Office',
      'Word/Excel': 'Word/Excel',
      'Hành chính': 'Admin',
      'Phục vụ': 'Service',
      'F&B': 'F&B',
      'Ca làm linh động': 'Flexible Shifts'
    };
    return tagMap[tagVi] || tagVi;
  };

  // Translate time posted
  const translatePostedAt = (timeStr) => {
    if (language === 'vi') return timeStr;
    return timeStr
      .replace(/ngày trước/g, 'days ago')
      .replace(/giờ trước/g, 'hours ago')
      .replace(/tuần trước/g, 'weeks ago')
      .replace(/tháng trước/g, 'months ago');
  };

  const recommendedJobs = [
    {
      id: 1,
      title: 'Nhân viên Pha Chế',
      company: 'Highlands Coffee',
      location: 'Quận 1, TP.HCM',
      type: 'Toàn thời gian',
      salary: '8-12 triệu',
      postedAt: '2 ngày trước',
      tags: ['Pha chế', 'F&B', 'Coffee']
    },
    {
      id: 2,
      title: 'Nhân viên Phục Vụ',
      company: 'The Coffee House',  
      location: 'Quận 7, TP.HCM',
      type: 'Toàn thời gian',
      salary: '7-10 triệu',
      postedAt: '1 ngày trước',
      tags: ['Phục vụ', 'F&B', 'Ca làm linh động']
    },
    {
      id: 3,
      title: 'Đầu Bếp Phụ',
      company: 'Golden Gate Group',
      location: 'Quận 3, TP.HCM',
      type: 'Toàn thời gian',
      salary: '9-14 triệu',
      postedAt: '2 ngày trước',
      tags: ['Bếp', 'F&B', 'Nhà hàng']
    }
  ];

  const recentApplications = [
    { 
      id: 1, 
      title: 'Nhân viên Phục Vụ Bàn', 
      company: 'Pizza 4P\'s', 
      appliedDate: '2 ngày trước', 
      status: 'pending' 
    },
    { 
      id: 2, 
      title: 'Nhân viên Pha Chế', 
      company: 'Phúc Long Coffee & Tea', 
      appliedDate: '5 ngày trước', 
      status: 'pending' 
    },
    { 
      id: 3, 
      title: 'Nhân viên Phục Vụ', 
      company: 'Katinat Quận 8', 
      appliedDate: '1 giờ trước', 
      status: 'approved',
      urgent: true
    },
  ];

  const activities = [
    {
      type: 'view',
      icon: Eye,
      color: '#1e40af',
      title: language === 'vi' ? '12 nhà tuyển dụng đã xem CV của bạn' : '12 employers viewed your CV',
      time: language === 'vi' ? 'Hôm nay' : 'Today'
    },
    {
      type: 'message',
      icon: Bell,
      color: '#F59E0B',
      title: language === 'vi' ? 'Bạn có 3 phản hồi CV mới từ nhà tuyển dụng' : 'You have 3 new CV responses from employers',
      time: language === 'vi' ? '2 giờ trước' : '2 hours ago'
    },
    {
      type: 'match',
      icon: Target,
      color: '#1e40af',
      title: language === 'vi' ? '5 công việc mới phù hợp với bạn' : '5 new jobs match your profile',
      time: language === 'vi' ? '4 giờ trước' : '4 hours ago'
    },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();    if (language === 'en') {
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    }    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <DashboardLayout role="candidate" key={language}>
      <DashboardContainer>
        {/* Welcome Banner */}
        <WelcomeBanner
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WelcomeContent>
            <h1>{getGreeting()}, {language === 'vi' ? 'Ứng Viên' : 'Candidate'}! 👋</h1>
            <p>{language === 'vi' ? 'Chúc bạn một ngày làm việc hiệu quả!' : 'Have a productive day!'}</p>
            <QuickActions>
              <ActionButton
                as={motion.a}
                href="/candidate/jobs"
                onClick={(e) => { e.preventDefault(); navigate('/candidate/jobs'); }}
                $variant="primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Search />
                {language === 'vi' ? 'Tìm Việc Làm' : 'Find Jobs'}
              </ActionButton>
              <ActionButton
                as={motion.a}
                href="/candidate/profile"
                onClick={(e) => { e.preventDefault(); navigate('/candidate/profile'); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit3 />
                {language === 'vi' ? 'Cập Nhật CV' : 'Update CV'}
              </ActionButton>
            </QuickActions>
          </WelcomeContent>
          <IllustrationContainer>
            <Briefcase size={180} color="rgba(255,255,255,0.3)" />
          </IllustrationContainer>
        </WelcomeBanner>

        {/* Profile + Stats Row */}
        <TopInfoRow>
          {profileCompletion < 100 && (
            <ProfileCompletionBanner
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div>
                <h3>
                  <Sparkles />
                  {language === 'vi' ? 'Hoàn thiện hồ sơ để tăng cơ hội được tuyển dụng' : 'Complete your profile to increase hiring chances'}
                </h3>
                <p>{language === 'vi' ? `Hồ sơ của bạn đã hoàn thành ${profileCompletion}%` : `Your profile is ${profileCompletion}% complete`}</p>
                <ProgressBar $progress={profileCompletion} />
              </div>
              <ActionButton
                as={motion.a}
                href="/candidate/profile"
                onClick={(e) => { e.preventDefault(); navigate('/candidate/profile'); }}
                $variant="primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                <Upload />
                {language === 'vi' ? 'Hoàn Thiện Ngay' : 'Complete Now'}
              </ActionButton>
            </ProfileCompletionBanner>
          )}

          <StatsGrid>
            <StatsCard
              title={language === 'vi' ? 'Hồ Sơ Đã Nộp' : 'Applications'}
              value="24"
              change="+12%"
              changeText={language === 'vi' ? 'từ tháng trước' : 'from last month'}
              icon={FileText}
              color="#1e40af"
              positive
            />
            <StatsCard
              title={language === 'vi' ? 'Việc Đã Lưu' : 'Saved Jobs'}
              value="18"
              change="+3"
              changeText={language === 'vi' ? 'tuần này' : 'this week'}
              icon={Star}
              color="#F59E0B"
              positive
            />
            <StatsCard
              title={language === 'vi' ? 'Lượt Xem Hồ Sơ' : 'Profile Views'}
              value="156"
              change="+28%"
              changeText={language === 'vi' ? 'từ tuần trước' : 'from last week'}
              icon={Eye}
              color="#10B981"
              positive
            />
            <StatsCard
              title={language === 'vi' ? 'Job Match Thành Công' : 'Successful Matches'}
              value="8"
              change="+2"
              changeText={language === 'vi' ? 'tháng này' : 'this month'}
              icon={CheckCircle}
              color="#1e40af"
              positive
            />
          </StatsGrid>
        </TopInfoRow>

        {/* Công việc hiện tại */}
        <CurrentJobSection
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CurrentJobHeader>
            <Briefcase />
            <h2>{language === 'vi' ? 'Công Việc Hiện Tại' : 'Current Job'}</h2>
          </CurrentJobHeader>
          <CurrentJobCard
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <CurrentJobLogo>K</CurrentJobLogo>
            <CurrentJobInfo>
              <h3>{language === 'vi' ? 'Nhân viên phục vụ' : 'Service Staff'}</h3>
              <p>Katinat - Quận 8</p>
              <CurrentJobMeta>
                <span><MapPin />{language === 'vi' ? 'Quận 8, TP.HCM' : 'District 8, HCMC'}</span>
                <span><Clock />{language === 'vi' ? 'Ca sáng (06:00 - 14:00)' : 'Morning (06:00 - 14:00)'}</span>
                <span><DollarSign />27.000 VNĐ/{language === 'vi' ? 'giờ' : 'hr'}</span>
                <span><Calendar />{language === 'vi' ? 'Từ 05/03/2026' : 'Since Mar 05, 2026'}</span>
              </CurrentJobMeta>
            </CurrentJobInfo>
            <CurrentJobBadge>
              <CheckCircle />
              {language === 'vi' ? 'Đang làm việc' : 'Active'}
            </CurrentJobBadge>
            <ViewDetailButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowJobDetail(true)}
            >
              <Eye />
              {language === 'vi' ? 'Xem chi tiết' : 'Details'}
            </ViewDetailButton>
          </CurrentJobCard>
        </CurrentJobSection>

        {/* Modal chi tiết công việc */}
        {showJobDetail && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { if (canCloseModal) handleCloseModal(); }}
          >
            <ModalContent
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h2><Briefcase />{language === 'vi' ? (showReviewForm ? 'Đánh Giá Nhà Tuyển Dụng' : 'Chi Tiết Công Việc') : (showReviewForm ? 'Rate Employer' : 'Job Details')}</h2>
                {canCloseModal && <button onClick={handleCloseModal}><X size={18} /></button>}
              </ModalHeader>
              <ModalBody>
                {!jobCompleted ? (
                  <>
                    <JobDetailRow>
                      <Briefcase />
                      <span className="label">{language === 'vi' ? 'Vị trí' : 'Position'}</span>
                      <span className="value">{language === 'vi' ? 'Nhân viên phục vụ' : 'Service Staff'}</span>
                    </JobDetailRow>
                    <JobDetailRow>
                      <Building2 />
                      <span className="label">{language === 'vi' ? 'Công ty' : 'Company'}</span>
                      <span className="value">Katinat - Quận 8</span>
                    </JobDetailRow>
                    <JobDetailRow>
                      <MapPin />
                      <span className="label">{language === 'vi' ? 'Địa điểm' : 'Location'}</span>
                      <span className="value">{language === 'vi' ? 'Quận 8, TP.HCM' : 'District 8, HCMC'}</span>
                    </JobDetailRow>
                    <JobDetailRow>
                      <Clock />
                      <span className="label">{language === 'vi' ? 'Ca làm' : 'Shift'}</span>
                      <span className="value">{language === 'vi' ? 'Ca sáng (06:00 - 14:00)' : 'Morning (06:00 - 14:00)'}</span>
                    </JobDetailRow>
                    <JobDetailRow>
                      <DollarSign />
                      <span className="label">{language === 'vi' ? 'Lương' : 'Salary'}</span>
                      <span className="value">27.000 VNĐ/{language === 'vi' ? 'giờ' : 'hr'}</span>
                    </JobDetailRow>
                    <JobDetailRow>
                      <Calendar />
                      <span className="label">{language === 'vi' ? 'Ngày bắt đầu' : 'Start date'}</span>
                      <span className="value">05/03/2026</span>
                    </JobDetailRow>
                    <JobDetailRow>
                      <CheckCircle />
                      <span className="label">{language === 'vi' ? 'Trạng thái' : 'Status'}</span>
                      <JobStatusTag>
                        <Clock />
                        {language === 'vi' ? 'Đang thực hiện' : 'In Progress'}
                      </JobStatusTag>
                    </JobDetailRow>
                    <ModalActions>
                      <ModalButton
                        className="secondary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowJobDetail(false)}
                      >
                        {language === 'vi' ? 'Đóng' : 'Close'}
                      </ModalButton>
                      <ModalButton
                        className="success"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setJobCompleted(true)}
                      >
                        <CheckCircle />
                        {language === 'vi' ? 'Xác nhận hoàn thành' : 'Confirm Completion'}
                      </ModalButton>
                    </ModalActions>
                  </>
                ) : !showReviewForm ? (
                  <>
                    <SuccessMessage
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="icon-wrapper">
                        <CheckCircle />
                      </div>
                      <h3>{language === 'vi' ? 'Công việc đã hoàn thành!' : 'Job Completed!'}</h3>
                      <p>{language === 'vi' ? 'Lương của bạn sẽ được chuyển vào ví trong vòng 48h.' : 'Your salary will be transferred to your wallet within 48 hours.'}</p>
                    </SuccessMessage>
                    <ModalActions>
                      <ModalButton
                        className="primary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowReviewForm(true)}
                      >
                        <Star />
                        {language === 'vi' ? 'Đánh giá Nhà tuyển dụng' : 'Rate Employer'}
                      </ModalButton>
                    </ModalActions>
                  </>
                ) : !reviewSubmitted ? (
                  <>
                    <ReviewForm
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p style={{ fontSize: '14px', color: 'inherit', marginBottom: '20px', fontWeight: 600 }}>
                        Katinat - Quận 8
                      </p>
                      <ReviewCategory>
                        <div className="category-label">
                          <Building2 />
                          {language === 'vi' ? 'Môi trường làm việc' : 'Work Environment'}
                        </div>
                        {renderStars('environment')}
                      </ReviewCategory>
                      <ReviewCategory>
                        <div className="category-label">
                          <Users />
                          {language === 'vi' ? 'Thái độ nhà tuyển dụng' : 'Employer Attitude'}
                        </div>
                        {renderStars('attitude')}
                      </ReviewCategory>
                      <ReviewCategory>
                        <div className="category-label">
                          <CheckCircle />
                          {language === 'vi' ? 'Công việc đúng với mô tả' : 'Job Matches Description'}
                        </div>
                        {renderStars('accuracy')}
                      </ReviewCategory>
                      <ReviewCategory>
                        <div className="category-label">
                          <Edit3 />
                          {language === 'vi' ? 'Nhận xét của bạn' : 'Your Review'}
                        </div>
                        <ReviewTextArea
                          placeholder={language === 'vi' ? 'Chia sẻ trải nghiệm làm việc của bạn...' : 'Share your work experience...'}
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                        />
                      </ReviewCategory>
                    </ReviewForm>
                    <ModalActions>
                      <ModalButton
                        className="primary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmitReview}
                        style={{ opacity: (ratings.environment && ratings.attitude && ratings.accuracy) ? 1 : 0.5 }}
                        disabled={!ratings.environment || !ratings.attitude || !ratings.accuracy}
                      >
                        <CheckCircle />
                        {language === 'vi' ? 'Gửi đánh giá' : 'Submit Review'}
                      </ModalButton>
                    </ModalActions>
                  </>
                ) : (
                  <>
                    <ReviewSubmittedMessage
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="icon-wrapper">
                        <CheckCircle />
                      </div>
                      <h3>{language === 'vi' ? 'Cảm ơn bạn đã đánh giá!' : 'Thank you for your review!'}</h3>
                      <p>{language === 'vi' ? 'Đánh giá của bạn sẽ giúp cộng đồng ứng viên tìm được công việc tốt hơn.' : 'Your review helps other candidates find better jobs.'}</p>
                    </ReviewSubmittedMessage>
                    <ModalActions>
                      <ModalButton
                        className="primary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCloseModal}
                      >
                        {language === 'vi' ? 'Hoàn tất' : 'Done'}
                      </ModalButton>
                    </ModalActions>
                  </>
                )}
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Recent Applications - compact */}
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <SectionHeader>
            <h2>
              <FileText />
              {language === 'vi' ? 'Đơn Ứng Tuyển Của Bạn Gần Đây' : 'Your Recent Applications'}
            </h2>
          </SectionHeader>

          {recentApplications.map((app, index) => (
            <ApplicationCard
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.08 }}
              whileHover={{ scale: 1.01 }}
            >
              <ApplicationHeader>
                <ApplicationInfo>
                  <h4>{app.title} {app.urgent && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', background: '#FEE2E2', color: '#EF4444', borderRadius: '20px', fontSize: '10px', fontWeight: 700, marginLeft: '6px', border: '1px solid #FECACA' }}>● {language === 'vi' ? 'Tuyển Gấp' : 'Urgent'}</span>}</h4>
                  <p>{app.company}</p>
                </ApplicationInfo>
                <StatusBadge status={app.status} />
              </ApplicationHeader>
              <ApplicationMeta>
                <span>
                  <Clock />
                  {app.appliedDate}
                </span>
                <span>
                  <Eye />
                  {language === 'vi' ? 'Xem chi tiết' : 'View details'}
                </span>
              </ApplicationMeta>
            </ApplicationCard>
          ))}
        </Section>

        {/* Stats Overview moved to TopInfoRow */}

        {/* Main Content Grid */}
        <ContentGrid>
          {/* Recommended Jobs */}
          <Section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SectionHeader>
              <h2>
                <Target />
                {language === 'vi' ? 'Việc Làm Phù Hợp Với Bạn' : 'Recommended Jobs'}
              </h2>
              <Link to="/candidate/jobs">
                {language === 'vi' ? 'Xem tất cả' : 'View all'}
                <ArrowUpRight />
              </Link>
            </SectionHeader>
            
            <JobsGrid>
              {recommendedJobs.map((job, index) => (
                <RecommendedJobCard
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <JobHeader>
                    <CompanyLogo>
                      {job.company.charAt(0)}
                    </CompanyLogo>
                    <JobInfo>
                      <h4>{translateJobTitle(job.title)}</h4>
                      <p>{job.company}</p>
                    </JobInfo>
                  </JobHeader>
                  <JobDetails>
                    <span>
                      <MapPin />
                      {translateLocation(job.location)}
                    </span>
                    <span>
                      <DollarSign />
                      {translateSalary(job.salary)}
                    </span>
                    <span>
                      <Clock />
                      {translatePostedAt(job.postedAt)}
                    </span>
                  </JobDetails>
                  <JobTags>
                    {job.tags.map((tag, idx) => (
                      <span key={idx}>{translateTag(tag)}</span>
                    ))}
                  </JobTags>
                </RecommendedJobCard>
              ))}
            </JobsGrid>
          </Section>

          {/* Activity Feed */}
          <Section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SectionHeader>
              <h2>
                <Bell />
                {language === 'vi' ? 'Hoạt Động' : 'Activity'}
              </h2>
            </SectionHeader>
            
            <ActivityFeed>
              {activities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <ActivityItem
                    key={index}
                    $color={activity.color}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <ActivityIcon $color={activity.color}>
                      <IconComponent />
                    </ActivityIcon>
                    <ActivityContent>
                      <h5>{activity.title}</h5>
                      <p>{activity.time}</p>
                    </ActivityContent>
                  </ActivityItem>
                );
              })}
            </ActivityFeed>
          </Section>
        </ContentGrid>

      </DashboardContainer>
    </DashboardLayout>
  );
};

export default CandidateDashboard;
