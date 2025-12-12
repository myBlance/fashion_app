import { Button } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthTextField from '../../components/Client/Common/AuthTextField';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/Authtabs.css';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !phone || !password || !confirm) {
      showToast('Vui lòng nhập đầy đủ thông tin.', 'warning');
      return;
    }

    if (password !== confirm) {
      showToast('Mật khẩu xác nhận không khớp.', 'warning');
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
      showToast(res.data.message || 'Đăng ký thành công', 'success');
      // Delay navigation slightly to let toast show
      setTimeout(() => {
        navigate('/auth?tab=login');
      }, 1500);
    } catch (err: any) {
      if (err.response) {
        showToast(err.response.data.message || 'Đăng ký thất bại', 'error');
      } else {
        showToast('Lỗi kết nối máy chủ', 'error');
      }
      console.error(err);
    }
  };

  return (
    <div className='tab-container'>
      <h2>Đăng ký</h2>
      <form className='tab-form' onSubmit={(e) => e.preventDefault()}>
        <AuthTextField
          label="Họ"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <AuthTextField
          label="Tên"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <AuthTextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthTextField
          label="Số điện thoại"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <AuthTextField
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AuthTextField
          label="Xác nhận mật khẩu"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
