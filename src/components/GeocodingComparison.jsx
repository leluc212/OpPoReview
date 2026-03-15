import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, MapPin, Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react';

const ComparisonContainer = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const TestSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const InputGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const TestInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
`;

const TestButton = styled.button`
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
`;

const ServiceResult = styled.div`
  border: 2px solid ${props => props.$success ? '#10b981' : props.$error ? '#ef4444' : '#e5e7eb'};
  border-radius: 8px;
  padding: 16px;
`;

const ServiceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  color: ${props => props.$success ? '#10b981' : props.$error ? '#ef4444' : '#374151'};
`;

const GeocodingComparison = () => {
  const [testAddress, setTestAddress] = useState('số 47 đường 5B, Long Bình, Thủ Đức');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runComparison = async () => {
    if (!testAddress.trim()) return;
    
    setLoading(true);
    try {
      const { default: hybridService } = await import('../services/hybridGeocodingService');
      const comparisonResults = await hybridService.compareServices(testAddress);
      setResults(comparisonResults);
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComparisonContainer>
      <h2>So sánh Google Maps vs OpenStreetMap</h2>
      
      <TestSection>
        <h3>Test Geocoding</h3>
        <InputGroup>
          <TestInput
            value={testAddress}
            onChange={(e) => setTestAddress(e.target.value)}
            placeholder="Nhập địa chỉ để test..."
          />
          <TestButton onClick={runComparison} disabled={loading}>
            {loading ? 'Đang test...' : 'So sánh'}
          </TestButton>
        </InputGroup>
        
        {results && (
          <ResultsGrid>
            <ServiceResult 
              $success={results.googleMaps && !results.googleMaps.error}
              $error={results.googleMaps?.error}
            >
              <ServiceHeader 
                $success={results.googleMaps && !results.googleMaps.error}
                $error={results.googleMaps?.error}
              >
                {results.googleMaps && !results.googleMaps.error ? <CheckCircle size={20} /> : <XCircle size={20} />}
                Google Maps
              </ServiceHeader>
              
              {results.googleMaps?.error ? (
                <p style={{ color: '#ef4444' }}>{results.googleMaps.error}</p>
              ) : results.googleMaps ? (
                <div>
                  <p><strong>Địa chỉ:</strong> {results.googleMaps.formattedAddress}</p>
                  <p><strong>Tọa độ:</strong> {results.googleMaps.lat.toFixed(6)}, {results.googleMaps.lng.toFixed(6)}</p>
                  <p><strong>Thời gian:</strong> {results.googleMaps.responseTime}ms</p>
                </div>
              ) : (
                <p>Không có Google Maps API key</p>
              )}
            </ServiceResult>
            
            <ServiceResult 
              $success={results.openStreetMap && !results.openStreetMap.error}
              $error={results.openStreetMap?.error}
            >
              <ServiceHeader 
                $success={results.openStreetMap && !results.openStreetMap.error}
                $error={results.openStreetMap?.error}
              >
                {results.openStreetMap && !results.openStreetMap.error ? <CheckCircle size={20} /> : <XCircle size={20} />}
                OpenStreetMap
              </ServiceHeader>
              
              {results.openStreetMap?.error ? (
                <p style={{ color: '#ef4444' }}>{results.openStreetMap.error}</p>
              ) : results.openStreetMap ? (
                <div>
                  <p><strong>Địa chỉ:</strong> {results.openStreetMap.formattedAddress}</p>
                  <p><strong>Tọa độ:</strong> {results.openStreetMap.lat.toFixed(6)}, {results.openStreetMap.lng.toFixed(6)}</p>
                  <p><strong>Thời gian:</strong> {results.openStreetMap.responseTime}ms</p>
                </div>
              ) : (
                <p>Service không khả dụng</p>
              )}
            </ServiceResult>
          </ResultsGrid>
        )}
        
        {results?.comparison && (
          <div style={{ marginTop: '20px', padding: '16px', background: '#f3f4f6', borderRadius: '8px' }}>
            <h4>So sánh kết quả:</h4>
            <p><strong>Độ chênh lệch tọa độ:</strong> {results.comparison.coordinateDifference}</p>
            <p><strong>Thời gian phản hồi:</strong> {results.comparison.responseTimeDiff}</p>
            <p><strong>Đánh giá:</strong> {results.comparison.accuracy}</p>
          </div>
        )}
      </TestSection>
    </ComparisonContainer>
  );
};

export default GeocodingComparison;