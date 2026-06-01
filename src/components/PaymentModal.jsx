import { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, CheckCircle, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { createPayment, getPaymentStatus } from '../services/paymentService';
import { useLanguage } from '../context/LanguageContext';

// ─── Animations ───────────────────────────────
const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:0.5}`;

// ─── Styled Components ────────────────────────
const Overlay = styled(motion.div)`
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  backdrop-filter: blur(4px);
`;

const Modal = styled(motion.div)`
  background: ${p => p.theme?.colors?.bgLight || '#fff'};
  border-radius: 20px;
  width: 100%; max-width: 480px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.2);
  overflow: hidden;
  position: relative;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #1a62ff 0%, #002e9d 100%);
  padding: 20px 24px;
  display: flex; align-items: center; justify-content: space-between;
`;

const HeaderTitle = styled.div`
  h3 { font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 2px; }
  p  { font-size: 0.8rem; color: rgba(255,255,255,0.75); }
`;

const CloseBtn = styled.button`
  background: rgba(255,255,255,0.15); border: none; border-radius: 8px;
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #fff; transition: background 0.2s;
  &:hover { background: rgba(255,255,255,0.25); }
`;

const Body = styled.div`padding: 24px;`;

const AmountRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  background: #f8fafc; border-radius: 12px; padding: 14px 18px;
  margin-bottom: 20px;
  .label { font-size: 0.82rem; color: #64748b; font-weight: 500; }
  .amount { font-size: 1.4rem; font-weight: 900; color: #1a62ff; }
`;

const QRWrapper = styled.div`
  display: flex; flex-direction: column; align-items: center;
  margin-bottom: 20px;
`;

const QRImg = styled.img`
  width: 200px; height: 200px; border-radius: 12px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
`;

const QRSkeleton = styled.div`
  width: 200px; height: 200px; border-radius: 12px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 400px 100%;
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  animation: shimmer 1.5s infinite;
`;

const CodeBox = styled.div`
  display: flex; align-items: center; gap: 10px;
  background: #f0f4ff; border: 1.5px solid #bfdbfe;
  border-radius: 10px; padding: 12px 16px; margin-bottom: 16px;
`;

const Code = styled.span`
  flex: 1; font-family: monospace; font-size: 1rem;
  font-weight: 700; color: #1a62ff; letter-spacing: 1px;
`;

const CopyBtn = styled.button`
  background: #1a62ff; border: none; border-radius: 7px;
  padding: 6px 12px; color: #fff; font-size: 0.78rem;
  font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px;
  transition: background 0.2s;
  &:hover { background: #002e9d; }
`;

const BankInfo = styled.div`
  background: #f8fafc; border-radius: 10px; padding: 12px 16px;
  margin-bottom: 16px; font-size: 0.84rem;
  div { display: flex; justify-content: space-between; padding: 3px 0; }
  .key { color: #64748b; }
  .val { font-weight: 600; color: #1e293b; }
`;

const StatusRow = styled.div`
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; border-radius: 10px; font-size: 0.85rem; font-weight: 600;
  background: ${p => p.$paid ? '#d1fae5' : '#fef9c3'};
  color: ${p => p.$paid ? '#065f46' : '#92400e'};
  margin-bottom: 16px;
`;

const Spinner = styled.div`
  width: 16px; height: 16px; border: 2px solid currentColor;
  border-top-color: transparent; border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const PulseText = styled.span`animation: ${pulse} 1.5s ease-in-out infinite;`;

const Note = styled.p`
  font-size: 0.78rem; color: #94a3b8; text-align: center; line-height: 1.5;
