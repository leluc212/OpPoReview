import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 40px 20px;
`;

const BackButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #e0e0e0;
  color: #333;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    border-color: #d0d0d0;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ContentWrapper = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 48px;

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #222;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
`;

const SectionContent = styled.div`
  font-size: 14px;
  color: #555;
  line-height: 1.7;

  p {
    margin-bottom: 12px;
  }

  ul {
    list-style: disc;
    padding-left: 20px;

    li {
      margin-bottom: 8px;
    }
  }

  strong {
    color: #333;
    font-weight: 600;
  }
`;

const Highlight = styled.div`
  background: #fff8e1;
  border-left: 3px solid #ffa726;
  padding: 16px 20px;
  border-radius: 4px;
  margin: 20px 0;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
`;

const TermsUrgentJobs = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    if (location.state?.returnToWallet) {
      // Return to HR Management page with state to reopen modal
      navigate('/employer/quick-jobs', { state: { fromTermsPage: true } });
    } else {
      navigate(-1);
    }
  };

  return (
    <Container>
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackButton
          onClick={handleBackClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft />
          {language === 'vi' ? 'Quay lại' : 'Go Back'}
        </BackButton>
        
        <Title>
          {language === 'vi' ? 'Điều khoản sử dụng Job Gấp - Ốp Pờ Nhà Tuyển Dụng' : 'Urgent Jobs Terms of Service - Employer'}
        </Title>
        
        <Subtitle>
          {language === 'vi' 
            ? 'Cập nhật lần cuối: 08/03/2026' 
            : 'Last updated: March 8, 2026'}
        </Subtitle>

        <Section>
          <SectionTitle>
            {language === 'vi' ? '1. Phí dịch vụ nền tảng' : '1. Platform Service Fee'}
          </SectionTitle>
          <SectionContent>
            <ul>
              <li>
                {language === 'vi' 
                  ? 'Nền tảng Ốp Pờ áp dụng phí dịch vụ 15% trên tổng tiền lương của ca làm việc khi sử dụng dịch vụ Job Gấp.' 
                  : 'OpPo platform applies a 15% service fee on total salary for each shift when using Urgent Jobs service.'}
              </li>
              <li>
                {language === 'vi' 
                  ? 'Khoản phí này được khấu trừ trực tiếp từ số tiền thanh toán của Nhà tuyển dụng.' 
                  : 'This fee is deducted directly from the employer\'s payment amount.'}
              </li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            {language === 'vi' ? '2. Quy định mức lương' : '2. Salary Regulations'}
          </SectionTitle>
          <SectionContent>
            <ul>
              <li>
                {language === 'vi' 
                  ? 'Mức lương đăng tuyển cho Job Gấp phải cao hơn mức lương tối thiểu theo quy định của Nhà nước.' 
                  : 'Salary posted for Urgent Jobs must be higher than the minimum wage regulated by the government.'}
              </li>
              <li>
                {language === 'vi' 
                  ? 'Nhà tuyển dụng cần đảm bảo rằng sau khi trừ 15% phí dịch vụ, thu nhập thực nhận của Ứng viên vẫn cao hơn mức lương tối thiểu theo quy định.' 
                  : 'Employers must ensure that after deducting the 15% service fee, the candidate\'s actual income is still higher than the regulated minimum wage.'}
              </li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            {language === 'vi' ? '3. Ví nhà tuyển dụng và ký quỹ thanh toán' : '3. Employer Wallet and Payment Escrow'}
          </SectionTitle>
          <SectionContent>
            <ul>
              <li>
                {language === 'vi' 
                  ? 'Để đăng Job Gấp, ví Nhà tuyển dụng trên nền tảng Ốp Pờ phải có đủ số dư tương ứng với tổng tiền lương của ca làm việc.' 
                  : 'To post Urgent Jobs, the employer\'s wallet on OpPo platform must have sufficient balance equivalent to the total salary of the work shift.'}
              </li>
              <li>
                {language === 'vi' 
                  ? 'Sau khi Job Gấp được đăng, số tiền này sẽ được nền tảng tạm giữ (ký quỹ) nhằm đảm bảo thanh toán cho Ứng viên.' 
                  : 'After the Urgent Job is posted, this amount will be held in escrow by the platform to ensure payment to candidates.'}
              </li>
            </ul>
          </SectionContent>
        </Section>

        <Highlight>
          {language === 'vi'
            ? '⚠️ Lưu ý quan trọng: Số tiền sẽ được tạm giữ (ký quỹ) trên nền tảng và chỉ được chuyển cho ứng viên sau khi ca làm hoàn thành và được xác nhận bởi cả hai bên.'
            : '⚠️ Important note: The amount will be held in escrow on the platform and will only be transferred to candidates after the shift is completed and confirmed by both parties.'}
        </Highlight>

        <Section>
          <SectionTitle>
            {language === 'vi' ? '4. Cơ chế đề xuất và thay thế ứng viên' : '4. Candidate Recommendation and Replacement Mechanism'}
          </SectionTitle>
          <SectionContent>
            <ul>
              <li>
                {language === 'vi' 
                  ? 'Ứng viên cho Job Gấp sẽ được hệ thống Ốp Pờ đề xuất tự động bằng công nghệ AI, dựa trên JD, kỹ năng, vị trí và mức độ phù hợp với công việc.' 
                  : 'Candidates for Urgent Jobs will be automatically recommended by OpPo\'s AI system based on JD, skills, location, and job suitability.'}
              </li>
              <li>
                {language === 'vi' 
                  ? 'Nhà tuyển dụng có quyền chấp nhận hoặc từ chối ứng viên được đề xuất.' 
                  : 'Employers have the right to accept or reject recommended candidates.'}
              </li>
            </ul>
            <p>
              <strong>{language === 'vi' ? 'Sau khi Nhà tuyển dụng đã chấp nhận ứng viên:' : 'After employer accepts a candidate:'}</strong>
            </p>
            <ul>
              <li>
                {language === 'vi' 
                  ? 'Trong 30 phút đầu kể từ khi ca làm bắt đầu, nếu ứng viên không đến làm việc hoặc không đáp ứng yêu cầu công việc, Nhà tuyển dụng có quyền từ chối ứng viên trên hệ thống.' 
                  : 'Within the first 30 minutes from shift start, if the candidate does not show up or does not meet job requirements, employers have the right to reject the candidate on the system.'}
              </li>
              <li>
                {language === 'vi' 
                  ? 'Hệ thống sẽ tự động đề xuất ứng viên thay thế tiếp theo.' 
                  : 'The system will automatically recommend the next replacement candidate.'}
              </li>
              <li>
                {language === 'vi' 
                  ? 'Mỗi Job Gấp được tối đa 02 lần đề xuất ứng viên thay thế.' 
                  : 'Each Urgent Job is allowed a maximum of 2 replacement candidate recommendations.'}
              </li>
              <li>
                {language === 'vi' 
                  ? 'Sau 30 phút đầu, Nhà tuyển dụng không thể huỷ hoặc thay thế ứng viên.' 
                  : 'After the first 30 minutes, employers cannot cancel or replace candidates.'}
              </li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            {language === 'vi' ? '5. Xác nhận hoàn thành và thanh toán' : '5. Completion Confirmation and Payment'}
          </SectionTitle>
          <SectionContent>
            <ul>
              <li>
                {language === 'vi' 
                  ? 'Sau khi ca làm kết thúc, Nhà tuyển dụng và Ứng viên cần xác nhận hoàn thành công việc trên hệ thống.' 
                  : 'After the shift ends, both employer and candidate need to confirm job completion on the system.'}
              </li>
              <li>
                {language === 'vi' 
                  ? 'Sau khi xác nhận, tiền lương của Ứng viên sẽ được chuyển vào ví ứng viên trong vòng tối đa 48 giờ.' 
                  : 'After confirmation, the candidate\'s salary will be transferred to their wallet within a maximum of 48 hours.'}
              </li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            {language === 'vi' ? '6. Huỷ công việc và xử lý tranh chấp' : '6. Job Cancellation and Dispute Resolution'}
          </SectionTitle>
          <SectionContent>
            <ul>
              <li>
                {language === 'vi' 
                  ? 'Trong trường hợp Job Gấp bị huỷ hoặc phát sinh tranh chấp giữa Nhà tuyển dụng và Ứng viên, nền tảng Ốp Pờ sẽ tiến hành xem xét và xử lý dựa trên dữ liệu hệ thống và thông tin từ các bên liên quan.' 
                  : 'In case of Urgent Job cancellation or dispute between employer and candidate, OpPo platform will review and process based on system data and information from related parties.'}
              </li>
              <li>
                {language === 'vi' 
                  ? 'Nếu Job Gấp bị huỷ hợp lệ, số tiền đã ký quỹ sẽ được hoàn lại vào ví Nhà tuyển dụng trong vòng tối đa 48 giờ.' 
                  : 'If the Urgent Job is legitimately cancelled, the escrowed amount will be refunded to the employer\'s wallet within a maximum of 48 hours.'}
              </li>
              <li>
                {language === 'vi' 
                  ? 'Nếu Job Gấp bị huỷ không hợp lệ, nền tảng vẫn áp dụng phí dịch vụ 15% trên tổng giá trị Job Gấp.' 
                  : 'If the Urgent Job is cancelled illegitimately, the platform will still apply a 15% service fee on the total Urgent Job value.'}
              </li>
            </ul>
          </SectionContent>
        </Section>
      </ContentWrapper>
    </Container>
  );
};

export default TermsUrgentJobs;
