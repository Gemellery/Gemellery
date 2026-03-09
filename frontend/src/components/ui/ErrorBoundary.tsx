import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ServerErrorFallback
          onReset={() => this.setState({ hasError: false })}
        />
      );
    }
    return this.props.children;
  }
}

function ServerErrorFallback({ onReset }: { onReset: () => void }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden px-6">
      <div className="absolute -top-24 -left-24 w-[450px] h-[450px] rounded-full border border-red-800/10 pointer-events-none" />
      <div className="absolute -bottom-44 -right-44 w-[650px] h-[650px] rounded-full border border-red-800/10 pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg w-full py-16">
        <div className="flex justify-center mb-8">
          <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
            <polygon points="40,8 8,28 8,52 40,72 40,40"  fill="rgba(180,60,60,0.12)" stroke="#b43c3c" strokeWidth="1.5" />
            <polygon points="42,6 74,26 74,54 42,74 42,40" fill="rgba(180,60,60,0.08)" stroke="#b43c3c" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="40" y1="8"  x2="42" y2="40" stroke="#b43c3c" strokeWidth="2" />
            <line x1="42" y1="40" x2="40" y2="72" stroke="#b43c3c" strokeWidth="2" />
          </svg>
        </div>

        <p className="text-8xl font-light tracking-[0.2em] text-red-700 leading-none mb-4">500</p>
        <div className="w-14 h-px bg-red-700/60 mx-auto mb-6" />
        <h1 className="text-2xl font-normal tracking-[0.2em] uppercase text-foreground mb-5">
          Something Went Wrong
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-12 text-sm">
          An unexpected error occurred. Our craftsmen have been notified and
          are working to restore everything to its polished state.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={onReset}
            className="px-8 py-3 bg-red-700 text-white text-xs font-semibold tracking-[0.15em] uppercase hover:bg-red-800 transition-colors duration-200 cursor-pointer"
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-8 py-3 bg-transparent text-red-700 border border-red-700 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-red-700/10 transition-colors duration-200 cursor-pointer"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
