import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    handleGoHome = (): void => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-[#0A1128] flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-[#111827] rounded-2xl border border-gray-800 p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-900/30 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>

                        <h1 className="text-2xl font-serif text-white mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-gray-400 mb-6">
                            We encountered an unexpected error. Please try again or return to the home page.
                        </p>

                        {import.meta.env.DEV && this.state.error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-700/30 text-left overflow-auto max-h-40">
                                <p className="text-red-300 text-sm font-mono">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleRetry}
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                  bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-[#0A1128] font-semibold
                  hover:opacity-90 transition-opacity"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                  border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 
                  transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
