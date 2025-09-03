import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { Provider } from './lib/store';
import { TranslationProvider } from './lib/i18n';
import { ThemeProvider } from './lib/theme';
import './index.css';
import { initAnalytics } from './lib/analytics';

if (typeof window !== 'undefined') initAnalytics();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <TranslationProvider>
          <Provider>
            <App />
          </Provider>
        </TranslationProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
