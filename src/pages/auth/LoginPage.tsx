// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // hoặc đúng path của bạn
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      loginAs('admin');
      navigate('/admin');
    } else if (username === 'client' && password === 'client123') {
      loginAs('client');
      navigate('/');
    } else {
      alert('Sai tài khoản hoặc mật khẩu');
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Đăng nhập</button>
    </div>
  );
};

export default LoginPage;
