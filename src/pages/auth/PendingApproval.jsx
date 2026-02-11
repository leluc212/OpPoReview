import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/FormElements';

const ApprovalContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  padding: 40px;
`;

const ApprovalCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 64px 48px;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.xl};
`;

const IconWrapper = styled.div`
  width: 96px;
  height: 96px;
  margin: 0 auto 32px;
  background: ${props => props.theme.colors.warningBg};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.warning};
  
  svg {
    width: 48px;
    height: 48px;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text};
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 32px;
  line-height: 1.6;
`;

const InfoBox = styled.div`
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 24px;
  margin-bottom: 32px;
  text-align: left;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: start;
  gap: 12px;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.success};
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  div {
    flex: 1;
    
    strong {
      color: ${props => props.theme.colors.text};
      display: block;
      margin-bottom: 4px;
    }
    
    span {
      color: ${props => props.theme.colors.textLight};
      font-size: 14px;
    }
  }
`;

const Timeline = styled.div`
  text-align: left;
  margin-bottom: 32px;
`;

const TimelineTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 16px;
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TimelineIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$completed ? props.theme.colors.success : props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const TimelineContent = styled.div`
  flex: 1;
  
  h4 {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 4px;
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const PendingApproval = () => {
  return (
    <ApprovalContainer>
      <ApprovalCard
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <IconWrapper>
          <Clock />
        </IconWrapper>
        
        <Title>Account Under Review</Title>
        <Subtitle>
          Thank you for registering! Your employer account is currently being reviewed by our team. 
          This typically takes 24-48 hours.
        </Subtitle>

        <InfoBox>
          <InfoItem>
            <CheckCircle />
            <div>
              <strong>Email Verified</strong>
              <span>Your email has been successfully verified</span>
            </div>
          </InfoItem>
          <InfoItem>
            <CheckCircle />
            <div>
              <strong>Application Submitted</strong>
              <span>Your company information has been received</span>
            </div>
          </InfoItem>
          <InfoItem>
            <Clock />
            <div>
              <strong>Pending Admin Review</strong>
              <span>Our team is verifying your company details</span>
            </div>
          </InfoItem>
        </InfoBox>

        <Timeline>
          <TimelineTitle>What Happens Next?</TimelineTitle>
          
          <TimelineItem>
            <TimelineIcon $completed>
              <CheckCircle />
            </TimelineIcon>
            <TimelineContent>
              <h4>Verification Email Sent</h4>
              <p>You'll receive a confirmation email shortly</p>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineIcon>
              <Clock />
            </TimelineIcon>
            <TimelineContent>
              <h4>Admin Review (24-48 hours)</h4>
              <p>We'll verify your company information</p>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineIcon>
              <Clock />
            </TimelineIcon>
            <TimelineContent>
              <h4>Approval Notification</h4>
              <p>You'll be notified when your account is approved</p>
            </TimelineContent>
          </TimelineItem>
        </Timeline>

        <ButtonGroup>
          <Button as={Link} to="/" $variant="secondary" $fullWidth>
            Back to Home
          </Button>
          <Button as={Link} to="/login" $variant="primary" $fullWidth>
            Go to Login
          </Button>
        </ButtonGroup>
      </ApprovalCard>
    </ApprovalContainer>
  );
};

export default PendingApproval;
