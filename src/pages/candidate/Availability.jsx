import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import { Power, Search, TrendingUp, MapPin, Clock, Bell, AlertCircle } from 'lucide-react';
import { Button } from '../../components/FormElements';

const AvailabilityContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #0F172A;
    letter-spacing: -0.5px;
  }
  
  p {
    font-size: 16px;
    color: #64748B;
    font-weight: 400;
  }
`;

const StatusCard = styled.div`
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(100, 116, 139, 0.05) 0%, rgba(71, 85, 105, 0.05) 100%)'};
  border: 1px solid ${props => props.$active ? 'rgba(37, 99, 235, 0.2)' : 'rgba(100, 116, 139, 0.2)'};
  border-radius: 16px;
  padding: 48px 40px;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 250px;
    height: 250px;
    background: ${props => props.$active 
      ? 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(100, 116, 139, 0.1) 0%, transparent 70%)'};
    border-radius: 50%;
    filter: blur(40px);
  }
  
  .status-content {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 40px;
    align-items: center;
    
    .status-info {
      h2 {
        font-size: 14px;
        font-weight: 600;
        color: #64748B;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
      }
      
      .status-label {
        font-size: 40px;
        font-weight: 700;
        margin-bottom: 12px;
        color: ${props => props.$active ? '#2563EB' : '#64748B'};
        letter-spacing: -1px;
      }
      
      .status-desc {
        font-size: 15px;
        color: #64748B;
        line-height: 1.6;
      }
    }
    
    .status-icon {
      width: 100px;
      height: 100px;
      background: ${props => props.$active 
        ? 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)'
        : 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)'};
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: ${props => props.$active 
        ? '0 8px 24px rgba(37, 99, 235, 0.25)'
        : '0 8px 24px rgba(100, 116, 139, 0.15)'};
      
      svg {
        width: 48px;
        height: 48px;
        color: white;
      }
    }
  }
`;

const ToggleButton = styled.button`
  background: ${props => props.$active 
    ? '#2563EB'
    : '#64748B'};
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px ${props => props.$active 
    ? 'rgba(37, 99, 235, 0.3)'
    : 'rgba(100, 116, 139, 0.2)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px ${props => props.$active 
      ? 'rgba(37, 99, 235, 0.4)'
      : 'rgba(100, 116, 139, 0.3)'};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const SettingsCard = styled.div`
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #0F172A;
  letter-spacing: -0.3px;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  &:first-child {
    padding-top: 0;
  }
  
  &:hover {
    padding-left: 8px;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #0F172A;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: -0.2px;
    
    svg {
      width: 20px;
      height: 20px;
      color: #2563EB;
      flex-shrink: 0;
    }
  }
  
  p {
    font-size: 14px;
    color: #64748B;
    line-height: 1.5;
    padding-left: 30px;
  }
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 52px;
  height: 30px;
  flex-shrink: 0;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
    
    &:checked + span {
      background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    
    &:checked + span:before {
      transform: translateX(22px);
    }
    
    &:disabled + span {
      opacity: 0.4;
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
    background: #E2E8F0;
    border-radius: 30px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:before {
      position: absolute;
      content: '';
      height: 22px;
      width: 22px;
      left: 4px;
      bottom: 4px;
      background: white;
      border-radius: 50%;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }
  }
`;

const InfoBox = styled.div`
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
  border-left: 3px solid #2563EB;
  padding: 20px;
  border-radius: 12px;
  margin-top: 24px;
  
  p {
    font-size: 14px;
    color: #475569;
    line-height: 1.7;
    
    strong {
      color: #0F172A;
      font-weight: 600;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: 28px 20px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%);
  border: 1px solid rgba(37, 99, 235, 0.1);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.1);
    border-color: rgba(37, 99, 235, 0.2);
  }
  
  .stat-value {
    font-size: 36px;
    font-weight: 700;
    color: #2563EB;
    margin-bottom: 8px;
    line-height: 1;
  }
  
  .stat-label {
    font-size: 14px;
    color: #64748B;
    font-weight: 500;
  }
`;

