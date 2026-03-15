import React, { useState } from 'react';
import styled from 'styled-components';
import AddressInput from './AddressInput';

const TestContainer = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TestTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const TestResult = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #007bff;
`;

const AddressInputTest = () => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
    console.log('Address changed:', newAddress);
  };

  const handleCoordinatesChange = (newCoordinates) => {
    setCoordinates(newCoordinates);
    console.log('Coordinates changed:', newCoordinates);
  };

  return (
    <TestContainer>
      <TestTitle>Test AddressInput Component</TestTitle>
      
      <AddressInput
        value={address}
        onChange={handleAddressChange}
        onCoordinatesChange={handleCoordinatesChange}
        placeholder="Nhập địa chỉ để test (VD: số 47 đường 5B, Long Bình, Thủ Đức)"
        showCoordinates={true}
      />
      
      <TestResult>
        <h4>Kết quả:</h4>
        <p><strong>Địa chỉ:</strong> {address || 'Chưa nhập'}</p>
        {coordinates && (
          <div>
            <p><strong>Tọa độ GPS:</strong></p>
            <p>Latitude: {coordinates.lat}</p>
            <p>Longitude: {coordinates.lng}</p>
          </div>
        )}
      </TestResult>
    </TestContainer>
  );
};

export default AddressInputTest;