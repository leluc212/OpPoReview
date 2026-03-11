import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Amplify v6 will be configured in amplifyClient.js when first imported
// No need to configure here to avoid double configuration

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
