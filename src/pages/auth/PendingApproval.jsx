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
        
        <Title>Tài Khoản Đang Được Duyệt</Title>
        <Subtitle>
          Cảm ơn bạn đã đăng ký! Tài khoản nhà tuyển dụng của bạn hiện đang được đội ngũ của chúng tôi xem xét. 
          Quá trình này thường mất 24-48 giờ.
        </Subtitle>

        <InfoBox>
          <InfoItem>
            <CheckCircle />
            <div>
              <strong>Email Đã Xác Thực</strong>
              <span>Email của bạn đã được xác thực thành công</span>
            </div>
          </InfoItem>
          <InfoItem>
            <CheckCircle />
            <div>
              <strong>Đơn Đăng Ký Đã Gửi</strong>
              <span>Thông tin công ty của bạn đã được nhận</span>
            </div>
          </InfoItem>
          <InfoItem>
            <Clock />
            <div>
              <strong>Đang Chờ Quản Trị Viên Duyệt</strong>
              <span>Đội ngũ của chúng tôi đang xác minh thông tin công ty của bạn</span>
            </div>
          </InfoItem>
        </InfoBox>

        <Timeline>
          <TimelineTitle>Tiếp Theo Sẽ Diễn Ra Gì?</TimelineTitle>
          
          <TimelineItem>
            <TimelineIcon $completed>
              <CheckCircle />
            </TimelineIcon>
            <TimelineContent>
              <h4>Email Xác Nhận Đã Gửi</h4>
              <p>Bạn sẽ nhận được email xác nhận ngay lập tức</p>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineIcon>
              <Clock />
            </TimelineIcon>
            <TimelineContent>
              <h4>Quản Trị Viên Duyệt (24-48 giờ)</h4>
              <p>Chúng tôi sẽ xác minh thông tin công ty của bạn</p>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineIcon>
              <Clock />
            </TimelineIcon>
            <TimelineContent>
              <h4>Thông Báo Phê Duyệt</h4>
              <p>Bạn sẽ được thông báo khi tài khoản được phê duyệt</p>
            </TimelineContent>
          </TimelineItem>
        </Timeline>

        <ButtonGroup>
          <Button as={Link} to="/" $variant="secondary" $fullWidth>
            Về Trang Chủ
          </Button>
          <Button as={Link} to="/login" $variant="primary" $fullWidth>
            Đăng Nhập
          </Button>
        </ButtonGroup>
      </ApprovalCard>
    </ApprovalContainer>
  );
};

export default PendingApproval;
