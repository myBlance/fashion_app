import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ClientLayout from './layouts/ClientLayout';
import LoginPage from './pages/auth/LoginPage';
import { adminRoutes, clientRoutes } from './routes';
import PrivateRoute from './routes/PrivateRoute';

const App: React.FC = () => {
    return (
        <Routes>
            {/* Trang đăng nhập */}
            <Route path="/auth?tab=login" element={<LoginPage />} />

            {/* Client layout */}
            <Route path="/" element={<ClientLayout />}>
                {clientRoutes.map(({ path, element, auth }, index) => {
                    const routePath = path === '/' ? '' : path.slice(1);
                    const isPrivate = auth === 'client' && (path === '/wishlist' || path === '/cart' || path === '/profile' || path === '/orders');

                    return (
                        <Route
                            key={index}
                            path={routePath}
                            element={isPrivate ? <PrivateRoute element={element} auth="client" /> : element}
                        />
                    );
                })}
            </Route>

            {/* Route riêng cho admin (React-Admin) */}
            {adminRoutes.map(({ path, element }, index) => (
                <Route
                    key={index}
                    path={path}
                    element={<PrivateRoute element={element} auth="admin" />}
                />
            ))}
        </Routes>
    );
};

export default App;
