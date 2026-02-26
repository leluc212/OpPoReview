import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { Input, TextArea, Label, Button } from '../../components/FormElements';
import { HelpCircle, Mail, Phone, Clock, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const PageContainer = styled.div`
  animation: fadeIn 0.5s ease-in;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 16px;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 28px;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  .icon {
    width: 48px;
    height: 48px;
    border-radius: ${props => props.theme.borderRadius.md};
    background: ${props => props.theme.colors.gradientPrimary};
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 24px;
      height: 24px;
      color: white;
    }
  }
  
  h2 {
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FAQItem = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FAQQuestion = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: ${props => props.$isOpen ? props.theme.colors.bgDark : props.theme.colors.bgLight};
  transition: all ${props => props.theme.transitions.fast};
  
  h4 {
    font-size: 15px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.primary};
    transition: transform ${props => props.theme.transitions.fast};
  }
  
  &:hover {
    background: ${props => props.theme.colors.bgLight};
  }
`;

const FAQAnswer = styled.div`
  padding: ${props => props.$isOpen ? '16px 20px' : '0 20px'};
  max-height: ${props => props.$isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all ${props => props.theme.transitions.normal};
  color: ${props => props.theme.colors.textLight};
  font-size: 14px;
  line-height: 1.6;
  border-top: ${props => props.$isOpen ? `1px solid ${props.theme.colors.border}` : 'none'};
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ContactCard = styled(Card)`
  padding: 24px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: start;
  gap: 16px;
  padding: 16px 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  }
  
  .icon {
    width: 40px;
    height: 40px;
    border-radius: ${props => props.theme.borderRadius.md};
    background: ${props => props.theme.colors.bgLight};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    svg {
      width: 20px;
      height: 20px;
      color: ${props => props.theme.colors.primary};
    }
  }
  
  .info {
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
  }
