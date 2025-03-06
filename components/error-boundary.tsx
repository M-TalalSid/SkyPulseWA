"use client"

import React from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  fallback: React.ReactNode
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg bg-white/5 backdrop-blur-sm p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-4 text-white/80">{this.state.error?.message || "An unexpected error occurred"}</p>
          <Button onClick={() => this.setState({ hasError: false })} className="bg-blue-600 hover:bg-blue-700">
            Try again
          </Button>
          <div className="mt-4">{this.props.fallback}</div>
        </div>
      )
    }

    return this.props.children
  }
}

