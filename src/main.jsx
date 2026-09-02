import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/app.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Error boundary so any throw shows up on screen instead of going black
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    // Surface the error in the browser console for debugging
    console.error('App crashed:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', color: '#e8f5e9', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#ff5757' }}>Something went wrong.</h1>
          <pre style={{ background: '#1a2320', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
            {String(this.state.error?.stack || this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

root.render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>
);
