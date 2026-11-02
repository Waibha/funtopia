import React from 'react';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI Error caught by MADAGASCAR ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#300E54] text-white flex items-center justify-center p-6 select-none font-sans">
          <div className="max-w-md w-full bg-[#200B3B] border-4 border-[#0D0518] rounded-3xl p-6 sm:p-8 shadow-[8px_10px_0px_#0D0518] text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FF5FA0] border-3 border-[#0D0518] shadow-pixel-sm mx-auto flex items-center justify-center text-3xl mb-4">
              👾
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFDE25] text-[#0D0518] font-arcade text-[10px] font-black uppercase mb-3 border-2 border-[#0D0518]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>ARCADE EXCEPTION CAUGHT</span>
            </div>
            <h2 className="font-bungee text-2xl text-[#FFDE25] mb-2">
              SOMETHING GLITCHED
            </h2>
            <p className="font-mono text-xs text-purple-200 mb-6 bg-[#150428] p-3 rounded-xl border border-purple-500/30">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="btn-pixel-yellow flex-1 py-2.5 px-4 text-xs font-mono font-bold flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RETRY</span>
              </button>
              <button
                onClick={this.handleReset}
                className="btn-pixel-white flex-1 py-2.5 px-4 text-xs font-mono font-bold flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>GO HOME</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
