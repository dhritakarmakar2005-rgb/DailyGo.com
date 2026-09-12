import React, { ErrorInfo, ReactNode } from 'react';
import { safeStorage } from '../../utils/storage';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetDataAndReload = () => {
    safeStorage.clearAppKeys();
    window.location.href = window.location.pathname;
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-xl font-black text-slate-900 mb-2">
              Something unexpected occurred
            </h1>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              DailyGo encountered a temporary glitch while rendering this screen. You can reload the app or reset local cache to continue smoothly.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 bg-slate-100 rounded-xl text-left overflow-x-auto max-h-32 text-[11px] font-mono text-slate-700">
                <div className="font-bold text-rose-600 mb-1">
                  {this.state.error.name}: {this.state.error.message}
                </div>
                {this.state.error.stack && (
                  <div className="text-[10px] text-slate-500 whitespace-pre-wrap">
                    {this.state.error.stack.split('\n').slice(0, 3).join('\n')}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-sm transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetDataAndReload}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reset Local Cache</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
