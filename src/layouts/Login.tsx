import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const { loginAs } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (role: 'admin' | 'client') => {
        loginAs(role);
        navigate(role === 'admin' ? '/admin/dashboard' : '/');
    };

	return (
		<div>
            <h2>Đăng nhập</h2>
            <button onClick={() => handleLogin('client')}>Đăng nhập Client</button>
            <button onClick={() => handleLogin('admin')}>Đăng nhập Admin</button>
		</div>
	);	
};

export default Login;