`;

const SuccessOverlay = styled(motion.div)`
  position: absolute; inset: 0; background: rgba(255,255,255,0.97);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; border-radius: 20px;
  h3 { font-size: 1.2rem; font-weight: 800; color: #065f46; }
  p  { font-size: 0.88rem; color: #64748b; }
`;

// ─── Component ────────────────────────────────
/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onSuccess: (paymentId: string) => void,
 *   userId: string,
 *   packageId: string,
 *   amount: number,
 *   packageName?: string,
 *   duration?: string,
 * }} props
 */
const PaymentModal = ({ isOpen, onClose, onSuccess, userId, packageId, amount, packageName, duration }) => {
  const { language } = useLanguage();
  const vi = language === 'vi';

  const [state, setState] = useState('idle'); // idle | loading | ready | paid | error
  const [payment, setPayment] = useState(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const pollRef = useRef(null);

  // ── Init payment on open ──────────────────
  useEffect(() => {
    if (!isOpen) return;
    setState('loading');
    setPayment(null);
    setErrorMsg('');

    createPayment({ userId, packageId, amount, packageName, duration })
      .then((data) => {
        setPayment(data);
        setState('ready');
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setState('error');
      });

    return () => clearInterval(pollRef.current);
  }, [isOpen, userId, packageId, amount]);

  // ── Poll every 3s when ready ─────────────
  useEffect(() => {
    if (state !== 'ready' || !payment?.paymentId) return;

    // Check immediately on mount
    const checkStatus = async () => {
      try {
        const { status } = await getPaymentStatus(payment.paymentId);
        console.log('💳 Poll status:', status, payment.paymentId);
        if (status === 'paid') {
          clearInterval(pollRef.current);
          setState('paid');
          setTimeout(() => {
            onSuccess?.(payment.paymentId);
            onClose?.();
          }, 2500);
        }
      } catch (err) {
        console.warn('Poll error:', err.message);
      }
    };

    checkStatus();
    pollRef.current = setInterval(checkStatus, 2000);

    return () => clearInterval(pollRef.current);
  }, [state, payment]);

  const handleCopy = useCallback(() => {
    if (!payment?.transferCode) return;
    navigator.clipboard.writeText(payment.transferCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [payment]);

  const handleClose = () => {
    // Chỉ cho đóng khi chưa tạo payment hoặc bị lỗi
    if (state === 'ready' || state === 'loading') return;
    clearInterval(pollRef.current);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <Modal
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Header>
              <HeaderTitle>
                <h3>{vi ? 'Thanh toán chuyển khoản' : 'Bank Transfer Payment'}</h3>
                <p>{packageName || vi ? 'Gói dịch vụ' : 'Service Package'}</p>
              </HeaderTitle>
              <CloseBtn onClick={handleClose}><X size={16} /></CloseBtn>
            </Header>

            <Body>
              {/* Amount */}
              <AmountRow>
                <span className="label">{vi ? 'Số tiền' : 'Amount'}</span>
                <span className="amount">
                  {amount?.toLocaleString('vi-VN')} <small style={{ fontSize: '0.7em', fontWeight: 600 }}>VNĐ</small>
                </span>
              </AmountRow>

              {/* Loading */}
              {state === 'loading' && (
                <QRWrapper>
                  <QRSkeleton />
                  <p style={{ marginTop: 12, fontSize: '0.85rem', color: '#64748b' }}>
                    {vi ? 'Đang tạo mã QR...' : 'Generating QR code...'}
                  </p>
                </QRWrapper>
              )}

              {/* Error */}
              {state === 'error' && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <AlertCircle size={40} color="#dc2626" style={{ marginBottom: 8 }} />
                  <p style={{ color: '#dc2626', fontWeight: 600 }}>{errorMsg}</p>
                </div>
              )}

              {/* Ready */}
              {(state === 'ready' || state === 'paid') && payment && (
                <>
                  {/* QR */}
                  <QRWrapper>
                    <QRImg
                      src={payment.qrUrl}
                      alt="VietQR"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <p style={{ marginTop: 8, fontSize: '0.78rem', color: '#64748b' }}>
                      {vi ? 'Quét mã QR bằng app ngân hàng' : 'Scan with your banking app'}
                    </p>
                  </QRWrapper>

                  {/* Transfer code */}
                  <CodeBox>
                    <Code>{payment.transferCode}</Code>
                    <CopyBtn onClick={handleCopy}>
                      {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                      {copied ? (vi ? 'Đã sao chép' : 'Copied') : (vi ? 'Sao chép' : 'Copy')}
                    </CopyBtn>
                  </CodeBox>

                  {/* Bank info */}
                  <BankInfo>
                    <div><span className="key">{vi ? 'Ngân hàng' : 'Bank'}</span><span className="val">{payment.bankId}</span></div>
                    <div><span className="key">{vi ? 'Số tài khoản' : 'Account No'}</span><span className="val">{payment.accountNo}</span></div>
                    <div><span className="key">{vi ? 'Chủ tài khoản' : 'Account Name'}</span><span className="val">{payment.accountName}</span></div>
                    <div><span className="key">{vi ? 'Nội dung CK' : 'Transfer Note'}</span><span className="val" style={{ color: '#1a62ff' }}>{payment.transferCode}</span></div>
                  </BankInfo>

                  {/* Status */}
                  <StatusRow $paid={state === 'paid'}>
                    {state === 'paid'
                      ? <><CheckCircle size={16} />{vi ? 'Thanh toán thành công!' : 'Payment successful!'}</>
                      : <><Spinner /><PulseText>{vi ? 'Đang chờ thanh toán...' : 'Waiting for payment...'}</PulseText><Clock size={14} /></>
                    }
                  </StatusRow>

                  <Note>
                    {vi
                      ? '⚠ Nhập đúng nội dung chuyển khoản để hệ thống tự động xác nhận. Hệ thống kiểm tra mỗi 10 giây.'
                      : '⚠ Enter the exact transfer note for automatic confirmation. System checks every 10 seconds.'}
                  </Note>
                </>
              )}
            </Body>

            {/* Success overlay */}
            <AnimatePresence>
              {state === 'paid' && (
                <SuccessOverlay
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle size={56} color="#10b981" />
                  <h3>{vi ? 'Thanh toán thành công!' : 'Payment Successful!'}</h3>
                  <p>{vi ? 'Gói dịch vụ đã được kích hoạt.' : 'Your package has been activated.'}</p>
                </SuccessOverlay>
              )}
            </AnimatePresence>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
