import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    fontFamily: 'system-ui, sans-serif',
                    padding: '24px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        maxWidth: '550px',
                        width: '100%',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}>
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: '16px'
                        }}>⚠️</div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', color: '#dc2626' }}>
                            Something went wrong
                        </h2>
                        <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '24px' }}>
                            An error occurred while loading this page. This could be due to missing data or a runtime error inside the APK container.
                        </p>

                        <div style={{
                            textAlign: 'left',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '24px',
                            overflowX: 'auto',
                            maxHeight: '200px'
                        }}>
                            <p style={{
                                fontWeight: 'bold',
                                color: '#1e293b',
                                margin: '0 0 8px',
                                fontFamily: 'monospace',
                                fontSize: '0.85rem'
                            }}>
                                {this.state.error && this.state.error.toString()}
                            </p>
                            <pre style={{
                                margin: 0,
                                fontFamily: 'monospace',
                                fontSize: '0.8rem',
                                color: '#334155',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all'
                            }}>
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={() => {
                                    window.location.hash = '#/learn';
                                    window.location.reload();
                                }}
                                style={{
                                    padding: '12px 20px',
                                    backgroundColor: '#0f172a',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Back to Dashboard
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    padding: '12px 20px',
                                    backgroundColor: '#e2e8f0',
                                    color: '#0f172a',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
