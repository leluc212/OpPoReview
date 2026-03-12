import { useState, useCallback } from 'react';

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = toastId++;
    
    setToasts((prev) => [...prev, { id, type, title, message }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, title = 'Thành công') => {
    return addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((message, title = 'Lỗi') => {
    return addToast({ type: 'error', title, message });
  }, [addToast]);

  const warning = useCallback((message, title = 'Cảnh báo') => {
    return addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((message, title = 'Thông tin') => {
    return addToast({ type: 'info', title, message });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
};
