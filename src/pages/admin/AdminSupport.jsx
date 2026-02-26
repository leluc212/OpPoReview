import { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  HelpCircle, 
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Clock,
  Send
} from 'lucide-react';
import { Input, TextArea, Label, Button } from '../../components/FormElements';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div``;

const Sidebar = styled.div``;

const Section = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
`;

const FAQQuestion = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: ${props => props.$isOpen ? props.theme.colors.bgDark : props.theme.colors.bgLight};
  border: none;
  text-align: left;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.bgDark};
  }
`;

const FAQAnswer = styled.div`
  padding: 1rem 1.5rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.bgLight};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const ContactCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const ContactTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => `${props.theme.colors.primary}15`};
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

const ContactValue = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const AdminSupport = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      id: 1,
      question: 'Làm sao để quản lý quyền truy cập của admin?',
      answer: 'Bạn có thể quản lý quyền truy cập trong phần Cài Đặt > Phân Quyền. Tại đây, bạn có thể tạo các vai trò khác nhau và gán quyền cụ thể cho từng vai trò.'
    },
    {
      id: 2,
      question: 'Cách xử lý khi phát hiện tài khoản vi phạm?',
      answer: 'Khi phát hiện tài khoản vi phạm, bạn có thể: 1) Cảnh cáo người dùng, 2) Tạm khóa tài khoản, 3) Khóa vĩnh viễn. Nên lưu lại bằng chứng vi phạm trước khi thực hiện các hành động này.'
    },
    {
      id: 3,
      question: 'Làm thế nào để xuất báo cáo dữ liệu?',
      answer: 'Vào phần Báo Cáo > Chọn loại báo cáo cần xuất > Chọn khoảng thời gian > Nhấn nút "Xuất báo cáo". Hệ thống hỗ trợ xuất dưới dạng Excel, PDF, và CSV.'
    },
    {
      id: 4,
      question: 'Quy trình phê duyệt nhà tuyển dụng mới?',
      answer: 'Quy trình gồm 3 bước: 1) Kiểm tra thông tin công ty, 2) Xác minh giấy tờ pháp lý, 3) Phê duyệt hoặc từ chối. Mỗi bước đều cần ghi chú lý do rõ ràng.'
    },
    {
      id: 5,
      question: 'Cách xử lý sự cố kỹ thuật nghiêm trọng?',
      answer: 'Trong trường hợp khẩn cấp, vui lòng liên hệ ngay với bộ phận kỹ thuật qua hotline: 0909 123 456 hoặc email: tech-support@oppo.vn. Mô tả chi tiết sự cố và các bước đã thực hiện.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Support ticket submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <DashboardLayout role="admin">
      <PageContainer>
        <PageHeader>
          <Title>Trung Tâm Hỗ Trợ</Title>
          <Subtitle>Câu hỏi thường gặp và liên hệ hỗ trợ</Subtitle>
        </PageHeader>

        <Grid>
          <MainContent>
            <Section>
              <SectionTitle>
                <HelpCircle size={24} />
                Câu Hỏi Thường Gặp
              </SectionTitle>
              <FAQList>
                {faqs.map(faq => (
                  <FAQItem key={faq.id}>
                    <FAQQuestion 
                      $isOpen={openFAQ === faq.id}
                      onClick={() => toggleFAQ(faq.id)}
                    >
                      <span>{faq.question}</span>
                      {openFAQ === faq.id ? 
                        <ChevronUp size={20} /> : 
                        <ChevronDown size={20} />
                      }
                    </FAQQuestion>
                    {openFAQ === faq.id && (
                      <FAQAnswer>{faq.answer}</FAQAnswer>
                    )}
                  </FAQItem>
                ))}
              </FAQList>
            </Section>

            <Section>
              <SectionTitle>
                <Send size={24} />
                Gửi Yêu Cầu Hỗ Trợ
              </SectionTitle>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Họ và tên</Label>
                  <Input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@example.com"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Chủ đề</Label>
                  <Input 
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Vấn đề cần hỗ trợ"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Nội dung chi tiết</Label>
                  <TextArea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                    rows={6}
                    required
                  />
                </FormGroup>

                <Button type="submit" $variant="primary">
                  <Send size={18} />
                  Gửi yêu cầu
                </Button>
              </form>
            </Section>
          </MainContent>

          <Sidebar>
            <ContactCard>
              <ContactTitle>Thông Tin Liên Hệ</ContactTitle>
              
              <ContactItem>
                <IconWrapper>
                  <Mail size={20} />
                </IconWrapper>
                <ContactInfo>
                  <ContactLabel>Email hỗ trợ</ContactLabel>
                  <ContactValue>admin-support@oppo.vn</ContactValue>
                </ContactInfo>
              </ContactItem>

              <ContactItem>
                <IconWrapper>
                  <Phone size={20} />
                </IconWrapper>
                <ContactInfo>
                  <ContactLabel>Hotline</ContactLabel>
                  <ContactValue>0909 123 456</ContactValue>
                </ContactInfo>
              </ContactItem>

              <ContactItem>
                <IconWrapper>
                  <Clock size={20} />
                </IconWrapper>
                <ContactInfo>
                  <ContactLabel>Giờ làm việc</ContactLabel>
                  <ContactValue>24/7 - Hỗ trợ toàn thời gian</ContactValue>
                </ContactInfo>
              </ContactItem>
            </ContactCard>

            <ContactCard>
              <ContactTitle>Hỗ Trợ Khẩn Cấp</ContactTitle>
              <ContactItem>
                <IconWrapper style={{ background: '#fee2e2', color: '#dc2626' }}>
                  <Phone size={20} />
                </IconWrapper>
                <ContactInfo>
                  <ContactLabel>Hotline khẩn cấp</ContactLabel>
                  <ContactValue style={{ color: '#dc2626' }}>1900 8888</ContactValue>
                </ContactInfo>
              </ContactItem>
            </ContactCard>
          </Sidebar>
        </Grid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default AdminSupport;
