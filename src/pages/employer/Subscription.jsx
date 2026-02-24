import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/FormElements';
import { Check, Zap, Star, Rocket, Sparkles, TrendingUp } from 'lucide-react';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const SubscriptionContainer = styled.div`
  max-width: 1400px;
  position: relative;
`;

const FloatingShape = styled(motion.div)`
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.15;
  animation: ${float} ${props => props.$duration || '8s'} ease-in-out infinite;
  animation-delay: ${props => props.$delay || '0s'};
  background: ${props => props.$color || props.theme.colors.primary};
`;

const PageHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
  
  h1 {
    font-size: 42px;
    font-weight: 800;
    margin-bottom: 16px;
    color: ${props => props.theme.colors.text};
    letter-spacing: -1px;
  }
  
  p {
    font-size: 18px;
    color: ${props => props.theme.colors.textLight};
    max-width: 600px;
    margin: 0 auto;
    font-weight: 500;
  }
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  position: relative;
  z-index: 1;
`;

const PricingCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border: 3px solid ${props => props.$featured ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 36px 28px;
  text-align: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$featured 
    ? `0 20px 60px ${props.theme.colors.primary}20` 
    : props.theme.shadows.card};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${props => {
      if (props.$featured) return props.theme.colors.primary;
      if (props.$color) return props.$color;
      return props.theme.colors.textLight;
    }};
    opacity: ${props => props.$featured ? 1 : 0.5};
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 30px 80px ${props => props.$featured 
      ? props.theme.colors.primary + '30' 
      : 'rgba(0,0,0,0.15)'};
    border-color: ${props => props.$color || props.theme.colors.primary};
    
    &::after {
      left: 100%;
    }
  }
`;

const Badge = styled(motion.div)`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 8px 24px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 4px 15px ${props => props.theme.colors.primary}40;
  display: flex;
  align-items: center;
  gap: 6px;
  background-clip: padding-box;
  -webkit-background-clip: padding-box;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const PlanIcon = styled(motion.div)`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: ${props => props.$color || props.theme.colors.primary}15;
  border-radius: ${props => props.theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid ${props => props.$color || props.theme.colors.primary}30;
  
  svg {
    width: 36px;
    height: 36px;
    color: ${props => props.$color || props.theme.colors.primary};
  }
`;

const PlanName = styled.h3`
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.text};
  letter-spacing: -0.5px;
`;

const PriceContainer = styled.div`
  margin: 24px 0;
  padding: 20px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;
`;

const Price = styled.div`
  font-size: 52px;
  font-weight: 900;
  color: ${props => props.$color || props.theme.colors.primary};
  line-height: 1;
  letter-spacing: -2px;
  
  .amount {
    display: inline-block;
  }
  
  .currency {
    font-size: 22px;
    font-weight: 700;
    margin-left: 4px;
    opacity: 0.8;
  }
`;

const Period = styled.div`
  font-size: 15px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 600;
  margin-top: 8px;
`;

const Features = styled.ul`
  text-align: left;
  margin: 28px 0;
  
  li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 0;
    font-size: 15px;
    font-weight: 500;
    color: ${props => props.theme.colors.text};
    border-bottom: 1px solid ${props => props.theme.colors.border};
    transition: all 0.3s ease;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      padding-left: 8px;
      background: ${props => props.theme.colors.bgDark};
      margin: 0 -8px;
      padding-left: 16px;
      padding-right: 8px;
      border-radius: ${props => props.theme.borderRadius.md};
    }
    
    svg {
      width: 22px;
      height: 22px;
      color: ${props => props.theme.colors.success};
      flex-shrink: 0;
      margin-top: 2px;
    }
  }
`;

const Subscription = () => {
  const plans = [
    {
      name: 'Cơ Bản',
      price: '1.2 triệu',
      currency: 'VND',
      period: '/tháng',
      icon: Zap,
      color: '#10B981',
      features: [
        '5 tin tuyển dụng',
        '50 hồ sơ ứng tuyển',
        'Hỗ trợ cơ bản',
        'Bảng điều khiển phân tích',
      ]
    },
    {
      name: 'Chuyên Nghiệp',
      price: '2.3 triệu',
      currency: 'VND',
      period: '/tháng',
      icon: Star,
      color: '#0E3995',
      features: [
        '20 tin tuyển dụng',
        'Hồ sơ ứng tuyển không giới hạn',
        'Hỗ trợ ưu tiên',
        'Phân tích nâng cao',
        'Tin nổi bật',
      ],
      featured: true
    },
    {
      name: 'Doanh Nghiệp',
      price: '4.5 triệu',
      currency: 'VND',
      period: '/tháng',
      icon: Rocket,
      color: '#F59E0B',
      features: [
        'Tin tuyển dụng không giới hạn',
        'Hồ sơ ứng tuyển không giới hạn',
        'Hỗ trợ 24/7',
        'Phân tích tùy chỉnh',
        'Truy cập API',
        'Quản lý riêng',
      ]
    }
  ];

  return (
    <DashboardLayout role="employer" showSearch={false}>
      <SubscriptionContainer>
        {/* Floating Decorative Shapes */}
        <FloatingShape
          $color="#0E3995"
          $duration="10s"
          $delay="0s"
          style={{ 
            width: '180px', 
            height: '180px', 
            top: '10%', 
            left: '5%' 
          }}
        />
        <FloatingShape
          $color="#F59E0B"
          $duration="12s"
          $delay="1s"
          style={{ 
            width: '120px', 
            height: '120px', 
            top: '60%', 
            right: '8%' 
          }}
        />
        <FloatingShape
          $color="#10B981"
          $duration="15s"
          $delay="2s"
          style={{ 
            width: '150px', 
            height: '150px', 
            bottom: '15%', 
            left: '10%' 
          }}
        />

        <PageHeader
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Chọn Gói Của Bạn</h1>
          <p>Chọn gói phù hợp cho nhu cầu tuyển dụng</p>
        </PageHeader>

        <PricingGrid>
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <PricingCard 
                key={index} 
                $featured={plan.featured}
                $color={plan.color}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ scale: 1.03 }}
              >
                {plan.featured && (
                  <Badge
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <Sparkles />
                    Phổ Biến Nhất
                  </Badge>
                )}
                
                <PlanIcon 
                  $color={plan.color}
                  whileHover={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <IconComponent />
                </PlanIcon>

                <PlanName>{plan.name}</PlanName>
                
                <PriceContainer>
                  <Price $color={plan.color}>
                    <span className="amount">{plan.price}</span>
                    <span className="currency">{plan.currency}</span>
                  </Price>
                  <Period>{plan.period}</Period>
                </PriceContainer>

                <Features>
                  {plan.features.map((feature, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + (idx * 0.1) }}
                    >
                      <Check />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </Features>

                <Button 
                  as={motion.button}
                  $variant={plan.featured ? 'primary' : 'secondary'} 
                  $fullWidth
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.featured ? 'Bắt Đầu Ngay' : 'Chọn Gói'}
                </Button>
              </PricingCard>
            );
          })}
        </PricingGrid>
      </SubscriptionContainer>
    </DashboardLayout>
  );
};

export default Subscription;