const ConfirmationContent = styled.div`
  padding: 24px;
  
  .icon-wrapper {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    background: ${props => props.$isActive 
      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(30, 64, 175, 0.1) 100%)'};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 32px;
      height: 32px;
      color: ${props => props.$isActive ? '#EF4444' : '#2563EB'};
    }
  }
  
  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #0F172A;
    text-align: center;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 15px;
    color: #64748B;
    text-align: center;
    line-height: 1.6;
    margin-bottom: 24px;
  }
  
  .button-group {
    display: flex;
    gap: 12px;
    
    button {
      flex: 1;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &.confirm {
        background: ${props => props.$isActive 
          ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
          : 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)'};
        color: white;
        border: none;
        box-shadow: 0 4px 12px ${props => props.$isActive 
          ? 'rgba(239, 68, 68, 0.3)'
          : 'rgba(37, 99, 235, 0.3)'};
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px ${props => props.$isActive 
            ? 'rgba(239, 68, 68, 0.4)'
            : 'rgba(37, 99, 235, 0.4)'};
        }
      }
      
      &.cancel {
        background: #F1F5F9;
        color: #475569;
        border: 1px solid #E2E8F0;
        
        &:hover {
          background: #E2E8F0;
          border-color: #CBD5E1;
        }
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
`;

const Availability = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [enableJobSearch, setEnableJobSearch] = useState(true);
  const [enableRecommendations, setEnableRecommendations] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleToggleAvailability = () => {
    setShowConfirmModal(true);
  };
  
  const confirmToggle = () => {
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
    setShowConfirmModal(false);
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
              <ToggleButton onClick={handleToggleAvailability} $active={isAvailable}>
                <Power />
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
          
          <StatsGrid>
            <StatCard>
              <div className="stat-value">
                {isAvailable ? '156' : '0'}
              </div>
              <div className="stat-label">Lượt Xem Hồ Sơ</div>
            </StatCard>
            
            <StatCard>
              <div className="stat-value">
                {isAvailable ? '23' : '0'}
              </div>
              <div className="stat-label">Gợi Ý Công Việc</div>
            </StatCard>
            
            <StatCard>
              <div className="stat-value">
                {isAvailable ? '12' : '0'}
              </div>
              <div className="stat-label">Lời Mời Phỏng Vấn</div>
            </StatCard>
          </StatsGrid>
        </SettingsCard>
      </AvailabilityContainer>
      
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={isAvailable ? 'Tắt Trạng Thái Tìm Việc?' : 'Bật Trạng Thái Tìm Việc?'}
      >
        <ConfirmationContent $isActive={isAvailable}>
          <div className="icon-wrapper">
            <AlertCircle />
          </div>
          <h3>{isAvailable ? 'Xác nhận tắt tìm việc' : 'Xác nhận bật tìm việc'}</h3>
          <p>
            {isAvailable 
              ? 'Khi tắt trạng thái tìm việc, hồ sơ của bạn sẽ bị ẩn khỏi nhà tuyển dụng và bạn sẽ không nhận được gợi ý công việc nào. Tất cả cài đặt tìm kiếm sẽ tự động bị vô hiệu hóa.'
              : 'Khi bật trạng thái tìm việc, hồ sơ của bạn sẽ hiển thị với nhà tuyển dụng và bạn sẽ nhận được các gợi ý công việc phù hợp. Các tính năng tìm kiếm sẽ được kích hoạt.'
            }
          </p>
          <div className="button-group">
            <button className="cancel" onClick={() => setShowConfirmModal(false)}>
              Hủy
            </button>
            <button className="confirm" onClick={confirmToggle}>
              {isAvailable ? 'Tắt Ngay' : 'Bật Ngay'}
            </button>
          </div>
        </ConfirmationContent>
      </Modal>
    </DashboardLayout>
  );
};

export default Availability;
