import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { clientRoutes, adminRoutes } from './routes';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import PrivateRoute from './components/Client/PrivateRoute';
import Login from './layouts/Login'; // Đã có trong routes nhưng vẫn cần import

const App: React.FC = () => {
    return (
        <Routes>
            {/* Đường dẫn login không dùng layout */}
            <Route path="/login" element={<Login />} />

            {/* Routes cho Client có layout dùng Outlet */}
            <Route
                path="/"
                element={
                    <PrivateRoute element={<ClientLayout />} auth="client" />
                }
            >
                {clientRoutes
                    .filter(route => route.path !== '/login')
                    .map(({ path, element }, index) => (
                        <Route
                            key={index}
                            path={path === '/' ? '' : path.slice(1)}
                            element={element}
                        />
                    ))}
            </Route>

            {/* Routes cho Admin có layout dùng Outlet */}
            <Route
                path="/admin"
                element={
                    <PrivateRoute element={<AdminLayout />} auth="admin" />
                }
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
