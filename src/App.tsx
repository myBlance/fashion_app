import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { clientRoutes, adminRoutes } from './routes';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import PrivateRoute from './components/Client/PrivateRoute';
import LoginPage from './pages/auth/LoginPage';

const App: React.FC = () => {
    return (
        <Routes>
            {/* Đăng nhập không cần layout */}
            <Route path="/login" element={<LoginPage />} />

            {/* Client layout cho các route client */}
            <Route path="/" element={<ClientLayout />}>
                {clientRoutes.map(({ path, element, auth }, index) => {
                    const routePath = path === '/' ? '' : path.slice(1);
                    const routeElement =
                        auth === 'client' && (path === '/wishlist' || path === '/cart') ? (
                            <PrivateRoute element={element} auth="client" />
                        ) : (
                            element
                        );

                    return (
                        <Route
                            key={index}
                            path={routePath}
                            element={routeElement}
                        />
                    );
                })}
            </Route>

            {/* Admin layout + bảo vệ bằng PrivateRoute */}
            <Route
                path="/admin"
                element={<PrivateRoute element={<AdminLayout />} auth="admin" />}
            >
                {adminRoutes.map(({ path, element }, index) => (
                    <Route
                        key={index}
                        path={path.replace('/admin/', '')}
                        element={element}
                    />
                ))}
            </Route>
        </Routes>
    );
};

export default App;
