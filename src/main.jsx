import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import JynxRoot from './jynx/JynxRoot.jsx';

import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/app.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <JynxRoot />
  </React.StrictMode>,
);