`;

const EmployerSupport = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: language === 'vi' ? 'Làm thế nào để đăng tin tuyển dụng?' : 'How do I post a new job?',
      answer: language === 'vi' ? 'Bạn có thể đăng tin tuyển dụng bằng cách vào mục "Quản lý công việc" và nhấn nút "Đăng tin mới". Điền đầy đủ thông tin công việc, mô tả chi tiết và yêu cầu ứng viên.' : 'You can post a job by going to "Job Management" and clicking "Post New Job". Fill in all required details, job description, and candidate requirements.'
    },
    {
      question: language === 'vi' ? 'Tôi có thể xem ứng viên đã ứng tuyển ở đâu?' : 'Where can I view candidates who applied?',
      answer: language === 'vi' ? 'Tất cả ứng viên đã ứng tuyển vào công việc của bạn sẽ hiển thị trong mục "Ứng tuyển". Bạn có thể xem hồ sơ, lọc và quản lý ứng viên tại đây.' : 'All candidates who applied to your jobs are listed in "Applications". You can view profiles, filter, and manage candidates there.'
    },
    {
      question: language === 'vi' ? 'Chi phí đăng tin tuyển dụng là bao nhiêu?' : 'How much does job posting cost?',
      answer: language === 'vi' ? 'Chi phí phụ thuộc vào gói dịch vụ bạn đăng ký. Vui lòng xem chi tiết tại mục "Gói đăng ký" để chọn gói phù hợp với nhu cầu của bạn.' : 'Cost depends on your subscription plan. Please check "Subscription" for plan details and choose what fits your hiring needs.'
    },
    {
      question: language === 'vi' ? 'Làm thế nào để nâng cấp tài khoản?' : 'How can I upgrade my account?',
      answer: language === 'vi' ? 'Bạn có thể nâng cấp tài khoản bằng cách vào mục "Gói đăng ký" và chọn gói Premium hoặc Enterprise. Hệ thống sẽ hướng dẫn bạn qua các bước thanh toán.' : 'You can upgrade your account in "Subscription" by selecting Premium or Enterprise. The system will guide you through payment steps.'
    },
    {
      question: language === 'vi' ? 'Tôi có thể chỉnh sửa tin đăng sau khi đã đăng không?' : 'Can I edit a job after posting?',
      answer: language === 'vi' ? 'Có, bạn hoàn toàn có thể chỉnh sửa tin đăng tuyển dụng bất cứ lúc nào. Vào "Quản lý công việc", chọn tin cần sửa và nhấn "Chỉnh sửa".' : 'Yes, you can edit posted jobs anytime. Go to "Job Management", select the post, then click "Edit".'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Support ticket:', formData);
    alert(language === 'vi' ? 'Câu hỏi của bạn đã được gửi! Chúng tôi sẽ phản hồi sớm nhất.' : 'Your question has been sent! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <DashboardLayout role="employer">
      <PageContainer>
        <PageHeader>
          <h1>{language === 'vi' ? 'Trung tâm hỗ trợ' : 'Support Center'}</h1>
          <p>{language === 'vi' ? 'Chúng tôi luôn sẵn sàng hỗ trợ bạn' : 'We are always ready to support you'}</p>
        </PageHeader>

        <ContentGrid>
          <MainContent>
            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <div className="icon">
                  <HelpCircle />
                </div>
                <h2>{language === 'vi' ? 'Câu hỏi thường gặp' : 'Frequently Asked Questions'}</h2>
              </CardHeader>

              <FAQList>
                {faqs.map((faq, index) => (
                  <FAQItem key={index}>
                    <FAQQuestion
                      $isOpen={openFAQ === index}
                      onClick={() => toggleFAQ(index)}
                    >
                      <h4>{faq.question}</h4>
                      {openFAQ === index ? <ChevronUp /> : <ChevronDown />}
                    </FAQQuestion>
                    <FAQAnswer $isOpen={openFAQ === index}>
                      {faq.answer}
                    </FAQAnswer>
                  </FAQItem>
                ))}
              </FAQList>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <div className="icon">
                  <MessageSquare />
                </div>
                <h2>{language === 'vi' ? 'Gửi câu hỏi' : 'Send a Question'}</h2>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>{language === 'vi' ? 'Họ và tên' : 'Full name'}</Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder={language === 'vi' ? 'Nhập họ và tên của bạn' : 'Enter your full name'}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Chủ đề' : 'Subject'}</Label>
                  <Input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder={language === 'vi' ? 'Vấn đề bạn cần hỗ trợ' : 'Issue you need help with'}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Nội dung' : 'Message'}</Label>
                  <TextArea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder={language === 'vi' ? 'Mô tả chi tiết vấn đề của bạn...' : 'Describe your issue in detail...'}
                    rows={6}
                    required
                  />
                </FormGroup>

                <Button type="submit" variant="primary">
                  <MessageSquare size={18} />
                  {language === 'vi' ? 'Gửi câu hỏi' : 'Send Question'}
                </Button>
              </form>
            </Card>
          </MainContent>

          {/* Sidebar */}
          <Sidebar>
            <ContactCard>
              <CardHeader style={{ marginBottom: '16px', paddingBottom: '16px' }}>
                <h2 style={{ fontSize: '18px' }}>{language === 'vi' ? 'Thông tin liên hệ' : 'Contact Information'}</h2>
              </CardHeader>

              <ContactItem>
                <div className="icon">
                  <Mail />
                </div>
                <div className="info">
                  <h4>Email</h4>
                  <p>support@oppo.vn</p>
                </div>
              </ContactItem>

              <ContactItem>
                <div className="icon">
                  <Phone />
                </div>
                <div className="info">
                  <h4>Hotline</h4>
                  <p>1900 xxxx</p>
                </div>
              </ContactItem>

              <ContactItem>
                <div className="icon">
                  <Clock />
                </div>
                <div className="info">
                  <h4>{language === 'vi' ? 'Giờ làm việc' : 'Working hours'}</h4>
                  <p>{language === 'vi' ? 'T2 - T6: 8:00 - 17:00' : 'Mon - Fri: 8:00 - 17:00'}</p>
                  <p>{language === 'vi' ? 'T7: 8:00 - 12:00' : 'Sat: 8:00 - 12:00'}</p>
                </div>
              </ContactItem>
            </ContactCard>
          </Sidebar>
        </ContentGrid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default EmployerSupport;
