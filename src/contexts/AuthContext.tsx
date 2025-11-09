import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clearCart, syncCartAfterLogin } from '../store/cartSlice';
import { useAppDispatch } from './../store/hooks';
import { useNavigate } from 'react-router-dom'; // Thêm import

type Role = 'admin' | 'client' | null;

type AuthContextType = {
  role: Role;
  userId: string | null;
  loading: boolean;
  loginAs: (role: Role, userId?: string) => void;
  logout: () => void;
  checkAuthStatus: () => void; // Hàm mới để kiểm tra phiên
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Khởi tạo navigate
  const dispatch = useAppDispatch();

  // Hàm kiểm tra phiên đăng nhập
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Không có token → đăng xuất
      logout();
      return;
    }

    // Giải mã token để kiểm tra hết hạn (nếu cần)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Thời gian hết hạn tính bằng ms
      if (Date.now() >= exp) {
        // Token đã hết hạn → đăng xuất
        logout();
        return;
      }
    } catch (e) {
      console.error('Lỗi khi giải mã token:', e);
      logout();
      return;
    }

    // Token còn hiệu lực
    const storedRole = sessionStorage.getItem('role') as Role | null;
    const storedUserId = sessionStorage.getItem('userId');
    if (storedRole) setRole(storedRole);
    if (storedUserId) setUserId(storedUserId);
    setLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const loginAs = (newRole: Role, newUserId?: string) => {
    if (newRole) sessionStorage.setItem('role', newRole);
    else sessionStorage.removeItem('role');

    if (newUserId) sessionStorage.setItem('userId', newUserId);
    else sessionStorage.removeItem('userId');

    setRole(newRole);
    setUserId(newUserId || null);

    if (newUserId) {
      dispatch(syncCartAfterLogin([]));
    }
  };

  const logout = () => {
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('userId');
    setRole(null);
    setUserId(null);

    dispatch(clearCart());
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // ✅ Điều hướng về trang chủ khi đăng xuất
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ role, userId, loading, loginAs, logout, checkAuthStatus }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};