import React, { useState } from 'react';
import styled from 'styled-components';
import AddressInput from './AddressInput';
import { MapPin, Clock, CheckCircle, Globe } from 'lucide-react';

const DemoContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const DemoHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h2 {
    color: #1f2937;
    margin-bottom: 8px;
  }
  
  p {
    color: #6b7280;
    font-size: 14px;
  }
`;

const TestSection = styled.div`
  margin-bottom: 30px;
`;

const TestButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const TestButton = styled.button`
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }
`;

const ResultCard = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: #059669;
  }
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  padding: 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  
  h4 {
    color: #166534;
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  p {
    color: #15803d;
    font-size: 12px;
    line-height: 1.5;
  }
`;

const OpenStreetMapDemo = () => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const testAddresses = [
    'số 47 đường 5B, Long Bình, Thủ Đức',
    '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
    'Chợ Bến Thành, Quận 1, TP.HCM',
    '456 Lê Văn Việt, Quận 9, TP.HCM',
    'Đại học Bách Khoa, Quận 10, TP.HCM',
    '789 Võ Văn Tần, Quận 3, TP.HCM'
  ];

  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleCoordinatesChange = (newCoordinates) => {
    setCoordinates(newCoordinates);
    
    // Add to test results
    if (newCoordinates && address) {
      const newResult = {
        id: Date.now(),
        address: address,
        lat: newCoordinates.lat,
        lng: newCoordinates.lng,
        timestamp: new Date().toLocaleTimeString('vi-VN')
      };
      
      setTestResults(prev => [newResult, ...prev.slice(0, 4)]); // Keep last 5 results
    }
  };

  const testAddress = (testAddr) => {
    setAddress(testAddr);
  };

  return (
    <DemoContainer>
      <DemoHeader>
        <h2>🗺️ OpenStreetMap Geocoding Demo</h2>
        <p>Test tính năng chuyển đổi địa chỉ Việt Nam thành tọa độ GPS - Hoàn toàn miễn phí!</p>
      </DemoHeader>

      <TestSection>
        <h3>Địa chỉ test nhanh:</h3>
        <TestButtons>
          {testAddresses.map((testAddr, index) => (
            <TestButton key={index} onClick={() => testAddress(testAddr)}>
              {testAddr}
            </TestButton>
          ))}
        </TestButtons>
      </TestSection>

      <TestSection>
        <h3>Nhập địa chỉ cụ thể:</h3>
        <AddressInput
          value={address}
          onChange={handleAddressChange}
          onCoordinatesChange={handleCoordinatesChange}
          placeholder="Nhập địa chỉ cụ thể (VD: số 47 đường 5B, Long Bình, Thủ Đức)"
          showCoordinates={true}
        />
      </TestSection>

      {testResults.length > 0 && (
        <ResultCard>
          <h4>Kết quả test gần đây:</h4>
          {testResults.map((result) => (
            <ResultItem key={result.id}>
              <MapPin />
              <span>
                <strong>{result.address}</strong> → 
                {result.lat.toFixed(6)}, {result.lng.toFixed(6)} 
                <small style={{ color: '#6b7280', marginLeft: '8px' }}>
                  ({result.timestamp})
                </small>
              </span>
            </ResultItem>
          ))}
        </ResultCard>
      )}

      <FeatureList>
        <FeatureCard>
          <h4>✅ Ưu điểm OpenStreetMap</h4>
          <p>
            • Hoàn toàn miễn phí<br/>
            • Không cần API key<br/>
            • Hỗ trợ địa chỉ Việt Nam<br/>
            • Dữ liệu mở, minh bạch<br/>
            • Setup trong 5 phút
          </p>
        </FeatureCard>
        
        <FeatureCard>
          <h4>⚠️ Lưu ý sử dụng</h4>
          <p>
            • Rate limit: 1 request/giây<br/>
            • Độ chính xác: Tốt (7/10)<br/>
            • Không có autocomplete<br/>
            • Chậm hơn Google Maps<br/>
            • Phù hợp ứng dụng nhỏ/vừa
          </p>
        </FeatureCard>
      </FeatureList>

      <div style={{ 
        marginTop: '20px', 
        padding: '12px', 
        background: '#eff6ff', 
        border: '1px solid #bfdbfe', 
        borderRadius: '6px',
        fontSize: '12px',
        color: '#1e40af'
      }}>
        <Globe style={{ width: '14px', height: '14px', display: 'inline', marginRight: '6px' }} />
        Sử dụng dữ liệu từ OpenStreetMap - Cộng đồng bản đồ mở toàn cầu
      </div>
    </DemoContainer>
  );
};

export default OpenStreetMapDemo;