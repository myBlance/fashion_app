import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
    element: React.ReactNode;
    auth: 'admin' | 'client';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, auth }) => {
    const { role } = useAuth();
    // Kiểm tra quyền truy cập
    if (role !== auth) {
        return <Navigate to="/login" replace />; // Chuyển hướng đến trang login nếu không có quyền
    }

    return <>{element}</>; // Hiển thị element nếu quyền truy cập hợp lệ
};

export default PrivateRoute;
