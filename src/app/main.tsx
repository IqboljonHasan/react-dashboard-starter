import React from 'react';
import ReactDOM from 'react-dom/client';

import '@/shared/i18n'; // initializes i18next
import '@/shared/lib/dayjs'; // configures dayjs plugins + uz locale
import './styles/index.css';

import { RootProvider } from './providers';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RootProvider />
  </React.StrictMode>,
);
