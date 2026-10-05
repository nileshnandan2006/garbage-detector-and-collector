import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CleanSight Caught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-md border border-red-500/30 rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">CleanSight Service Notice</h1>
            <p className="text-slate-400 text-sm mb-6">
              An unexpected display issue occurred. You can safely reload the page or reset the app cache.
            </p>
            {this.state.error && (
              <div className="bg-slate-950/80 rounded-xl p-3 mb-6 text-left border border-slate-700/50">
                <p className="text-xs font-mono text-red-300 break-words">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition shadow-lg shadow-emerald-900/30 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Application
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                  } catch {
                    // ignore
                  }
                  window.location.href = '/';
                }}
                className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-medium rounded-xl transition cursor-pointer"
              >
                Clear Cache & Restart
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
