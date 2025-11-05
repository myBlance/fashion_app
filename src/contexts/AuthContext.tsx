import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clearCart, syncCartAfterLogin } from '../store/cartSlice';
import { useAppDispatch } from './../store/hooks';

type Role = 'admin' | 'client' | null;

type AuthContextType = {
  role: Role;
  userId: string | null;
  loading: boolean;          // thêm dòng này
  loginAs: (role: Role, userId?: string) => void;
  logout: () => void;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch(); 

  useEffect(() => {
    const storedRole = sessionStorage.getItem('role') as Role | null;
    const storedUserId = sessionStorage.getItem('userId');
    if (storedRole) setRole(storedRole);
    if (storedUserId) setUserId(storedUserId);
    setLoading(false);
  }, []);

  const loginAs = (newRole: Role, newUserId?: string) => {
    if (newRole) sessionStorage.setItem('role', newRole);
    else sessionStorage.removeItem('role');

    if (newUserId) sessionStorage.setItem('userId', newUserId);
    else sessionStorage.removeItem('userId');

    setRole(newRole);
    setUserId(newUserId || null);

    // If syncCartAfterLogin expects CartItem[], you need to provide it here.
    // For example, if you want to sync an empty cart after login:
    if (newUserId) {
      dispatch(syncCartAfterLogin([]));
    }
    // If syncCartAfterLogin should accept userId, update its definition accordingly.
  };

  const logout = () => {
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('userId');
    setRole(null);
    setUserId(null);

    dispatch(clearCart());
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ role, userId, loading, loginAs, logout }}>
  {!loading && children}
</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
