import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Disable console output in production to hide internal logs from end users
if (import.meta.env.PROD) {
  const noop = () => {};
  console.log = noop;
  console.info = noop;
  console.debug = noop;
  console.warn = noop;
  // Keep console.error for critical issues
}

// Import amplifyClient to ensure Amplify is configured before app starts
// Dynamically load amplifyClient before rendering to avoid Vite prebundle/export-shape issues
(async () => {
  await import('./utils/amplifyClient');

  // Remove StrictMode to prevent double useEffect calls that can interfere with auth
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
  );
})();
