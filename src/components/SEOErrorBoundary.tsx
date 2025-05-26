import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class SEOErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const componentName = this.props.componentName || "SEO Component";
    console.error(
      `[${componentName}] Error caught by boundary:`,
      error,
      errorInfo
    );

    // Report to analytics if available
    if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
      window.gtag("event", "exception", {
        description: `${componentName}: ${error.message}`,
        fatal: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Return fallback UI or nothing to prevent layout breaking
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

export default SEOErrorBoundary;
