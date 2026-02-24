import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { HelpCircle, MessageCircle, Book, Mail, Phone, Send, FileQuestion } from 'lucide-react';
import { Button, Input, TextArea, FormGroup, Label } from '../../components/FormElements';

const SupportContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 40px;
  text-align: center;
  
  h1 {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 12px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: 18px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const SupportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 48px;
`;

const SupportCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 32px;
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.intense};
    border-color: ${props => props.theme.colors.primary};
  }
  
  .icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    background: ${props => props.theme.colors.gradientPrimary};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    
    svg {
      width: 32px;
      height: 32px;
    }
  }
  
  h3 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    line-height: 1.6;
  }
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
`;

const MainContent = styled.div``;

const Sidebar = styled.div``;

const Card = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  
  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    color: ${props => props.theme.colors.text};
  }
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: ${props => props.theme.colors.text};
  }
`;

const FAQItem = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    svg {
      width: 18px;
      height: 18px;
      color: ${props => props.theme.colors.primary};
    }
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    line-height: 1.6;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 12px;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.theme.colors.primary};
  }
  
  .info {
    flex: 1;
    
    .label {
      font-size: 12px;
      color: ${props => props.theme.colors.textLight};
      margin-bottom: 4px;
    }
    
    .value {
      font-size: 16px;
      font-weight: 600;
      color: ${props => props.theme.colors.text};
    }
  }
`;

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: 'Làm thế nào để cập nhật hồ sơ của tôi?',
      answer: 'Vào phần "Hồ Sơ Của Tôi" từ menu bên trái, sau đó chỉnh sửa thông tin và nhấn nút "Lưu Thay Đổi".'
    },
    {
      question: 'Tôi có thể ứng tuyển bao nhiêu công việc?',
      answer: 'Bạn có thể ứng tuyển không giới hạn số lượng công việc. Tuy nhiên, chúng tôi khuyến nghị bạn chọn lọc và ứng tuyển các vị trí phù hợp nhất.'
    },
    {
      question: 'Làm sao để theo dõi trạng thái đơn ứng tuyển?',
      answer: 'Truy cập phần "Thông Báo" để xem cập nhật về đơn ứng tuyển của bạn. Bạn cũng sẽ nhận email thông báo khi có thay đổi.'
    },
    {
      question: 'Tôi quên mật khẩu, phải làm sao?',
      answer: 'Nhấn vào "Quên mật khẩu" ở trang đăng nhập, sau đó làm theo hướng dẫn để đặt lại mật khẩu qua email.'
    },
    {
      question: 'Làm thế nào để xóa tài khoản?',
      answer: 'Vào phần "Cài Đặt" > "Vùng Nguy Hiểm" và chọn "Xóa Tài Khoản". Lưu ý rằng hành động này không thể hoàn tác.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Support ticket:', formData);
    alert('Yêu cầu hỗ trợ đã được gửi! Chúng tôi sẽ phản hồi trong vòng 24 giờ.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <DashboardLayout role="candidate" showSearch={false}>
      <SupportContainer>
        <Header>
          <h1>Trung Tâm Hỗ Trợ</h1>
          <p>Chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
        </Header>

        <SupportGrid>
          <SupportCard>
            <div className="icon">
              <Book />
            </div>
            <h3>Trung Tâm Trợ Giúp</h3>
            <p>Xem các bài viết hướng dẫn và FAQ</p>
          </SupportCard>

          <SupportCard>
            <div className="icon">
              <FileQuestion />
            </div>
            <h3>Báo Cáo Sự Cố</h3>
            <p>Cho chúng tôi biết nếu bạn gặp vấn đề</p>
          </SupportCard>
        </SupportGrid>

        <ContentSection>
          <MainContent>
            <Card>
              <h2>Câu Hỏi Thường Gặp (FAQ)</h2>
              {faqs.map((faq, index) => (
                <FAQItem key={index}>
                  <h4>
                    <HelpCircle />
                    {faq.question}
                  </h4>
                  <p>{faq.answer}</p>
                </FAQItem>
              ))}
            </Card>

            <Card>
              <h2>Gửi Yêu Cầu Hỗ Trợ</h2>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Họ và Tên</Label>
                  <Input
                    type="text"
                    placeholder="Nhập họ tên của bạn"
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
                  <Label>Tiêu Đề</Label>
                  <Input
                    type="text"
                    placeholder="Mô tả ngắn gọn vấn đề"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Nội Dung</Label>
                  <TextArea
                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    required
                  />
                </FormGroup>

                <Button type="submit" $variant="primary" $fullWidth>
                  <Send style={{ width: '18px', height: '18px' }} />
                  Gửi Yêu Cầu
                </Button>
              </form>
            </Card>
          </MainContent>

          <Sidebar>
            <Card>
              <h3>Liên Hệ Trực Tiếp</h3>
              
              <ContactInfo>
                <Mail />
                <div className="info">
                  <div className="label">Email</div>
                  <div className="value">support@oppo.vn</div>
                </div>
              </ContactInfo>

              <ContactInfo>
                <Phone />
                <div className="info">
                  <div className="label">Điện Thoại</div>
                  <div className="value">1900 xxxx</div>
                </div>
              </ContactInfo>

              <ContactInfo>
                <MessageCircle />
                <div className="info">
                  <div className="label">Giờ Làm Việc</div>
                  <div className="value">8:00 - 18:00 (T2-T6)</div>
                </div>
              </ContactInfo>
            </Card>
          </Sidebar>
        </ContentSection>
      </SupportContainer>
    </DashboardLayout>
  );
};

export default Support;
