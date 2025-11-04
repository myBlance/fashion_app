import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress, TextField } from '@mui/material';
import '../../styles/Authtabs.css';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import React from 'react';


const LoginPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { loginAs } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(false);
  
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 10000);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
                username,
                password
            },
        );

    const { token, role, userId } = res.data; // server phải trả userId

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      if (role === 'admin') {
        loginAs('admin');
        navigate('/admin');
      } else if (role === 'client') {
        loginAs('client', userId); // đồng bộ giỏ hàng
        navigate('/');
      } else {
        alert('Vai trò không hợp lệ');
      }
    } catch (error) {
      alert('Sai tài khoản hoặc mật khẩu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

// const LoginPage = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = React.useState(false);
//     const { loginAs } = useAuth();
//     const navigate = useNavigate();

//     const handleLogin = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (username === 'admin' && password === '1') {
//             loginAs('admin');
//             sessionStorage.setItem('user', JSON.stringify({ username, role: 'admin' }));
//             navigate('/admin');
//         } else if (username === 'client' && password === '1') {
//             loginAs('client');
//             sessionStorage.setItem('user', JSON.stringify({ username, role: 'admin' }));
//             navigate('/');
//         } else {
//             alert('Sai tài khoản hoặc mật khẩu');
//         }
//     };

    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="tab-container">
            <h2>Đăng nhập</h2>
            <form className="tab-form" onSubmit={handleLogin}>
                <TextField
                    id="filled-multiline-flexible"
                    maxRows={4}
                    label="Email"
                    variant="filled"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{
                        width: '100%',
                        '& .MuiFilledInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: '4px',
                            color: '#000000',
                            border: '2px solid #999999',
                            boxShadow: 'none',
                            paddingLeft: '5px',
                            transition: 'background-color 0s', // không đổi màu khi hover
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.5)', // giữ nguyên màu khi hover
                            },'&.Mui-focused': {
                                backgroundColor: 'rgba(255, 255, 255, 0.5)', // giữ nguyên khi focus
                            },
                            '&:before': {
                                borderBottom: 'none !important',
                            },
                            '&:after': {
                                borderBottom: 'none !important',
                            },
                            '&:hover:before': {
                                borderBottom: 'none !important',
                            },
                            '& input': {
                                caretColor: '#000000',
                            },
                            '& input:-webkit-autofill': {
                                WebkitBoxShadow: '0 0 0 1000px rgba(0,0,0,0) inset !important',
                                WebkitTextFillColor: '#000000 !important',
                                transition: 'background-color 0s 600000s, color 0s 600000s',
                                borderRadius:'40px',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#000000',
                            left: '5px',
                            '&.Mui-focused': {
                                color: '#000000',
                            },
                        },
                    }}
                />
                <TextField
                    id="filled-multiline-flexible"          
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Mật khẩu"
                    maxRows={4}
                    variant="filled"
                    type={showPassword ? 'text' : 'password'}
                    sx={{
                        mb: 3,
                        mt: 3,
                        width: '100%',
                        '& .MuiFilledInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: '4px',
                            color: '#000000',
                            border: '2px solid #999999',
                            boxShadow: 'none',
                            paddingLeft: '5px',
                            transition: 'background-color 0s', // không đổi màu khi hover
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.5)', // giữ nguyên màu khi hover
                            },'&.Mui-focused': {
                                backgroundColor: 'rgba(255, 255, 255, 0.5)', // giữ nguyên khi focus
                            },
                            '&:before': {
                                borderBottom: 'none !important',
                            },
                            '&:after': {
                                borderBottom: 'none !important',
                            },
                            '&:hover:before': {
                                borderBottom: 'none !important',
                            },
                            '& input': {
                                caretColor: '#000000',
                            },
                            '& input:-webkit-autofill': {
                                WebkitBoxShadow: '0 0 0 1000px rgba(0,0,0,0) inset !important',
                                WebkitTextFillColor: '#000000 !important',
                                transition: 'background-color 0s 600000s, color 0s 600000s',
                                borderRadius:'40px',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#000000',
                            left: '5px',
                            '&.Mui-focused': {
                                color: '#000000',
                            },
                        },
                    }}
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
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, backgroundColor: '#ca161c', color: '#fff' }}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
                </Button>
                <div className="login-links">
                    <a href="/forgot-password">Quên mật khẩu?</a>
                    <p>client: client - 1</p><p>admin: admin - 1</p>
                    <span>
                        Chưa có tài khoản? <a href="/auth?tab=register">Đăng ký</a>
                    </span>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
