import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clearCart, syncCartAfterLogin } from '../store/cartSlice';
import { useAppDispatch } from './../store/hooks';
import { useNavigate } from 'react-router-dom';

type Role = 'admin' | 'client' | null;

type AuthContextType = {
  role: Role;
  userId: string | null;
  loading: boolean;
  loginAs: (role: Role, userId?: string) => void;
  logout: () => void;
  checkAuthStatus: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      logout();
      return;
    }

    // ✅ Kiểm tra token có đúng định dạng JWT không
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.warn('Token không đúng định dạng JWT');
      logout();
      return;
    }

    try {
      const payload = JSON.parse(atob(tokenParts[1]));
      const exp = payload.exp * 1000;
      if (Date.now() >= exp) {
        logout();
        return;
      }
    } catch (e) {
      console.error('Lỗi khi giải mã token:', e);
      logout();
      return;
    }

    const storedRole = localStorage.getItem('role') as Role | null; // ✅ Dùng localStorage thay vì sessionStorage
    const storedUserId = localStorage.getItem('userId'); // ✅ Dùng localStorage thay vì sessionStorage
    if (storedRole) setRole(storedRole);
    if (storedUserId) setUserId(storedUserId);
  };

  useEffect(() => {
    checkAuthStatus();
    setLoading(false); // ✅ Đảm bảo setLoading(false) được gọi
  }, []);

  const loginAs = (newRole: Role, newUserId?: string) => {
    if (newRole) localStorage.setItem('role', newRole);
    else localStorage.removeItem('role');

    if (newUserId) localStorage.setItem('userId', newUserId);
    else localStorage.removeItem('userId');

    setRole(newRole);
    setUserId(newUserId || null);

    if (newUserId) {
      dispatch(syncCartAfterLogin([]));
    }
  };

  const logout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setRole(null);
    setUserId(null);

    dispatch(clearCart());
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/');
  };

  // ✅ Luôn render children, không phụ thuộc vào loading
  return (
    <AuthContext.Provider value={{ role, userId, loading, loginAs, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};