import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Eye, Trash2 } from 'lucide-react';
import { uploadCV, getCVInfo, deleteCV } from '../services/cvUploadService';
import { useAuth } from '../context/AuthContext';
import { fetchAuthSession } from 'aws-amplify/auth';
import DeleteConfirmModal from './DeleteConfirmModal';

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
  padding: 20px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s;
  
  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const FileIcon = styled.div`
  width: 52px;
  height: 52px;
  background: #3b82f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileDate = styled.div`
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const IconButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: 1px solid ${props => props.$variant === 'danger' ? '#fecaca' : '#e2e8f0'};
  background: ${props => props.$variant === 'danger' ? '#fef2f2' : '#f8fafc'};
  color: ${props => props.$variant === 'danger' ? '#dc2626' : '#475569'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 16px;

  &:hover {
    background: ${props => props.$variant === 'danger' ? '#fee2e2' : '#f1f5f9'};
    border-color: ${props => props.$variant === 'danger' ? '#fca5a5' : '#cbd5e1'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
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
  width: ${props => props.progress}%;
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
  const { user, isLoading } = useAuth();
  const [userId, setUserId] = useState(null);
  const [cvInfo, setCvInfo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState(true);
  const fileInputRef = React.useRef(null);

  // Get userId directly from Cognito token
  useEffect(() => {
    const getUserId = async () => {
      try {
        console.log('🔍 [CVUpload] Getting userId from Cognito...');
        const session = await fetchAuthSession();
        const userIdFromToken = session.tokens?.idToken?.payload?.sub;
        
        if (userIdFromToken) {
          console.log('✅ [CVUpload] UserId from Cognito:', userIdFromToken);
          setUserId(userIdFromToken);
        } else {
          console.warn('⚠️ [CVUpload] No userId in Cognito token');
        }
      } catch (error) {
        console.error('❌ [CVUpload] Error getting userId:', error);
      } finally {
        setLoadingUserId(false);
      }
    };

    if (!isLoading) {
      getUserId();
    }
  }, [isLoading]);

  const loadCVInfo = async () => {
    try {
      console.log('🔍 [CVUpload] loadCVInfo - userId:', userId);
      if (!userId) {
        console.warn('⚠️ [CVUpload] Cannot load CV info - no userId');
        return;
      }
      
      const info = await getCVInfo(userId);
      console.log('✅ [CVUpload] CV info loaded:', info);
      setCvInfo(info);
    } catch (error) {
      console.error('❌ [CVUpload] Error loading CV info:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      console.log('✅ [CVUpload] UserId available, loading CV info...');
      loadCVInfo();
    }
  }, [userId]);

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
      console.log('📤 [CVUpload] Starting upload...');
      console.log('📤 [CVUpload] User ID:', userId);
      console.log('📤 [CVUpload] File:', file.name, file.type, file.size);
      
      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadCV(userId, file);
      
      console.log('✅ [CVUpload] Upload result:', result);
      
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
      console.error('❌ [CVUpload] Upload error:', error);
      setError(error.message || 'Upload thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);

    try {
      await deleteCV(userId);
      setCvInfo(null);
      setSuccess('Đã xóa CV thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Xóa CV thất bại. Vui lòng thử lại.');
    }
  };

  const handleView = async () => {
    try {
      setError('');
      
      // Refresh URL trước khi xem (để đảm bảo URL chưa hết hạn)
      console.log('🔍 [CVUpload] Refreshing CV URL before viewing...');
      const refreshedInfo = await getCVInfo(userId);
      
      if (!refreshedInfo || !refreshedInfo.cvUrl) {
        throw new Error('Không tìm thấy CV. Vui lòng tải lên lại.');
      }
      
      // Cập nhật cvInfo với URL mới
      setCvInfo(refreshedInfo);
      
      // Mở CV trực tiếp trong tab mới - browser sẽ hiển thị PDF viewer
      console.log('✅ [CVUpload] Opening CV in new tab...');
      const newWindow = window.open(refreshedInfo.cvUrl, '_blank');
      
      // Fallback nếu popup bị block
      if (!newWindow) {
        setError('Popup bị chặn. Vui lòng cho phép popup hoặc thử lại.');
      }
      
    } catch (error) {
      console.error('❌ [CVUpload] Error viewing CV:', error);
      setError(error.message || 'Không thể mở CV. Vui lòng thử lại.');
    }
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
    <>
      <CVUploadContainer>
        <Title>
          📄 CV / Hồ Sơ
        </Title>

        {loadingUserId ? (
          <UploadArea>
            <UploadIcon>⏳</UploadIcon>
            <UploadText>Đang tải thông tin người dùng...</UploadText>
          </UploadArea>
        ) : !userId ? (
          <UploadArea>
            <UploadIcon>⚠️</UploadIcon>
            <UploadText style={{ color: '#dc2626' }}>
              Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.
            </UploadText>
          </UploadArea>
        ) : !cvInfo ? (
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
                <ProgressFill progress={progress} />
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
                <Eye size={18} />
              </IconButton>
              <IconButton 
                $variant="danger" 
                onClick={() => setShowDeleteModal(true)}
                title="Xóa CV"
              >
                <Trash2 size={18} />
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

      {showDeleteModal && (
        <DeleteConfirmModal
          title="Xóa CV?"
          message="Bạn có chắc muốn xóa CV này? Hành động này không thể hoàn tác."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};

export default CVUpload;
