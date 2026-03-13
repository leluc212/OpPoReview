import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { uploadCV, getCVInfo, deleteCV, downloadCV } from '../services/cvUploadService';
import { useAuth } from '../context/AuthContext';

const CVUploadContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => props.$isDragging ? '#3b82f6' : '#e2e8f0'};
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  background: ${props => props.$isDragging ? '#eff6ff' : '#f8fafc'};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const UploadText = styled.p`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
`;

const UploadHint = styled.p`
  font-size: 12px;
  color: #94a3b8;
`;

const FileInput = styled.input`
  display: none;
`;

const CVPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f1f5f9;
  border-radius: 8px;
  margin-top: 16px;
`;

const FileIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #3b82f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
`;

const FileInfo = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
`;

const FileDate = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: none;
  background: ${props => props.$variant === 'danger' ? '#fee2e2' : '#e0e7ff'};
  color: ${props => props.$variant === 'danger' ? '#dc2626' : '#3b82f6'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$variant === 'danger' ? '#fecaca' : '#c7d2fe'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 12px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #3b82f6;
  width: ${props => props.$progress}%;
  transition: width 0.3s;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  margin-top: 12px;
`;

const SuccessMessage = styled.div`
  background: #d1fae5;
  color: #059669;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  margin-top: 12px;
`;

const CVUpload = () => {
  const { user } = useAuth();
  const [cvInfo, setCvInfo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (user?.userId) {
      loadCVInfo();
    }
  }, [user]);

  const loadCVInfo = async () => {
    try {
      const info = await getCVInfo(user.userId);
      setCvInfo(info);
    } catch (error) {
      console.error('Error loading CV info:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    setError('');
    setSuccess('');
    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadCV(user.userId, file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setCvInfo({
        cvUrl: result.cvUrl,
        cvFileName: result.cvFileName,
        cvUploadDate: result.profile?.cvUploadDate || new Date().toISOString()
      });
      
      setSuccess('Upload CV thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Upload thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa CV này?')) {
      return;
    }

    try {
      await deleteCV(user.userId);
      setCvInfo(null);
      setSuccess('Đã xóa CV thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Xóa CV thất bại. Vui lòng thử lại.');
    }
  };

  const handleDownload = async () => {
    try {
      await downloadCV(cvInfo.cvUrl, cvInfo.cvFileName);
    } catch (error) {
      setError('Tải CV thất bại. Vui lòng thử lại.');
    }
  };

  const handleView = () => {
    window.open(cvInfo.cvUrl, '_blank');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <CVUploadContainer>
      <Title>
        📄 CV / Hồ Sơ
      </Title>

      {!cvInfo ? (
        <>
          <UploadArea
            $isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon>📁</UploadIcon>
            <UploadText>
              {uploading ? 'Đang tải lên...' : 'Kéo thả file CV vào đây hoặc click để chọn'}
            </UploadText>
            <UploadHint>
              Hỗ trợ: PDF, DOC, DOCX (Tối đa 5MB)
            </UploadHint>
          </UploadArea>
          
          <FileInput
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            disabled={uploading}
          />

          {uploading && (
            <ProgressBar>
              <ProgressFill $progress={progress} />
            </ProgressBar>
          )}
        </>
      ) : (
        <CVPreview>
          <FileIcon>📄</FileIcon>
          <FileInfo>
            <FileName>{cvInfo.cvFileName}</FileName>
            <FileDate>Tải lên: {formatDate(cvInfo.cvUploadDate)}</FileDate>
          </FileInfo>
          <ButtonGroup>
            <IconButton onClick={handleView} title="Xem CV">
              👁️
            </IconButton>
            <IconButton onClick={handleDownload} title="Tải xuống">
              ⬇️
            </IconButton>
            <IconButton 
              $variant="danger" 
              onClick={handleDelete}
              title="Xóa CV"
            >
              🗑️
            </IconButton>
          </ButtonGroup>
        </CVPreview>
      )}

      {cvInfo && (
        <UploadArea
          style={{ marginTop: '16px', padding: '16px' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadText style={{ marginBottom: 0 }}>
            📤 Tải lên CV mới
          </UploadText>
          <FileInput
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </UploadArea>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
    </CVUploadContainer>
  );
};

export default CVUpload;
