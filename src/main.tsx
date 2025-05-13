import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';

const rootElement = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </Router>
        </Provider>
    </React.StrictMode>
);
