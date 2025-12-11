import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
    element: React.ReactNode;
    auth: 'admin' | 'client';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, auth }) => {
    const { role, loading } = useAuth();

    // Chờ loading hoàn tất trước khi check role
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                Đang tải...
            </div>
        );
    }

    // Kiểm tra quyền truy cập sau khi loading xong
    if (role !== auth) {
        return <Navigate to="/auth?tab=login" replace />;
    }

    return <>{element}</>; // Hiển thị element nếu quyền truy cập hợp lệ
};

export default PrivateRoute;
