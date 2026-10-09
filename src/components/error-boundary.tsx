import { Component, type ReactNode } from "react"

type Props = { children: ReactNode; fallback?: ReactNode }
type State = { failed: boolean }

/**
 * Keeps a decorative subtree from taking the page down with it.
 * PixelBlast throws outright when WebGL is unavailable (locked-down or
 * headless browsers), which would otherwise blank the whole site.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
