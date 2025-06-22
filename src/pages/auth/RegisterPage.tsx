import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import '../../styles/Authtabs.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const  navigate  = useNavigate();

const handleRegister = async () => {
  if (!firstName || !lastName || !email || !phone || !password || !confirm) {
    alert('Vui lòng nhập đầy đủ thông tin.');
    return;
  }

  if (password !== confirm) {
    alert('Mật khẩu xác nhận không khớp.');
    return;
  }

  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirm,
    });
    navigate ('/auth?tab=login'); 
    alert(res.data.message || 'Đăng ký thành công!');
  } catch (err: any) {
    if (err.response) {
      alert(err.response.data.message || 'Đăng ký thất bại');
    } else {
      alert('Lỗi kết nối máy chủ');
    }
    console.error(err);
  }
};

  return (
    <div className='tab-container'>
      <h2>Đăng ký</h2>
      <form className='tab-form' onSubmit={(e) => e.preventDefault()}>
        <TextField
          label="Họ"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Tên"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Số điện thoại"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
        <TextField
          label="Xác nhận mật khẩu"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
