import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { Button, Input, TextArea, Select, FormGroup, Label } from '../../components/FormElements';
import { Save, ArrowLeft } from 'lucide-react';

const PostJobContainer = styled.div`
  max-width: 900px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
  margin-bottom: 24px;
  background: none;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const FormCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 40px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const FormHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
`;

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Posting job:', formData);
    alert('Job posted successfully!');
    navigate('/employer/jobs');
  };

  return (
    <DashboardLayout role="employer" showSearch={false}>
      <PostJobContainer>
        <BackButton onClick={() => navigate('/employer/dashboard')}>
          <ArrowLeft /> Back to Dashboard
        </BackButton>

        <FormCard>
          <FormHeader>
            <h1>Đăng Tin Tuyển Dụng Mới</h1>
            <p>Điền thông tin để tạo tin tuyển dụng</p>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label>Tiêu đề công việc *</Label>
                <Input name="title" placeholder="Ví dụ: Lập trình viên React cấp cao" value={formData.title} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label>Phòng ban</Label>
                <Input name="department" placeholder="Ví dụ: Kỹ thuật" value={formData.department} onChange={handleChange} />
              </FormGroup>

              <FormGroup>
                <Label>Địa điểm *</Label>
                <Input name="location" placeholder="Ví dụ: Từ xa, Hà Nội" value={formData.location} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label>Loại hình công việc *</Label>
                <Select name="jobType" value={formData.jobType} onChange={handleChange} required>
                  <option value="">Chọn loại hình</option>
                  <option value="full-time">Toàn thời gian</option>
                  <option value="part-time">Bán thời gian</option>
                  <option value="contract">Hợp đồng</option>
                  <option value="freelance">Tự do</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Cấp độ kinh nghiệm *</Label>
                <Select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} required>
                  <option value="">Chọn cấp độ</option>
                  <option value="entry">Mới vào nghề</option>
                  <option value="mid">Trung cấp</option>
                  <option value="senior">Cấp cao</option>
                  <option value="lead">Trưởng phòng/Quản lý</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Mức lương (Không bắt buộc)</Label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Input name="salaryMin" placeholder="Tối thiểu" value={formData.salaryMin} onChange={handleChange} />
                  <Input name="salaryMax" placeholder="Tối đa" value={formData.salaryMax} onChange={handleChange} />
                </div>
              </FormGroup>
            </FormGrid>

            <FormGroup style={{ marginTop: '24px' }}>
              <Label>Mô tả công việc *</Label>
              <TextArea name="description" placeholder="Mô tả vị trí công việc..." value={formData.description} onChange={handleChange} required />
            </FormGroup>

            <FormGroup>
              <Label>Trách nhiệm</Label>
              <TextArea name="responsibilities" placeholder="Liệt kê các trách nhiệm chính..." value={formData.responsibilities} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>Yêu cầu</Label>
              <TextArea name="requirements" placeholder="Liệt kê yêu cầu và trình độ..." value={formData.requirements} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>Quyền lợi</Label>
              <TextArea name="benefits" placeholder="Liệt kê quyền lợi và phúc lợi..." value={formData.benefits} onChange={handleChange} />
            </FormGroup>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <Button type="button" $variant="secondary" onClick={() => navigate('/employer/dashboard')}>
                Hủy
              </Button>
              <Button type="submit" $variant="primary" $size="large">
                <Save /> Đăng Tin
              </Button>
            </div>
          </form>
        </FormCard>
      </PostJobContainer>
    </DashboardLayout>
  );
};

export default PostJob;
