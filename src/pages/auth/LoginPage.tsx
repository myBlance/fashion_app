import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button, CircularProgress } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthTextField from '../../components/Client/Common/AuthTextField';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/Authtabs.css';


const LoginPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { loginAs } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [loading, setLoading] = React.useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 10000); // Helper timeout
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
                username,
                password
            });

            const { token, role, userId } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            if (role === 'admin') {
                loginAs('admin');
                navigate('/admin');
                showToast('Đăng nhập quản trị viên thành công', 'success');
            } else if (role === 'client') {
                loginAs('client', userId);
                navigate('/');
                showToast('Đăng nhập thành công', 'success');
            } else {
                showToast('Vai trò không hợp lệ', 'error');
            }
        } catch (error) {
            showToast('Tài khoản hoặc mật khẩu không chính xác', 'error');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="tab-container">
            <h2>Đăng nhập</h2>
            <form className="tab-form" onSubmit={handleLogin}>
                <AuthTextField
                    id="username"
                    label="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <AuthTextField
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Mật khẩu"
                    type={showPassword ? 'text' : 'password'}
                    sx={{ mt: 1, mb: 3 }} // Override default mb:2 if needed, or keep it. Original had mt:3 mb:3.
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleTogglePassword}
                                    edge="end"
                                    sx={{
                                        color: '#000000',
                                    }}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    className="auth-button"
                    sx={{ mt: 2, backgroundColor: '#ca161c', color: '#fff' }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
                </Button>
                <div className="login-links">
                    <Link to="/forgot-password">Quên mật khẩu?</Link>
                    <span>
                        Chưa có tài khoản? <Link to="/auth?tab=register">Đăng ký</Link>
                    </span>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
