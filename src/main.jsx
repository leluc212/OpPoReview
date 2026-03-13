import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import amplifyClient to ensure Amplify is configured before app starts
import './utils/amplifyClient';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
