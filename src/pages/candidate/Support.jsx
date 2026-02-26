import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Mail, 
  Phone, 
  Send, 
  FileQuestion,
  Headphones,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  ExternalLink,
  Video,
  Shield,
  Zap
} from 'lucide-react';
import { Button, Input, TextArea, FormGroup, Label } from '../../components/FormElements';

const SupportContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 48px;
  margin-bottom: 32px;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }
  
  .header-content {
    position: relative;
    z-index: 1;
    text-align: center;
    
    h1 {
      font-size: 36px;
      font-weight: 800;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      
      svg {
        width: 40px;
        height: 40px;
      }
    }
    
    p {
      font-size: 16px;
      opacity: 0.9;
      font-weight: 400;
    }
  }
`;

const SupportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SupportCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 28px;
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.intense};
    border-color: ${props => props.$color || props.theme.colors.primary};
  }
  
  .icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    background: ${props => props.$color || props.theme.colors.primary}15;
    border-radius: ${props => props.theme.borderRadius.lg};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.$color || props.theme.colors.primary};
    
    svg {
      width: 32px;
      height: 32px;
    }
  }
  
  h3 {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    line-height: 1.6;
  }
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 32px;
  border: 1px solid ${props => props.theme.colors.border};
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    h2 {
      font-size: 22px;
      font-weight: 700;
      color: ${props => props.theme.colors.text};
      display: flex;
      align-items: center;
      gap: 12px;
      
      svg {
        width: 24px;
        height: 24px;
        color: ${props => props.theme.colors.primary};
      }
    }
  }
`;

const SearchBox = styled.div`
  position: relative;
  margin-bottom: 20px;
  
  input {
    width: 100%;
    padding: 14px 16px 14px 44px;
    border-radius: ${props => props.theme.borderRadius.lg};
    border: 1px solid ${props => props.theme.colors.border};
    background: ${props => props.theme.colors.bgDark};
    font-size: 14px;
    transition: all 0.3s;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
    }
    
    &::placeholder {
      color: ${props => props.theme.colors.textLight};
    }
  }
  
  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const FAQItem = styled(motion.div)`
  padding: 20px;
  background: ${props => props.$expanded ? props.theme.colors.bgDark : 'transparent'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    background: ${props => props.theme.colors.bgDark};
    border-color: ${props => props.theme.colors.primary};
  }
  
  .faq-question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    
    .question-text {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      
      svg {
        width: 20px;
        height: 20px;
        color: ${props => props.theme.colors.primary};
        flex-shrink: 0;
      }
      
      h4 {
        font-size: 15px;
        font-weight: 600;
        color: ${props => props.theme.colors.text};
      }
    }
    
    .toggle-icon {
      width: 24px;
      height: 24px;
      color: ${props => props.theme.colors.textLight};
      flex-shrink: 0;
    }
  }
  
  .faq-answer {
    margin-top: 12px;
    padding-left: 32px;
    
    p {
      font-size: 14px;
      color: ${props => props.theme.colors.textLight};
      line-height: 1.7;
    }
  }
`;

const ContactInfo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 12px;
  transition: all 0.3s;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    border-color: ${props => props.$color || props.theme.colors.primary};
    transform: translateX(4px);
  }
  
  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: ${props => props.theme.borderRadius.lg};
    background: ${props => props.$color || props.theme.colors.primary}15;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    svg {
      width: 24px;
      height: 24px;
      color: ${props => props.$color || props.theme.colors.primary};
    }
  }
  
  .info {
    flex: 1;
    
    .label {
      font-size: 12px;
      color: ${props => props.theme.colors.textLight};
      margin-bottom: 4px;
      font-weight: 600;
    }
    
    .value {
      font-size: 15px;
      font-weight: 700;
      color: ${props => props.theme.colors.text};
    }
  }
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  border-left: 4px solid ${props => props.$color || props.theme.colors.primary};
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    
    .stat-label {
      font-size: 13px;
      color: ${props => props.theme.colors.textLight};
      font-weight: 600;
    }
    
    svg {
      width: 18px;
      height: 18px;
      color: ${props => props.$color || props.theme.colors.primary};
    }
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: 800;
    color: ${props => props.$color || props.theme.colors.primary};
  }
`;

