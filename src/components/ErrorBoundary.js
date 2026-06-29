import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { reportError } from '../lib/reportError';

/*
  Recoverable error boundary.

  Most of our reported crashes are transient DOM teardown races on game-room
  pages — React's commit phase tries to removeChild a node that a sibling
  library (react-confetti's canvas) or a browser translation extension already
  moved/removed, throwing "Failed to execute 'removeChild' on 'Node'". These
  are not real logic bugs and a remount almost always succeeds.

  So on the first error we auto-retry once (remount the subtree). If it throws
  again we show a friendly fallback instead of a white screen. Either way the
  error is reported so we keep visibility.
*/
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.autoRetried = false;
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    reportError('react_error_boundary', error?.message || 'render error', {
      stack: error?.stack,
      info: (info && info.componentStack ? info.componentStack : '').slice(0, 300),
    });
    // One automatic recovery attempt for transient commit/teardown races.
    if (!this.autoRetried) {
      this.autoRetried = true;
      this.resetTimer = setTimeout(() => this.setState({ hasError: false }), 50);
    }
  }

  componentWillUnmount() {
    if (this.resetTimer) clearTimeout(this.resetTimer);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <div className="text-5xl mb-3" aria-hidden="true">🐑</div>
          <h1 className="text-2xl font-bold text-[#2D1810] mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Oops — that glitched
          </h1>
          <p className="text-[#4A2D1B] mb-5 max-w-sm">
            Something hiccuped on this page. A quick reload usually sorts it out — if you were in a game room, you’ll rejoin automatically.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-2xl text-white font-bold"
              style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
            >
              Reload
            </button>
            <Link
              to="/"
              className="px-5 py-3 rounded-2xl border-2 border-[#FFE8C8] text-[#2D1810] font-semibold hover:border-[#E84A8B]"
            >
              Back to games
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Keyed by pathname so navigating away clears a stuck boundary and gives each
// route a fresh recovery budget.
export default function RouteErrorBoundary({ children }) {
  const { pathname } = useLocation();
  return <ErrorBoundary key={pathname}>{children}</ErrorBoundary>;
}
