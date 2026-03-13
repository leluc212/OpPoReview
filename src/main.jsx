import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import amplifyClient to ensure Amplify is configured before app starts
import './utils/amplifyClient';

// Remove StrictMode to prevent double useEffect calls that can interfere with auth
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
