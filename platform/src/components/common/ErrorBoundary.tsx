/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */

import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details to console in development
    if (import.meta.env.DEV) {
      console.error('Error Boundary caught an error:')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
    }

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>

              <p className="text-gray-600 mb-4">
                We encountered an unexpected error. Please try refreshing the page.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <details className="mb-4 p-3 bg-gray-100 rounded text-sm">
                  <summary className="cursor-pointer font-semibold">Error Details</summary>
                  <pre className="mt-2 text-xs overflow-auto">
                    {this.state.error.message ?? ''}
                    {'\n'}
                    {this.state.error.stack ?? ''}
                  </pre>
                </details>
              )}

              <div className="flex gap-2">
                <button
                  onClick={this.handleReset}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
