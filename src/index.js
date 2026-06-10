import React from 'react';
import { createRoot } from 'react-dom/client';
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

// react-snap pre-renders static HTML into #root at build time (Googlebot reads
// that snapshot — SEO intact). We intentionally do NOT hydrateRoot against it:
// the snapshot is captured AFTER framer-motion applies `initial` styles and
// AFTER AdSense injects ad iframes, so hydration reconciliation mismatched the
// live DOM and threw React #418/#423/#425 + removeChild crashes (~900/day).
// These are pure client-side pages with no server state to preserve, so a clean
// createRoot re-render is correct and eliminates the entire mismatch class.
createRoot(rootElement).render(app);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
