import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';                          // router version
import Enhanced from './surge-selector-enhanced'; // demo version
import { Provider } from './lib/store';           // used by router app
import { BrowserRouter } from 'react-router-dom';
import './index.css';

const params = new URLSearchParams(window.location.search);

// Demo if:
//  - ?demo=1        (URL flag)
//  - or VITE_DEMO=1 (build-time flag)
const DEMO_FLAG =
  params.get('demo') === '1' ||
  import.meta.env.VITE_DEMO === '1';

const Root = DEMO_FLAG ? (
  <Enhanced />
) : (
  <BrowserRouter>
    <Provider>
      <App />
    </Provider>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{Root}</React.StrictMode>
);
