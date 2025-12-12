import axios from 'axios';
import { AuthProvider } from 'react-admin';

const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
                username,
                password
            });
            const { token, role, userId } = res.data;

            if (role !== 'admin') {
                throw new Error('Tài khoản này không có quyền truy cập quản trị');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            if (userId) localStorage.setItem('userId', userId);

            return Promise.resolve();
        } catch (error) {
            console.error('Login failed:', error);
            return Promise.reject(new Error('Tên đăng nhập hoặc mật khẩu không đúng'));
        }
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        return Promise.resolve('/');
    },
    checkAuth: () => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token && role === 'admin') {
            return Promise.resolve();
        }
        return Promise.reject();
    },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: () => {
        const role = localStorage.getItem('role');
        return role ? Promise.resolve(role) : Promise.reject();
    },
};

export default authProvider;
