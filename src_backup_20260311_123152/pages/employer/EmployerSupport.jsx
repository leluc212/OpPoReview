import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import { Input, TextArea, Label, Button, FormGroup } from '../../components/FormElements';
import {
  HelpCircle, Mail, Phone, Clock, MessageSquare, ChevronDown, ChevronUp,
  FileQuestion, Send, X, Headphones
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
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
  svg { width: 24px; height: 24px; color: #1e40af; }
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
  @media (max-width: 968px) { grid-template-columns: 1fr; }
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
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.10);
    border-color: #BFDBFE;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1.5px solid #E8EFFF;
`;

const SectionIconBox = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #EFF6FF;
  border: 1.5px solid #BFDBFE;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  svg { width: 20px; height: 20px; color: #1e40af; }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FAQItem = styled.div`
  border: 1.5px solid ${props => props.$isOpen ? '#BFDBFE' : '#E8EFFF'};
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.22s ease;
  background: ${props => props.$isOpen ? '#F8FBFF' : '#ffffff'};
  &:hover { border-color: #BFDBFE; }
`;

const FAQQuestion = styled.button`
  width: 100%;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: transparent;
  border: none;
  text-align: left;
  gap: 12px;

  h4 {
    font-size: 14.5px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    flex: 1;
  }

  .chevron-box {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: ${props => props.$isOpen ? '#1e40af' : '#EFF6FF'};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.18s;
    svg {
      width: 15px;
      height: 15px;
      color: ${props => props.$isOpen ? 'white' : '#1e40af'};
    }
  }
`;

const FAQAnswer = styled(motion.div)`
  padding: 0 20px 18px;
  color: ${props => props.theme.colors.textLight};
  font-size: 14px;
  line-height: 1.7;
  border-top: 1px solid #E8EFFF;
  margin: 0 20px;
  padding-top: 14px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #E8EFFF;
  border-radius: 12px;
  background: #ffffff;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
  outline: none;
  &:focus {
    border-color: #1e40af;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ContactInfoCard = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.04);
`;

const ContactCardHead = styled.div`
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  padding: 20px 24px 18px;
  color: white;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: -30px; right: -30px;
    width: 120px; height: 120px;
    background: rgba(255,255,255,0.07);
    border-radius: 50%;
  }
`;

const ContactCardHeadTitle = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  svg { width: 20px; height: 20px; }
  span { font-size: 16px; font-weight: 700; }
`;

const ContactList = styled.div`
  padding: 8px 0;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 24px;
  border-bottom: 1px solid #F1F5F9;
  &:last-child { border-bottom: none; }

  .ci-icon {
    width: 38px;
    height: 38px;
    border-radius: 11px;
    background: #EFF6FF;
    border: 1.5px solid #BFDBFE;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    svg { width: 18px; height: 18px; color: #1e40af; }
  }

  .ci-info {
    h4 { font-size: 13px; font-weight: 700; color: ${props => props.theme.colors.text}; margin-bottom: 2px; }
    p { font-size: 13px; color: ${props => props.theme.colors.textLight}; }
  }
`;

const ReportButton = styled(motion.button)`
  margin: 16px 24px 20px;
  padding: 14px;
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  transition: box-shadow 0.2s;
  svg { width: 18px; height: 18px; }
  &:hover { box-shadow: 0 8px 20px rgba(245, 158, 11, 0.45); }
`;

const ReportForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EmployerSupport = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState({ issueType: '', subject: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    alert(language === 'vi' ? 'Câu hỏi của bạn đã được gửi! Chúng tôi sẽ phản hồi sớm nhất.' : 'Your question has been sent! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const toggleFAQ = (index) => setOpenFAQ(openFAQ === index ? null : index);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    alert(language === 'vi'
      ? '✅ Báo cáo của bạn đã được gửi thành công! Chúng tôi sẽ xem xét và phản hồi trong vòng 24 giờ.'
      : '✅ Your report has been submitted successfully! We will review and respond within 24 hours.');
    setReportData({ issueType: '', subject: '', description: '' });
    setIsReportModalOpen(false);
  };

  const handleReportChange = (field, value) => setReportData(prev => ({ ...prev, [field]: value }));

  return (
    <DashboardLayout role="employer" key={language}>
      <PageContainer>
        <PageHeader>
          <PageTitleGroup>
            <PageIconBox><HelpCircle /></PageIconBox>
            <PageTitleText>
              <h1>{language === 'vi' ? 'Trung tâm hỗ trợ' : 'Support Center'}</h1>
              <p>{language === 'vi' ? 'Chúng tôi luôn sẵn sàng hỗ trợ bạn' : 'We are always ready to support you'}</p>
            </PageTitleText>
          </PageTitleGroup>
        </PageHeader>

        <ContentGrid>
          <MainContent>
            {/* FAQ Section */}
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SectionHeader>
                <SectionIconBox><HelpCircle /></SectionIconBox>
                <SectionTitle>{language === 'vi' ? 'Câu hỏi thường gặp' : 'Frequently Asked Questions'}</SectionTitle>
              </SectionHeader>
              <FAQList>
                {faqs.map((faq, index) => (
                  <FAQItem key={index} $isOpen={openFAQ === index}>
                    <FAQQuestion $isOpen={openFAQ === index} onClick={() => toggleFAQ(index)}>
                      <h4>{faq.question}</h4>
                      <div className="chevron-box">
                        {openFAQ === index ? <ChevronUp /> : <ChevronDown />}
                      </div>
                    </FAQQuestion>
                    <AnimatePresence initial={false}>
                      {openFAQ === index && (
                        <FAQAnswer
                          key="answer"
                          initial={{ opacity: 0, height: 0, paddingTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', paddingTop: 14 }}
                          exit={{ opacity: 0, height: 0, paddingTop: 0 }}
                          transition={{ duration: 0.22 }}
                        >
                          {faq.answer}
                        </FAQAnswer>
                      )}
                    </AnimatePresence>
                  </FAQItem>
                ))}
              </FAQList>
            </Card>

            {/* Contact Form */}
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <SectionHeader>
                <SectionIconBox><MessageSquare /></SectionIconBox>
                <SectionTitle>{language === 'vi' ? 'Gửi câu hỏi' : 'Send a Question'}</SectionTitle>
              </SectionHeader>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>{language === 'vi' ? 'Họ và tên' : 'Full name'}</Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === 'vi' ? 'Nhập họ và tên của bạn' : 'Enter your full name'}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>{language === 'vi' ? 'Chủ đề' : 'Subject'}</Label>
                  <Input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={language === 'vi' ? 'Vấn đề bạn cần hỗ trợ' : 'Issue you need help with'}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>{language === 'vi' ? 'Nội dung' : 'Message'}</Label>
                  <TextArea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={language === 'vi' ? 'Mô tả chi tiết vấn đề của bạn...' : 'Describe your issue in detail...'}
                    rows={6}
                    required
                  />
                </FormGroup>
                <Button type="submit" variant="primary">
                  <Send size={16} />
                  {language === 'vi' ? 'Gửi câu hỏi' : 'Send Question'}
                </Button>
              </form>
            </Card>
          </MainContent>

          {/* Sidebar */}
          <Sidebar>
            <ContactInfoCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <ContactCardHead>
                <ContactCardHeadTitle>
                  <Headphones />
                  <span>{language === 'vi' ? 'Thông tin liên hệ' : 'Contact Information'}</span>
                </ContactCardHeadTitle>
              </ContactCardHead>

              <ContactList>
                <ContactItem>
                  <div className="ci-icon"><Mail /></div>
                  <div className="ci-info">
                    <h4>Email</h4>
                    <p>support@oppo.vn</p>
                  </div>
                </ContactItem>
                <ContactItem>
                  <div className="ci-icon"><Phone /></div>
                  <div className="ci-info">
                    <h4>Hotline</h4>
                    <p>1900 xxxx</p>
                  </div>
                </ContactItem>
                <ContactItem>
                  <div className="ci-icon"><Clock /></div>
                  <div className="ci-info">
                    <h4>{language === 'vi' ? 'Giờ làm việc' : 'Working hours'}</h4>
                    <p>{language === 'vi' ? 'T2 - T6: 8:00 - 17:00' : 'Mon - Fri: 8:00 - 17:00'}</p>
                    <p>{language === 'vi' ? 'T7: 8:00 - 12:00' : 'Sat: 8:00 - 12:00'}</p>
                  </div>
                </ContactItem>
              </ContactList>

              <ReportButton
                onClick={() => setIsReportModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FileQuestion />
                {language === 'vi' ? 'Báo Cáo Sự Cố' : 'Report Issue'}
              </ReportButton>
            </ContactInfoCard>
          </Sidebar>
        </ContentGrid>
      </PageContainer>

      {/* Report Issue Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title={language === 'vi' ? 'Báo Cáo Sự Cố' : 'Report Issue'}
        size="medium"
      >
        <ReportForm onSubmit={handleReportSubmit}>
          <FormGroup>
            <Label>{language === 'vi' ? 'Loại Sự Cố' : 'Issue Type'} *</Label>
            <Select
              value={reportData.issueType}
              onChange={(e) => handleReportChange('issueType', e.target.value)}
              required
            >
              <option value="">{language === 'vi' ? 'Chọn loại sự cố' : 'Select issue type'}</option>
              <option value="posting">{language === 'vi' ? 'Vấn đề đăng tin tuyển dụng' : 'Job Posting Issue'}</option>
              <option value="candidates">{language === 'vi' ? 'Quản lý ứng viên' : 'Candidate Management'}</option>
              <option value="payment">{language === 'vi' ? 'Thanh toán & Gói dịch vụ' : 'Payment & Subscription'}</option>
              <option value="account">{language === 'vi' ? 'Tài khoản công ty' : 'Company Account'}</option>
              <option value="hr">{language === 'vi' ? 'Quản lý nhân viên HR' : 'HR Staff Management'}</option>
              <option value="performance">{language === 'vi' ? 'Vấn đề hiệu suất' : 'Performance Issue'}</option>
              <option value="ui">{language === 'vi' ? 'Lỗi giao diện' : 'UI Issue'}</option>
              <option value="data">{language === 'vi' ? 'Lỗi dữ liệu' : 'Data Issue'}</option>
              <option value="feature">{language === 'vi' ? 'Đề xuất tính năng' : 'Feature Request'}</option>
              <option value="other">{language === 'vi' ? 'Khác' : 'Other'}</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>{language === 'vi' ? 'Tiêu Đề' : 'Subject'} *</Label>
            <Input
              type="text"
              placeholder={language === 'vi' ? 'Mô tả ngắn gọn vấn đề...' : 'Brief description of the issue...'}
              value={reportData.subject}
              onChange={(e) => handleReportChange('subject', e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>{language === 'vi' ? 'Mô Tả Chi Tiết' : 'Detailed Description'} *</Label>
            <TextArea
              placeholder={language === 'vi'
                ? 'Vui lòng mô tả chi tiết vấn đề:\n• Bạn đang thực hiện thao tác gì?\n• Sự cố xảy ra như thế nào?\n• Có thông báo lỗi nào không?'
                : 'Please describe the issue:\n• What were you doing?\n• How did the issue occur?\n• Were there any error messages?'}
              value={reportData.description}
              onChange={(e) => handleReportChange('description', e.target.value)}
              rows={7}
              required
            />
          </FormGroup>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              type="button"
              $variant="secondary"
              onClick={() => setIsReportModalOpen(false)}
              style={{ flex: 1 }}
              disabled={isSubmitting}
            >
              <X style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              {language === 'vi' ? 'Hủy' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              $variant="primary"
              style={{ flex: 1 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>{language === 'vi' ? 'Đang gửi...' : 'Submitting...'}</>
              ) : (
                <>
                  <Send style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                  {language === 'vi' ? 'Gửi Báo Cáo' : 'Submit Report'}
                </>
              )}
            </Button>
          </div>
        </ReportForm>
      </Modal>
    </DashboardLayout>
  );
};

export default EmployerSupport;
