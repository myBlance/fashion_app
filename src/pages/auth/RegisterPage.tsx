// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import '../../styles/Authtabs.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm] = useState('');

  const handleRegister = () => {
    if (!username || !password || !confirm) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (password !== confirm) {
      alert('Mật khẩu xác nhận không khớp.');
      return;
    }

    // TODO: Gửi dữ liệu đăng ký lên server hoặc xử lý logic
    alert(`Đăng ký thành công cho tài khoản ${username}`);
  };

    return (
        <div className='tab-container'>
            <h2>Đăng ký</h2>
            <form className='tab-form' onSubmit={(e) => e.preventDefault()}>
                <TextField
                    label="Họ"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Tên"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Số điện thoại"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Mật khẩu"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, backgroundColor: '#ca161c', color: '#fff' }}
                
                    onClick={handleRegister}
                >
                    Đăng ký
                </Button>
            </form>
        </div>
    );
};

export default RegisterPage;
