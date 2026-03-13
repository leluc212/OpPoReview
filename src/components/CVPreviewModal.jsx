import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker - use cdnjs instead of unpkg for better CORS support
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  flex-direction: column;
  z-index: 10000;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const Title = styled.h3`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;

  @media (max-width: 768px) {
    font-size: 15px;
    max-width: 180px;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 24px;
  position: relative;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const PDFContainer = styled.div`
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  overflow: auto;
  max-height: 85vh;
  max-width: 1200px;
  width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  @media (max-width: 768px) {
    width: 95vw;
    padding: 12px;
    border-radius: 4px;
    max-height: 80vh;
  }

  .react-pdf__Document {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
  }

  .react-pdf__Page {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    overflow: hidden;
    max-width: 100%;
  }

  .react-pdf__Page__canvas {
    max-width: 100%;
    height: auto !important;
    display: block;
  }

  /* Text layer styles */
  .react-pdf__Page__textContent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    opacity: 0.2;
    line-height: 1;
  }

  .react-pdf__Page__textContent span {
    color: transparent;
    position: absolute;
    white-space: pre;
    cursor: text;
    transform-origin: 0% 0%;
  }

  /* Annotation layer styles */
  .react-pdf__Page__annotations {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .react-pdf__Page__annotations .linkAnnotation > a {
    position: absolute;
    font-size: 1em;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const PageNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;

  @media (max-width: 768px) {
    gap: 8px;
    padding: 6px 12px;
  }
`;

const PageInfo = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  min-width: 80px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 12px;
    min-width: 60px;
  }
`;

const NavButton = styled.button`
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const LoadingMessage = styled.div`
  color: white;
  font-size: 16px;
  text-align: center;
  padding: 40px;
  
  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 16px;
  text-align: center;
  padding: 24px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.3);
  max-width: 500px;
`;

const ZoomIndicator = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  pointer-events: none;
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.3s;

  @media (max-width: 768px) {
    bottom: 16px;
    font-size: 12px;
    padding: 6px 12px;
  }
`;

const CVPreviewModal = ({ cvUrl, fileName, onClose, onDownload }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1.5); // Increased from 1.2 to 1.5 for better visibility
  const [showZoomIndicator, setShowZoomIndicator] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [useIframe, setUseIframe] = useState(false); // Fallback to iframe if PDF.js fails

  // Fetch PDF with proper CORS handling
  React.useEffect(() => {
    if (!cvUrl) return;
    
    const fetchPDF = async () => {
      try {
        console.log('📥 Fetching PDF from:', cvUrl);
        setLoading(true);
        setError(null);
        
        const response = await fetch(cvUrl, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'application/pdf'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        console.log('✅ PDF fetched successfully, size:', blob.size);
        
        // Create object URL instead of data URL for better performance
        const objectUrl = URL.createObjectURL(blob);
        setPdfData(objectUrl);
        
      } catch (err) {
        console.error('❌ Error fetching PDF:', err);
        setError('Không thể tải file CV. Vui lòng thử tải xuống để xem.');
        setLoading(false);
      }
    };
    
    fetchPDF();
    
    // Cleanup object URL on unmount
    return () => {
      if (pdfData && pdfData.startsWith('blob:')) {
        URL.revokeObjectURL(pdfData);
      }
    };
  }, [cvUrl]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    console.log('⚠️ PDF.js failed, falling back to iframe viewer');
    setLoading(false);
    setUseIframe(true); // Fallback to iframe
  };

  const handleZoomIn = () => {
    setScale(prev => {
      const newScale = Math.min(prev + 0.2, 3.0);
      showZoomMessage();
      return newScale;
    });
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.2, 0.5);
      showZoomMessage();
      return newScale;
    });
  };

  const handlePrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  const showZoomMessage = () => {
    setShowZoomIndicator(true);
    setTimeout(() => setShowZoomIndicator(false), 1000);
  };

  const getZoomLabel = () => {
    return `${Math.round(scale * 100)}%`;
  };

  // Check if file is PDF
  const isPDF = fileName?.toLowerCase().endsWith('.pdf') || cvUrl?.includes('.pdf');

  return (
    <Overlay onClick={onClose}>
      {/* Header hidden when using iframe */}
      {!useIframe && (
        <Header onClick={(e) => e.stopPropagation()}>
          <Title>{fileName || 'CV.pdf'}</Title>
          <Controls>
            {isPDF && numPages > 1 && (
              <>
                <ControlButton onClick={handlePrevPage} disabled={pageNumber <= 1} title="Trang trước">
                  <ChevronLeft />
                </ControlButton>
                <ControlButton onClick={handleNextPage} disabled={pageNumber >= numPages} title="Trang sau">
                  <ChevronRight />
                </ControlButton>
              </>
            )}
            <ControlButton 
              onClick={handleZoomOut} 
              disabled={scale <= 0.5}
              title="Thu nhỏ"
            >
              <ZoomOut />
            </ControlButton>
            <ControlButton 
              onClick={handleZoomIn} 
              disabled={scale >= 3.0}
              title="Phóng to"
            >
              <ZoomIn />
            </ControlButton>
            {onDownload && (
              <ControlButton onClick={onDownload} title="Tải xuống">
                <Download />
              </ControlButton>
            )}
            <ControlButton onClick={onClose} title="Đóng">
              <X />
            </ControlButton>
          </Controls>
        </Header>
      )}
      
      <Content onClick={(e) => e.stopPropagation()}>
        {error ? (
          <ErrorMessage>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            {error}
            {onDownload && (
              <div style={{ marginTop: '16px' }}>
                <ControlButton 
                  onClick={onDownload}
                  style={{ 
                    width: 'auto', 
                    padding: '0 20px',
                    background: 'rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <Download style={{ marginRight: '8px' }} />
                  Tải xuống CV
                </ControlButton>
              </div>
            )}
          </ErrorMessage>
        ) : useIframe && isPDF ? (
          <>
            {/* Floating close button for iframe mode */}
            <div style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 10001
            }}>
              <ControlButton 
                onClick={onClose} 
                title="Đóng"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <X />
              </ControlButton>
            </div>
            
            <PDFContainer style={{ 
              width: '100vw', 
              maxWidth: '100vw',
              height: '100vh',
              maxHeight: '100vh',
              padding: '0',
              margin: '0',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '0',
              boxShadow: 'none'
            }}>
              <iframe
                src={pdfData || cvUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '0',
                  backgroundColor: 'white'
                }}
                title={fileName || 'CV Preview'}
              />
            </PDFContainer>
          </>
        ) : isPDF ? (
          <PDFContainer>
            {numPages > 1 && (
              <PageNavigation>
                <NavButton onClick={handlePrevPage} disabled={pageNumber <= 1}>
                  <ChevronLeft />
                </NavButton>
                <PageInfo>
                  Trang {pageNumber} / {numPages}
                </PageInfo>
                <NavButton onClick={handleNextPage} disabled={pageNumber >= numPages}>
                  <ChevronRight />
                </NavButton>
              </PageNavigation>
            )}
            
            <Document
              file={pdfData || cvUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <LoadingMessage>
                  <div className="spinner" />
                  Đang tải CV...
                </LoadingMessage>
              }
              options={{
                cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/cmaps/`,
                cMapPacked: true,
                withCredentials: false,
                standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/standard_fonts/`,
                disableWorker: false, // Try with worker first
                isEvalSupported: false // Disable eval for security
              }}
            >
              <Page 
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </PDFContainer>
        ) : (
          <ErrorMessage>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            File này không phải PDF. Vui lòng tải xuống để xem.
            {onDownload && (
              <div style={{ marginTop: '16px' }}>
                <ControlButton 
                  onClick={onDownload}
                  style={{ 
                    width: 'auto', 
                    padding: '0 20px',
                    background: 'rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <Download style={{ marginRight: '8px' }} />
                  Tải xuống CV
                </ControlButton>
              </div>
            )}
          </ErrorMessage>
        )}

        <ZoomIndicator $show={showZoomIndicator}>
          {getZoomLabel()}
        </ZoomIndicator>
      </Content>
    </Overlay>
  );
};

export default CVPreviewModal;
