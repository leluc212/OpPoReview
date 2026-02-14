import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/FormElements';
import { Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

const SubscriptionContainer = styled.div`
  max-width: 1200px;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
  
  h1 {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 18px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
`;

const PricingCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border: 2px solid ${props => props.$featured ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 40px 32px;
  text-align: center;
  position: relative;
  
  ${props => props.$featured && `
    transform: scale(1.05);
    box-shadow: ${props.theme.shadows.xl};
  `}
`;

const Badge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.colors.gradientPrimary};
  color: white;
  padding: 6px 20px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
`;

const PlanName = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Price = styled.div`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 8px;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  span {
    font-size: 20px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const Features = styled.ul`
  text-align: left;
  margin: 32px 0;
  
  li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    
    svg {
      width: 20px;
      height: 20px;
      color: ${props => props.theme.colors.success};
      flex-shrink: 0;
    }
  }
`;

const Subscription = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  const plans = [
    {
      name: t.employerSubscription.plans.basic,
      price: '1.2 triệu VND',
      period: t.employerSubscription.priceMonth,
      features: [
        t.employerSubscription.features.jobPosting5,
        t.employerSubscription.features.applications50,
        t.employerSubscription.features.basicSupport,
        t.employerSubscription.features.analytics,
      ]
    },
    {
      name: t.employerSubscription.plans.professional,
      price: '2.3 triệu VND',
      period: t.employerSubscription.priceMonth,
      features: [
        t.employerSubscription.features.jobPosting20,
        t.employerSubscription.features.applicationsUnlimited,
        t.employerSubscription.features.prioritySupport,
        t.employerSubscription.features.advancedAnalytics,
        t.employerSubscription.features.featuredListings,
      ],
      featured: true
    },
    {
      name: t.employerSubscription.plans.enterprise,
      price: '4.5 triệu VND',
      period: t.employerSubscription.priceMonth,
      features: [
        t.employerSubscription.features.jobPostingUnlimited,
        t.employerSubscription.features.applicationsUnlimited,
        t.employerSubscription.features.support247,
        t.employerSubscription.features.customAnalytics,
        t.employerSubscription.features.apiAccess,
        t.employerSubscription.features.dedicatedManager,
      ]
    }
  ];

  return (
    <DashboardLayout role="employer" showSearch={false}>
      <SubscriptionContainer>
        <PageHeader>
          <h1>{t.employerSubscription.title}</h1>
          <p>{t.employerSubscription.subtitle}</p>
        </PageHeader>

        <PricingGrid>
          {plans.map((plan, index) => (
            <PricingCard key={index} $featured={plan.featured}>
              {plan.featured && <Badge>{t.employerSubscription.mostPopular}</Badge>}
              <PlanName>{plan.name}</PlanName>
              <Price>
                {plan.price}
                <span>{plan.period}</span>
              </Price>
              <Features>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <Check />
                    <span>{feature}</span>
                  </li>
                ))}
              </Features>
              <Button $variant={plan.featured ? 'primary' : 'secondary'} $fullWidth>
                {plan.featured ? t.employerSubscription.getStarted : t.employerSubscription.choosePlan}
              </Button>
            </PricingCard>
          ))}
        </PricingGrid>
      </SubscriptionContainer>
    </DashboardLayout>
  );
};

export default Subscription;
