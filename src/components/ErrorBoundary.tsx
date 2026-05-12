import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return this.props.fallback || (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh', gap: '1rem',
          padding: '2rem', color: 'var(--text-muted)', textAlign: 'center',
        }}>
          <h2 style={{ color: 'var(--danger)' }}>Algo salió mal</h2>
          <p style={{ fontSize: '0.85rem' }}>Ocurrió un error inesperado. Recargá la página.</p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.reload(); }}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-sm)',
              background: 'var(--primary)', color: '#000', border: 'none',
              cursor: 'pointer', fontWeight: 600,
            }}
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
