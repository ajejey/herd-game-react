import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { installGlobalErrorReporting } from './lib/reportError';

// Capture uncaught JS errors + unhandled promise rejections (fire-and-forget).
installGlobalErrorReporting();

const rootElement = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// react-snap pre-renders static HTML into #root at build time. When that
// snapshot is present, hydrate it; otherwise mount fresh (normal dev/runtime).
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
