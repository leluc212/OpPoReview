import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { Bell, Mail, MessageSquare } from 'lucide-react';
import { Button, FormGroup, Label } from '../../components/FormElements';

const SettingsContainer = styled.div`
  max-width: 900px;
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

const CandidateSettings = () => {
  return (
    <DashboardLayout role="candidate" showSearch={false}>
      <SettingsContainer>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px' }}>Settings</h1>

        <SettingsCard>
          <SectionTitle>Notifications</SectionTitle>
          
          <SettingItem>
            <SettingInfo>
              <h3>Email Notifications</h3>
              <p>Receive job alerts and updates via email</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" defaultChecked />
              <span></span>
            </Toggle>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <h3>Application Updates</h3>
              <p>Get notified when employers view your application</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" defaultChecked />
              <span></span>
            </Toggle>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <h3>New Job Matches</h3>
              <p>Receive notifications for jobs matching your profile</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" defaultChecked />
              <span></span>
            </Toggle>
          </SettingItem>
        </SettingsCard>

        <SettingsCard>
          <SectionTitle>Privacy</SectionTitle>
          
          <SettingItem>
            <SettingInfo>
              <h3>Profile Visibility</h3>
              <p>Make your profile visible to employers</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" defaultChecked />
              <span></span>
            </Toggle>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <h3>Show Activity Status</h3>
              <p>Let employers know when you're active</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" />
              <span></span>
            </Toggle>
          </SettingItem>
        </SettingsCard>

        <Button $variant="danger">Delete Account</Button>
      </SettingsContainer>
    </DashboardLayout>
  );
};

export default CandidateSettings;
