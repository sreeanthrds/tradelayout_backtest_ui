
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ChartErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Chart Error:", error);
    console.error("Component Stack:", errorInfo.componentStack);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-500 flex flex-col items-center justify-center h-full">
          <p className="mb-2 font-medium">Chart failed to render</p>
          <p className="text-xs text-red-400">
            {this.state.error?.message || "An unknown error occurred."}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