const InfoBox = styled(motion.div)`
  background: ${props => {
    if (props.$type === 'success') return 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)';
    if (props.$type === 'warning') return 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)';
    return 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
  }};
  border-left: 4px solid ${props => {
    if (props.$type === 'success') return '#10B981';
    if (props.$type === 'warning') return '#F59E0B';
    return props.theme.colors.primary;
  }};
  padding: 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  
  .info-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    
    svg {
      width: 20px;
      height: 20px;
      color: ${props => {
        if (props.$type === 'success') return '#10B981';
        if (props.$type === 'warning') return '#F59E0B';
        return props.theme.colors.primary;
      }};
    }
    
    h4 {
      font-size: 15px;
      font-weight: 700;
      color: ${props => props.theme.colors.text};
    }
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    line-height: 1.7;
    margin-left: 32px;
  }
`;

function Support() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getFAQs = () => [
    {
      question: language === 'vi' 
        ? 'Làm thế nào để cập nhật hồ sơ của tôi?'
        : 'How do I update my profile?',
      answer: language === 'vi'
        ? 'Vào phần "Hồ Sơ Của Tôi" từ menu bên trái, sau đó chỉnh sửa thông tin và nhấn nút "Lưu Thay Đổi". Bạn có thể cập nhật ảnh đại diện, thông tin liên hệ, kỹ năng và kinh nghiệm làm việc.'
        : 'Go to "My Profile" from the left menu, then edit your information and click "Save Changes". You can update your avatar, contact information, skills and work experience.'
    },
    {
      question: language === 'vi'
        ? 'Tôi có thể ứng tuyển bao nhiêu công việc?'
        : 'How many jobs can I apply for?',
      answer: language === 'vi'
        ? 'Bạn có thể ứng tuyển không giới hạn số lượng công việc. Tuy nhiên, chúng tôi khuyến nghị bạn chọn lọc và ứng tuyển các vị trí phù hợp nhất với kỹ năng và kinh nghiệm của bạn để tăng cơ hội được nhận.'
        : 'You can apply to unlimited jobs. However, we recommend selecting and applying to positions that best match your skills and experience to increase your chances of success.'
    },
    {
      question: language === 'vi'
        ? 'Làm sao để theo dõi trạng thái đơn ứng tuyển?'
        : 'How do I track my application status?',
      answer: language === 'vi'
        ? 'Truy cập phần "Thông Báo" để xem cập nhật về đơn ứng tuyển của bạn. Bạn cũng sẽ nhận email thông báo khi có thay đổi về trạng thái hồ sơ, lời mời phỏng vấn hoặc kết quả tuyển dụng.'
        : 'Visit the "Notifications" section to see updates about your applications. You will also receive email notifications when there are changes to your application status, interview invitations, or recruitment results.'
    },
    {
      question: language === 'vi'
        ? 'Tôi quên mật khẩu, phải làm sao?'
        : 'I forgot my password, what should I do?',
      answer: language === 'vi'
        ? 'Nhấn vào "Quên mật khẩu" ở trang đăng nhập, sau đó làm theo hướng dẫn để đặt lại mật khẩu qua email. Liên kết đặt lại mật khẩu sẽ có hiệu lực trong 24 giờ.'
        : 'Click "Forgot Password" on the login page, then follow the instructions to reset your password via email. The password reset link will be valid for 24 hours.'
    },
    {
      question: language === 'vi'
        ? 'Làm thế nào để xóa tài khoản?'
        : 'How do I delete my account?',
      answer: language === 'vi'
        ? 'Vào phần "Cài Đặt" > "Vùng Nguy Hiểm" và chọn "Xóa Tài Khoản". Lưu ý rằng hành động này không thể hoàn tác và toàn bộ dữ liệu của bạn sẽ bị xóa vĩnh viễn.'
        : 'Go to "Settings" > "Danger Zone" and select "Delete Account". Note that this action cannot be undone and all your data will be permanently deleted.'
    },
    {
      question: language === 'vi'
        ? 'Tại sao tôi không nhận được thông báo email?'
        : 'Why am I not receiving email notifications?',
      answer: language === 'vi'
        ? 'Kiểm tra phần "Cài Đặt" > "Thông Báo" để đảm bảo bạn đã bật nhận thông báo email. Cũng kiểm tra thư mục spam/junk trong email của bạn. Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ bộ phận hỗ trợ.'
        : 'Check the "Settings" > "Notifications" section to ensure you have enabled email notifications. Also check your email\'s spam/junk folder. If the problem persists, please contact support.'
    },
    {
      question: language === 'vi'
        ? 'Làm thế nào để nâng cao khả năng được tuyển dụng?'
        : 'How can I improve my hiring chances?',
      answer: language === 'vi'
        ? 'Hoàn thiện hồ sơ 100%, cập nhật thường xuyên, thêm kỹ năng và chứng chỉ liên quan, viết mô tả bản thân chi tiết và chuyên nghiệp. Đồng thời, hãy ứng tuyển vào các vị trí phù hợp với năng lực của bạn.'
        : 'Complete your profile 100%, update regularly, add relevant skills and certifications, write detailed and professional self-descriptions. Also, apply to positions that match your abilities.'
    },
    {
      question: language === 'vi'
        ? 'Tôi có thể thay đổi email đăng ký không?'
        : 'Can I change my registered email?',
      answer: language === 'vi'
        ? 'Có, bạn có thể thay đổi email trong phần "Hồ Sơ Của Tôi". Sau khi thay đổi, bạn sẽ nhận email xác nhận tại địa chỉ email mới. Vui lòng xác nhận để hoàn tất quá trình.'
        : 'Yes, you can change your email in the "My Profile" section. After changing, you will receive a confirmation email at the new email address. Please confirm to complete the process.'
    }
  ];

  const [faqs, setFaqs] = useState(getFAQs());

  useEffect(() => {
    setFaqs(getFAQs());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const supportCategories = [
    {
      icon: Book,
      title: language === 'vi' ? 'Trung Tâm Trợ Giúp' : 'Help Center',
      description: language === 'vi' ? 'Xem hướng dẫn chi tiết và bài viết' : 'View detailed guides and articles',
      color: '#667eea'
    },
    {
      icon: Video,
      title: language === 'vi' ? 'Video Hướng Dẫn' : 'Video Tutorials',
      description: language === 'vi' ? 'Xem video hướng dẫn sử dụng' : 'Watch tutorial videos',
      color: '#10B981'
    },
    {
      icon: FileQuestion,
      title: language === 'vi' ? 'Báo Cáo Sự Cố' : 'Report Issue',
      description: language === 'vi' ? 'Báo cáo lỗi hoặc vấn đề kỹ thuật' : 'Report bugs or technical issues',
      color: '#F59E0B'
    },
    {
      icon: MessageCircle,
      title: language === 'vi' ? 'Chat Trực Tuyến' : 'Live Chat',
      description: language === 'vi' ? 'Trò chuyện với đội ngũ hỗ trợ' : 'Chat with support team',
      color: '#EF4444'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Support ticket:', formData);
    alert(language === 'vi' 
      ? 'Yêu cầu hỗ trợ đã được gửi! Chúng tôi sẽ phản hồi trong vòng 24 giờ.'
      : 'Support request submitted! We will respond within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="candidate" showSearch={false}>
      <SupportContainer>
        <PageHeader
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <h1><Headphones />{language === 'vi' ? 'Trung Tâm Hỗ Trợ' : 'Support Center'}</h1>
            <p>{language === 'vi' ? 'Chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7' : 'We are always ready to help you 24/7'}</p>
          </div>
        </PageHeader>

        <SupportGrid>
          {supportCategories.map((category, index) => (
            <SupportCard
              key={index}
              $color={category.color}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="icon">
                <category.icon />
              </div>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </SupportCard>
          ))}
        </SupportGrid>

        <ContentSection>
          <MainContent>
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="card-header">
                <h2><HelpCircle />{language === 'vi' ? 'Câu Hỏi Thường Gặp (FAQ)' : 'Frequently Asked Questions (FAQ)'}</h2>
              </div>
              
              <SearchBox>
                <Search />
                <input
                  type="text"
                  placeholder={language === 'vi' ? 'Tìm kiếm câu hỏi...' : 'Search questions...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchBox>
              
              {filteredFAQs.map((faq, index) => (
                <FAQItem
                  key={index}
                  $expanded={expandedFAQ === index}
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="faq-question">
                    <div className="question-text">
                      <HelpCircle />
                      <h4>{faq.question}</h4>
                    </div>
                    {expandedFAQ === index ? (
                      <ChevronUp className="toggle-icon" />
                    ) : (
                      <ChevronDown className="toggle-icon" />
                    )}
                  </div>
                  <AnimatePresence>
                    {expandedFAQ === index && (
                      <motion.div
                        className="faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p>{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FAQItem>
              ))}
              
              {filteredFAQs.length === 0 && (
                <InfoBox $type="warning" style={{ marginTop: '20px' }}>
                  <div className="info-header">
                    <AlertCircle />
                    <h4>{language === 'vi' ? 'Không tìm thấy kết quả' : 'No results found'}</h4>
                  </div>
                  <p>{language === 'vi' 
                    ? 'Không tìm thấy câu hỏi phù hợp. Vui lòng thử từ khóa khác hoặc liên hệ trực tiếp với chúng tôi.'
                    : 'No matching questions found. Please try other keywords or contact us directly.'}</p>
                </InfoBox>
              )}
            </Card>

            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="card-header">
                <h2><Send />{language === 'vi' ? 'Gửi Yêu Cầu Hỗ Trợ' : 'Submit Support Request'}</h2>
              </div>
              
              <InfoBox $type="info" style={{ marginBottom: '24px' }}>
                <div className="info-header">
                  <Clock />
                  <h4>{language === 'vi' ? 'Thời gian phản hồi' : 'Response Time'}</h4>
                </div>
                <p>{language === 'vi' 
                  ? 'Chúng tôi sẽ phản hồi yêu cầu của bạn trong vòng 24 giờ làm việc.'
                  : 'We will respond to your request within 24 working hours.'}</p>
              </InfoBox>
              
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>{language === 'vi' ? 'Họ và Tên' : 'Full Name'}</Label>
                  <Input
                    type="text"
                    placeholder={language === 'vi' ? 'Nhập họ tên của bạn' : 'Enter your full name'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Tiêu Đề' : 'Subject'}</Label>
                  <Input
                    type="text"
                    placeholder={language === 'vi' ? 'Mô tả ngắn gọn vấn đề' : 'Brief description of the issue'}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Nội Dung' : 'Message'}</Label>
                  <TextArea
                    placeholder={language === 'vi' ? 'Mô tả chi tiết vấn đề của bạn...' : 'Describe your issue in detail...'}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    required
                  />
                </FormGroup>

                <Button type="submit" $variant="primary" $fullWidth>
                  <Send style={{ width: '18px', height: '18px', marginRight: '8px' }} />
                  {language === 'vi' ? 'Gửi Yêu Cầu' : 'Submit Request'}
                </Button>
              </form>
            </Card>
          </MainContent>

          <Sidebar>
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="card-header">
                <h2><Zap />{language === 'vi' ? 'Thống kê' : 'Statistics'}</h2>
              </div>
              
              <QuickStats>
                <StatItem $color="#667eea">
                  <div className="stat-header">
                    <span className="stat-label">{language === 'vi' ? 'Thời gian phản hồi' : 'Response Time'}</span>
                    <Clock />
                  </div>
                  <div className="stat-value">&lt; 24h</div>
                </StatItem>
                
                <StatItem $color="#10B981">
                  <div className="stat-header">
                    <span className="stat-label">{language === 'vi' ? 'Độ hài lòng' : 'Satisfaction'}</span>
                    <CheckCircle />
                  </div>
                  <div className="stat-value">98%</div>
                </StatItem>
                
                <StatItem $color="#F59E0B">
                  <div className="stat-header">
                    <span className="stat-label">{language === 'vi' ? 'Yêu cầu đã giải quyết' : 'Resolved Requests'}</span>
                    <Shield />
                  </div>
                  <div className="stat-value">15,420</div>
                </StatItem>
              </QuickStats>
            </Card>

            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="card-header">
                <h2><Phone />{language === 'vi' ? 'Liên Hệ Trực Tiếp' : 'Direct Contact'}</h2>
              </div>
              
              <ContactInfo 
                $color="#667eea"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="icon-wrapper">
                  <Mail />
                </div>
                <div className="info">
                  <div className="label">Email</div>
                  <div className="value">support@oppo.vn</div>
                </div>
              </ContactInfo>

              <ContactInfo 
                $color="#10B981"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="icon-wrapper">
                  <Phone />
                </div>
                <div className="info">
                  <div className="label">{language === 'vi' ? 'Điện Thoại' : 'Phone'}</div>
                  <div className="value">1900 xxxx</div>
                </div>
              </ContactInfo>

              <ContactInfo 
                $color="#F59E0B"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="icon-wrapper">
                  <Clock />
                </div>
                <div className="info">
                  <div className="label">{language === 'vi' ? 'Giờ Làm Việc' : 'Working Hours'}</div>
                  <div className="value">{language === 'vi' ? '24/7 - Mọi lúc' : '24/7 - Anytime'}</div>
                </div>
              </ContactInfo>
              
              <InfoBox $type="success" style={{ marginTop: '16px' }}>
                <div className="info-header">
                  <CheckCircle />
                  <h4>{language === 'vi' ? 'Hỗ trợ nhanh chóng' : 'Quick Support'}</h4>
                </div>
                <p>{language === 'vi' 
                  ? 'Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn.'
                  : 'Our support team is always ready to answer all your questions.'}</p>
              </InfoBox>
            </Card>
          </Sidebar>
        </ContentSection>
      </SupportContainer>
    </DashboardLayout>
  );
}

export default Support;
