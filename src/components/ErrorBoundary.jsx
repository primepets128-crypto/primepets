import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0502] text-white flex flex-col items-center justify-center p-6">
          <div className="bg-[#1a0f08] border border-[#d07e20]/30 rounded-3xl p-8 max-w-4xl w-full text-center shadow-[0_0_40px_rgba(208,126,32,0.15)] flex flex-col items-center">
            <h1 className="text-3xl font-black text-[#d07e20] mb-4">Oops! Something broke.</h1>
            <p className="text-orange-200/70 mb-6">We're sorry, an unexpected error occurred. Our engineers have been notified.</p>
            
            {this.state.error && (
              <div className="w-full text-left bg-black/50 rounded-xl p-4 mb-8 overflow-auto border border-red-900/30">
                <p className="text-red-400 font-bold mb-2 font-mono text-sm">{this.state.error.toString()}</p>
                <pre className="text-red-300/70 font-mono text-xs whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              </div>
            )}

            <button 
              onClick={() => window.location.href = '/'} 
              className="bg-gradient-to-r from-[#d07e20] to-[#a65d14] text-white font-bold py-3 px-8 rounded-xl hover:scale-105 transition-transform inline-block"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
