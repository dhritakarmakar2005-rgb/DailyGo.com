import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

// Prevent uncaught errors or unhandled rejections from crashing the whole app silently
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.warn('[Application Error Handled]:', event?.error || event?.message);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.warn('[Application Unhandled Rejection Handled]:', event?.reason);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

