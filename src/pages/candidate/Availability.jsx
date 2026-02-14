import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { Power, Search, TrendingUp, MapPin, Clock, Bell } from 'lucide-react';
import { Button } from '../../components/FormElements';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

const AvailabilityContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 40px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: 16px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const StatusCard = styled.div`
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
    : 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 40px;
  margin-bottom: 32px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.intense};
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
  
  .status-content {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .status-info {
      h2 {
        font-size: 20px;
        font-weight: 500;
        opacity: 0.9;
        margin-bottom: 8px;
      }
      
      .status-label {
        font-size: 48px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      
      .status-desc {
        font-size: 14px;
        opacity: 0.8;
      }
    }
    
    .status-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        width: 40px;
        height: 40px;
      }
    }
  }
`;

const ToggleButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 16px 32px;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 18px;
  font-weight: 600;
  margin-top: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const SettingsCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  color: ${props => props.theme.colors.text};
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
  
  h3 {
    font-size: 16px;
    font-weight: 500;
    color: ${props => props.theme.colors.text};
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
    
    svg {
      width: 20px;
      height: 20px;
      color: ${props => props.theme.colors.primary};
    }
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
    
    &:checked + span {
      background: ${props => props.theme.colors.primary};
    }
    
    &:checked + span:before {
      transform: translateX(22px);
    }
    
    &:disabled + span {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme.colors.border};
    border-radius: 28px;
    transition: 0.3s;
    
    &:before {
      position: absolute;
      content: '';
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background: white;
      border-radius: 50%;
      transition: 0.3s;
    }
  }
`;

const InfoBox = styled.div`
  background: ${props => props.theme.colors.primary}15;
  border-left: 4px solid ${props => props.theme.colors.primary};
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: 24px;
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
  }
`;

const Availability = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [isAvailable, setIsAvailable] = useState(true);
  const [enableJobSearch, setEnableJobSearch] = useState(true);
  const [enableRecommendations, setEnableRecommendations] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);

  const handleToggleAvailability = () => {
    setIsAvailable(!isAvailable);
    if (isAvailable) {
      // Turning off - disable all features
      setEnableJobSearch(false);
      setEnableRecommendations(false);
    } else {
      // Turning on - enable all features
      setEnableJobSearch(true);
      setEnableRecommendations(true);
    }
  };

  return (
    <DashboardLayout role="candidate" showSearch={false}>
      <AvailabilityContainer>
        <Header>
          <h1>Trạng Thái Tìm Việc</h1>
          <p>Quản lý trạng thái hiển thị và tìm kiếm công việc của bạn</p>
        </Header>

        <StatusCard $active={isAvailable}>
          <div className="status-content">
            <div className="status-info">
              <h2>Trạng Thái Hiện Tại</h2>
              <div className="status-label">
                {isAvailable ? 'ĐANG TÌM VIỆC' : 'TẠM DỪNG'}
              </div>
              <div className="status-desc">
                {isAvailable 
                  ? 'Hồ sơ của bạn đang hiển thị với nhà tuyển dụng'
                  : 'Hồ sơ của bạn đã bị ẩn khỏi nhà tuyển dụng'}
              </div>
              <ToggleButton onClick={handleToggleAvailability}>
                <Power style={{ width: '20px', height: '20px', marginRight: '8px', display: 'inline', verticalAlign: 'middle' }} />
                {isAvailable ? 'Tắt Tìm Việc' : 'Bật Tìm Việc'}
              </ToggleButton>
            </div>
            <div className="status-icon">
              <Power />
            </div>
          </div>
        </StatusCard>

        <SettingsCard>
          <SectionTitle>Cài Đặt Tìm Kiếm</SectionTitle>
          
          <SettingItem>
            <SettingInfo>
              <h3>
                <Search />
                Cho Phép Tìm Kiếm Công Việc
              </h3>
              <p>Bật để tìm kiếm và ứng tuyển các công việc mới</p>
            </SettingInfo>
            <Toggle>
              <input 
                type="checkbox" 
                checked={enableJobSearch} 
                onChange={(e) => setEnableJobSearch(e.target.checked)}
                disabled={!isAvailable}
              />
              <span></span>
            </Toggle>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <h3>
                <TrendingUp />
                Nhận Gợi Ý Công Việc
              </h3>
              <p>Nhận các gợi ý công việc phù hợp dựa trên hồ sơ của bạn</p>
            </SettingInfo>
            <Toggle>
              <input 
                type="checkbox" 
                checked={enableRecommendations} 
                onChange={(e) => setEnableRecommendations(e.target.checked)}
                disabled={!isAvailable}
              />
              <span></span>
            </Toggle>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <h3>
                <Bell />
                Thông Báo Công Việc Mới
              </h3>
              <p>Nhận thông báo khi có công việc mới phù hợp</p>
            </SettingInfo>
            <Toggle>
              <input 
                type="checkbox" 
                checked={enableNotifications} 
                onChange={(e) => setEnableNotifications(e.target.checked)}
                disabled={!isAvailable}
              />
              <span></span>
            </Toggle>
          </SettingItem>

          <InfoBox>
            <p>
              <strong>Lưu ý:</strong> Khi bạn tắt trạng thái tìm việc, hồ sơ của bạn sẽ bị ẩn khỏi tất cả nhà tuyển dụng 
              và bạn sẽ không nhận được bất kỳ gợi ý công việc nào. Các cài đặt tìm kiếm sẽ tự động bị vô hiệu hóa.
            </p>
          </InfoBox>
        </SettingsCard>

        <SettingsCard>
          <SectionTitle>Thống Kê Hoạt Động</SectionTitle>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '24px', background: '#F8FAFC', borderRadius: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#0E3995', marginBottom: '8px' }}>
                {isAvailable ? '156' : '0'}
              </div>
              <div style={{ fontSize: '14px', color: '#64748B' }}>Lượt Xem Hồ Sơ</div>
            </div>
            <div style={{ textAlign: 'center', padding: '24px', background: '#F8FAFC', borderRadius: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#0E3995', marginBottom: '8px' }}>
                {isAvailable ? '23' : '0'}
              </div>
              <div style={{ fontSize: '14px', color: '#64748B' }}>Gợi Ý Công Việc</div>
            </div>
            <div style={{ textAlign: 'center', padding: '24px', background: '#F8FAFC', borderRadius: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#0E3995', marginBottom: '8px' }}>
                {isAvailable ? '12' : '0'}
              </div>
              <div style={{ fontSize: '14px', color: '#64748B' }}>Lời Mời Phỏng Vấn</div>
            </div>
          </div>
        </SettingsCard>
      </AvailabilityContainer>
    </DashboardLayout>
  );
};

export default Availability;
