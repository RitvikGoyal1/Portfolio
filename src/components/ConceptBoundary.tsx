import { Component, type ReactNode } from 'react';

export default class ConceptBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return (
      <main className="concept-loading">
        <span>One moment.</span>
        <p>This scene couldn’t load. Try another design or reload the page.</p>
        <button onClick={() => window.location.reload()}>Reload</button>
        <a href="mailto:connect@ritvikgoyal.com">connect@ritvikgoyal.com</a>
      </main>
    );
    return this.props.children;
  }
}
