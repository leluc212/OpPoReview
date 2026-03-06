import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { Input, TextArea, Label, Button } from '../../components/FormElements';
import { HelpCircle, Mail, Phone, Clock, MessageSquare, ChevronDown, ChevronUp, LifeBuoy } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const PageContainer = styled(motion.div)`
  width: 100%;
`;

const PageHeader = styled.div`
  margin-bottom: 28px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const PageTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PageIconBox = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 15px;
  background: #EFF6FF;
  border: 1.5px solid #BFDBFE;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
    color: #1e40af;
  }
`;

const PageTitleText = styled.div`
  h1 {
    font-size: 26px;
    font-weight: 800;
    color: ${props => props.theme.colors.text};
    letter-spacing: -0.5px;
    line-height: 1.2;
    margin-bottom: 4px;
  }

  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 13.5px;
    font-weight: 500;
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

const Card = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.04);
  transition: all 0.22s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.12);
    border-color: #BFDBFE;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1.5px solid #E8EFFF;
  
  .icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #EFF6FF;
    border: 1.5px solid #BFDBFE;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 20px;
      height: 20px;
      color: #1e40af;
    }
  }
  
  h2 {
    font-size: 18px;
    font-weight: 700;
    color: #1E293B;
  }
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FAQItem = styled.div`
  border: 1.5px solid ${props => props.$isOpen ? '#BFDBFE' : '#E8EFFF'};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.22s ease;
  background: ${props => props.$isOpen ? '#FAFBFF' : '#ffffff'};
  
  &:hover {
    border-color: #BFDBFE;
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.05);
  }
`;

const FAQQuestion = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: transparent;
  transition: all 0.22s ease;
  
  h4 {
    font-size: 15px;
    font-weight: 700;
    color: #1E293B;
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: #1e40af;
    transition: transform 0.2s ease;
  }
`;

const FAQAnswer = styled.div`
  padding: ${props => props.$isOpen ? '0 20px 20px 20px' : '0 20px'};
  max-height: ${props => props.$isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
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
    border-bottom: 1.5px dashed #E8EFFF;
  }
  
  .icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #EFF6FF;
    border: 1.5px solid #BFDBFE;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;
    
    svg {
      width: 20px;
      height: 20px;
      color: #1e40af;
    }
  }
  
  .info {
    flex: 1;
    h4 {
      font-size: 14px;
      font-weight: 700;
      color: #1E293B;
      margin-bottom: 4px;
    }
    
    p {
      font-size: 13.5px;
      color: #475569;
      line-height: 1.5;
    }
  }
  
  &:hover .icon {
    background: #1e40af;
    border-color: #1e40af;
    svg { color: white; }
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
      <PageContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PageHeader>
          <PageTitleGroup>
            <PageIconBox>
              <LifeBuoy />
            </PageIconBox>
            <PageTitleText>
              <h1>{language === 'vi' ? 'Trung tâm hỗ trợ' : 'Support Center'}</h1>
              <p>{language === 'vi' ? 'Chúng tôi luôn sẵn sàng hỗ trợ bạn' : 'We are always ready to support you'}</p>
            </PageTitleText>
          </PageTitleGroup>
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
