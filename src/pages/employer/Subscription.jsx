import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/FormElements';
import { Check, Zap, Star, Rocket, Sparkles, TrendingUp, X, HelpCircle, CreditCard, Shield, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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
  margin-bottom: 60px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto 60px;
  }
`;

const PricingCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border: 3px solid ${props => props.$featured ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 24px;
  padding: 36px 28px;
  text-align: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$featured 
    ? `0 20px 60px ${props.theme.colors.primary}20` 
    : '0 4px 16px rgba(0, 0, 0, 0.06)'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${props => {
      if (props.$featured) return 'linear-gradient(90deg, #1e40af 0%, #1e40af 100%)';
      if (props.$color) return `linear-gradient(90deg, ${props.$color} 0%, ${props.$color}CC 100%)`;
      return 'linear-gradient(90deg, #94A3B8 0%, #64748B 100%)';
    }};
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
      ? 'rgba(30, 64, 175, 0.3)' 
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
  background: linear-gradient(135deg, #1e40af 0%, #1e40af 100%);
  color: white;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(30, 64, 175, 0.4);
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const PlanIcon = styled(motion.div)`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, ${props => props.$color || props.theme.colors.primary}15 0%, ${props => props.$color || props.theme.colors.primary}08 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid ${props => props.$color || props.theme.colors.primary}30;
  box-shadow: 0 4px 12px ${props => props.$color ? `${props.$color}20` : 'rgba(0, 0, 0, 0.1)'};
  
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
  padding: 20px 12px;
  background: linear-gradient(135deg, ${props => props.theme.colors.bgDark} 0%, ${props => props.theme.colors.bgLight} 100%);
  border-radius: 16px;
  border: 2px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: visible;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Price = styled.div`
  font-size: 38px;
  font-weight: 900;
  background: linear-gradient(135deg, ${props => props.$color || props.theme.colors.primary} 0%, ${props => props.$color ? `${props.$color}CC` : props.theme.colors.primary + 'CC'} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  letter-spacing: -1px;
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
  flex-wrap: nowrap;
  white-space: nowrap;
  width: 100%;
  
  .amount {
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .currency {
    font-size: 28px;
    font-weight: 800;
    white-space: nowrap;
    flex-shrink: 0;
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
  margin: 32px 0;
  background: ${props => props.theme.colors.bgLight};
  border-radius: 16px;
  padding: 12px 8px;
  
  li {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 14px;
    font-size: 15px;
    font-weight: 500;
    color: ${props => props.theme.colors.text};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 12px;
    margin-bottom: 6px;
    position: relative;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &:hover {
      background: ${props => props.theme.colors.bgDark};
      padding-left: 20px;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      
      svg {
        transform: scale(1.2) rotate(5deg);
      }
    }
    
    svg {
      width: 20px;
      height: 20px;
      color: #10B981;
      flex-shrink: 0;
      background: linear-gradient(135deg, #10B98120 0%, #10B98110 100%);
      padding: 6px;
      border-radius: 8px;
      width: 32px;
      height: 32px;
      transition: all 0.3s ease;
    }
    
    span {
      flex: 1;
    }
  }
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  margin-top: 8px;
  
  ${props => props.$featured ? `
    background: linear-gradient(135deg, #1e40af 0%, #1e40af 100%);
    color: white;
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.35);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(30, 64, 175, 0.45);
    }
  ` : `
    background: ${props.theme.colors.bgLight};
    color: ${props.theme.colors.text};
    border: 2px solid ${props.theme.colors.border};
    
    &:hover {
      border-color: ${props.theme.colors.primary};
      color: ${props.theme.colors.primary};
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(30, 64, 175, 0.2);
    }
  `}
`;

const ComparisonSection = styled.div`
  margin-top: 60px;
  padding: 40px;
  background: ${props => props.theme.colors.bgLight};
  border-radius: 24px;
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
`;

const ComparisonTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #1e40af 0%, #1e40af 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ComparisonTable = styled.div`
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    
    thead {
      tr {
        th {
          padding: 20px 16px;
          text-align: center;
          font-weight: 700;
          font-size: 16px;
          background: linear-gradient(135deg, ${props => props.theme.colors.bgDark} 0%, ${props => props.theme.colors.bgLight} 100%);
          border-bottom: 3px solid ${props => props.theme.colors.primary};
          
          &:first-child {
            text-align: left;
            border-top-left-radius: 12px;
          }
          
          &:last-child {
            border-top-right-radius: 12px;
          }
        }
      }
    }
    
    tbody {
      tr {
        transition: all 0.3s ease;
        
        &:hover {
          background: ${props => props.theme.colors.bgLight};
        }
        
        td {
          padding: 18px 16px;
          text-align: center;
          border-bottom: 1px solid ${props => props.theme.colors.border};
          font-size: 15px;
          
          &:first-child {
            text-align: left;
            font-weight: 600;
            color: ${props => props.theme.colors.text};
          }
          
          svg {
            color: #10B981;
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
`;

const FAQSection = styled.div`
  margin-top: 60px;
  padding: 40px;
  background: linear-gradient(135deg, ${props => props.theme.colors.bgDark} 0%, ${props => props.theme.colors.bgLight} 100%);
  border-radius: 24px;
  border: 2px solid ${props => props.theme.colors.border};
`;

const FAQItem = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  border: 2px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.15);
    transform: translateY(-2px);
  }
  
  h3 {
    font-size: 17px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    
    svg {
      color: ${props => props.theme.colors.primary};
      width: 20px;
      height: 20px;
    }
  }
  
  p {
    font-size: 15px;
    color: ${props => props.theme.colors.textLight};
    line-height: 1.7;
  }
`;

const Subscription = () => {
  const { language } = useLanguage();
  const plans = [
    {
      name: language === 'vi' ? 'Cơ Bản' : 'Basic',
      price: language === 'vi' ? '1.2 triệu' : '1.2 million',
      currency: 'VND',
      period: language === 'vi' ? '/tháng' : '/month',
      icon: Zap,
      color: '#10B981',
      features: [
        language === 'vi' ? '5 tin tuyển dụng' : '5 job posts',
        language === 'vi' ? '50 hồ sơ ứng tuyển' : '50 applications',
        language === 'vi' ? 'Hỗ trợ cơ bản' : 'Basic support',
        language === 'vi' ? 'Bảng điều khiển phân tích' : 'Analytics dashboard',
      ]
    },
    {
      name: language === 'vi' ? 'Chuyên Nghiệp' : 'Professional',
      price: language === 'vi' ? '2.3 triệu' : '2.3 million',
      currency: 'VND',
      period: language === 'vi' ? '/tháng' : '/month',
      icon: Star,
      color: '#1e40af',
      features: [
        language === 'vi' ? '20 tin tuyển dụng' : '20 job posts',
        language === 'vi' ? 'Hồ sơ ứng tuyển không giới hạn' : 'Unlimited applications',
        language === 'vi' ? 'Hỗ trợ ưu tiên' : 'Priority support',
        language === 'vi' ? 'Phân tích nâng cao' : 'Advanced analytics',
        language === 'vi' ? 'Tin nổi bật' : 'Featured posting',
      ],
      featured: true
    },
    {
      name: language === 'vi' ? 'Doanh Nghiệp' : 'Enterprise',
      price: language === 'vi' ? '4.5 triệu' : '4.5 million',
      currency: 'VND',
      period: language === 'vi' ? '/tháng' : '/month',
      icon: Rocket,
      color: '#F59E0B',
      features: [
        language === 'vi' ? 'Tin tuyển dụng không giới hạn' : 'Unlimited job posts',
        language === 'vi' ? 'Hồ sơ ứng tuyển không giới hạn' : 'Unlimited applications',
        language === 'vi' ? 'Hỗ trợ 24/7' : '24/7 support',
        language === 'vi' ? 'Phân tích tùy chỉnh' : 'Custom analytics',
        language === 'vi' ? 'Truy cập API' : 'API access',
        language === 'vi' ? 'Quản lý riêng' : 'Dedicated manager',
      ]
    }
  ];

  return (
    <DashboardLayout role="employer" showSearch={false}>
      <SubscriptionContainer>
        <PageHeader
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>{language === 'vi' ? 'Chọn Gói Của Bạn' : 'Choose Your Plan'}</h1>
          <p>{language === 'vi' ? 'Chọn gói phù hợp cho nhu cầu tuyển dụng' : 'Choose the right plan for your hiring needs'}</p>
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
                    {language === 'vi' ? 'Phổ Biến Nhất' : 'Most Popular'}
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

                <ActionButton
                  $featured={plan.featured}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.featured ? (
                    <>
                      <Sparkles size={18} />
                      {language === 'vi' ? 'Bắt Đầu Ngay' : 'Start Now'}
                    </>
                  ) : (
                    language === 'vi' ? 'Chọn Gói' : 'Select Plan'
                  )}
                </ActionButton>
              </PricingCard>
            );
          })}
        </PricingGrid>

        {/* Comparison Section */}
        <ComparisonSection>
          <ComparisonTitle>{language === 'vi' ? 'So Sánh Chi Tiết Các Gói' : 'Detailed Plan Comparison'}</ComparisonTitle>
          <ComparisonTable>
            <table>
              <thead>
                <tr>
                  <th>{language === 'vi' ? 'Tính Năng' : 'Feature'}</th>
                  <th>{language === 'vi' ? 'Cơ Bản' : 'Basic'}</th>
                  <th>{language === 'vi' ? 'Chuyên Nghiệp' : 'Professional'}</th>
                  <th>{language === 'vi' ? 'Doanh Nghiệp' : 'Enterprise'}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{language === 'vi' ? 'Số tin tuyển dụng' : 'Job posts'}</td>
                  <td>5</td>
                  <td>20</td>
                  <td>{language === 'vi' ? 'Không giới hạn' : 'Unlimited'}</td>
                </tr>
                <tr>
                  <td>{language === 'vi' ? 'Hồ sơ ứng tuyển' : 'Applications'}</td>
                  <td>50</td>
                  <td>{language === 'vi' ? 'Không giới hạn' : 'Unlimited'}</td>
                  <td>{language === 'vi' ? 'Không giới hạn' : 'Unlimited'}</td>
                </tr>
                <tr>
                  <td>{language === 'vi' ? 'Tin nổi bật' : 'Featured posting'}</td>
                  <td><X color="#EF4444" /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td>{language === 'vi' ? 'Phân tích nâng cao' : 'Advanced analytics'}</td>
                  <td><X color="#EF4444" /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td>{language === 'vi' ? 'Truy cập API' : 'API access'}</td>
                  <td><X color="#EF4444" /></td>
                  <td><X color="#EF4444" /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td>{language === 'vi' ? 'Hỗ trợ' : 'Support'}</td>
                  <td>{language === 'vi' ? 'Cơ bản' : 'Basic'}</td>
                  <td>{language === 'vi' ? 'Ưu tiên' : 'Priority'}</td>
                  <td>24/7</td>
                </tr>
                <tr>
                  <td>{language === 'vi' ? 'Quản lý riêng' : 'Dedicated manager'}</td>
                  <td><X color="#EF4444" /></td>
                  <td><X color="#EF4444" /></td>
                  <td><Check /></td>
                </tr>
              </tbody>
            </table>
          </ComparisonTable>
        </ComparisonSection>

        {/* FAQ Section */}
        <FAQSection>
          <ComparisonTitle>{language === 'vi' ? 'Câu Hỏi Thường Gặp' : 'Frequently Asked Questions'}</ComparisonTitle>
          <FAQItem
            whileHover={{ scale: 1.01 }}
          >
            <h3><CreditCard /> {language === 'vi' ? 'Các phương thức thanh toán nào được chấp nhận?' : 'Which payment methods are accepted?'}</h3>
            <p>{language === 'vi' ? 'Chúng tôi chấp nhận thẻ tín dụng, thẻ ghi nợ, chuyển khoản ngân hàng và ví điện tử. Tất cả giao dịch đều được bảo mật SSL 256-bit.' : 'We accept credit cards, debit cards, bank transfer, and e-wallets. All transactions are protected with 256-bit SSL security.'}</p>
          </FAQItem>
          <FAQItem
            whileHover={{ scale: 1.01 }}
          >
            <h3><Shield /> {language === 'vi' ? 'Tôi có thể hủy đăng ký bất cứ lúc nào không?' : 'Can I cancel my subscription anytime?'}</h3>
            <p>{language === 'vi' ? 'Có, bạn có thể hủy đăng ký bất cứ lúc nào. Không có phí hủy và bạn vẫn có thể sử dụng dịch vụ cho đến hết kỳ thanh toán.' : 'Yes. You can cancel at any time with no cancellation fee, and still use the service until the end of your billing cycle.'}</p>
          </FAQItem>
          <FAQItem
            whileHover={{ scale: 1.01 }}
          >
            <h3><Clock /> {language === 'vi' ? 'Tôi có thể nâng cấp hoặc hạ cấp gói không?' : 'Can I upgrade or downgrade my plan?'}</h3>
            <p>{language === 'vi' ? 'Tất nhiên! Bạn có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào. Chúng tôi sẽ tính toán tỷ lệ cho thời gian còn lại.' : 'Absolutely. You can upgrade or downgrade anytime, and we will prorate based on remaining time.'}</p>
          </FAQItem>
          <FAQItem
            whileHover={{ scale: 1.01 }}
          >
            <h3><HelpCircle /> {language === 'vi' ? 'Có hỗ trợ khách hàng không?' : 'Is customer support available?'}</h3>
            <p>{language === 'vi' ? 'Có, tất cả các gói đều có hỗ trợ khách hàng. Gói Chuyên Nghiệp có hỗ trợ ưu tiên và gói Doanh Nghiệp có hỗ trợ 24/7 qua điện thoại, email và chat.' : 'Yes, all plans include customer support. Professional has priority support, and Enterprise includes 24/7 phone, email, and chat support.'}</p>
          </FAQItem>
        </FAQSection>
      </SubscriptionContainer>
    </DashboardLayout>
  );
};

export default Subscription;
