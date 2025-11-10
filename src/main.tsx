import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // ✅ thêm BrowserRouter
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';

class ErrorBoundary extends React.Component<any, { error: Error | null }> {
    constructor(props: any) {
        super(props);
        this.state = { error: null };
    }
    static getDerivedStateFromError(error: Error) {
        return { error };
    }
    componentDidCatch(error: Error, info: any) {
        console.error('ErrorBoundary caught', error, info);
    }
    render() {
        if (this.state.error) {
            return (
                <div style={{ padding: 20 }}>
                    <h2>Ứng dụng gặp lỗi</h2>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

const rootEl = document.getElementById('root') || document.getElementById('app');
if (!rootEl) {
    console.error('No root element found. Check index.html id.');
} else {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
        <React.StrictMode>
            <Provider store={store}>
                <ErrorBoundary>
                
                    <BrowserRouter> 
                        <AuthProvider>
                            <App />
                        </AuthProvider>
                    </BrowserRouter>
                </ErrorBoundary>
            </Provider>
        </React.StrictMode>
    );
}
