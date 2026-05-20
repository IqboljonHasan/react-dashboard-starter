import { Button, Result } from 'antd';
import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <Result
            status="error"
            title="Something went wrong"
            subTitle={this.state.error?.message}
            extra={
              <Button type="primary" onClick={() => this.setState({ hasError: false })}>
                Try Again
              </Button>
            }
          />
        )
      );
    }
    return this.props.children;
  }
}
