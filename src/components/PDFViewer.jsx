import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
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
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

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
    max-width: 200px;
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

const PageInfo = styled.div`
  color: white;
  font-size: 14px;
  font-weight: 500;
  padding: 0 12px;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 0 8px;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const PDFContainer = styled.div`
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;
  max-height: 100%;

  .react-pdf__Document {
    display: flex;
    justify-content: center;
  }

  .react-pdf__Page {
    max-width: 100%;
    height: auto !important;
  }

  .react-pdf__Page__canvas {
    max-width: 100%;
    height: auto !important;
  }
`;

const LoadingMessage = styled.div`
  color: white;
  font-size: 16px;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 16px;
  text-align: center;
  padding: 24px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const PDFViewer = ({ fileUrl, fileName, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Không thể tải file PDF. Vui lòng thử lại.');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handlePrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  return (
    <Overlay onClick={onClose}>
      <Header onClick={(e) => e.stopPropagation()}>
        <Title>{fileName || 'CV.pdf'}</Title>
        <Controls>
          {numPages > 1 && (
            <>
              <ControlButton onClick={handlePrevPage} disabled={pageNumber <= 1}>
                <ChevronLeft />
              </ControlButton>
              <PageInfo>
                {pageNumber} / {numPages}
              </PageInfo>
              <ControlButton onClick={handleNextPage} disabled={pageNumber >= numPages}>
                <ChevronRight />
              </ControlButton>
            </>
          )}
          <ControlButton onClick={handleZoomOut} disabled={scale <= 0.5}>
            <ZoomOut />
          </ControlButton>
          <ControlButton onClick={handleZoomIn} disabled={scale >= 3.0}>
            <ZoomIn />
          </ControlButton>
          <ControlButton onClick={handleDownload}>
            <Download />
          </ControlButton>
          <ControlButton onClick={onClose}>
            <X />
          </ControlButton>
        </Controls>
      </Header>
      <Content onClick={(e) => e.stopPropagation()}>
        {error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <PDFContainer>
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<LoadingMessage>Đang tải PDF...</LoadingMessage>}
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </PDFContainer>
        )}
      </Content>
    </Overlay>
  );
};

export default PDFViewer;
