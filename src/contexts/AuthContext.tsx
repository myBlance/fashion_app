import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartService } from '../services/cartService';
import { WishlistService } from '../services/wishlistService';
import { clearCart, syncCartAfterLogin } from '../store/cartSlice';
import { clearWishlist, syncWishlistAfterLogin } from '../store/wishlistSlice';
import { getLocalCart } from '../utils/cartStorage';
import { clearLocalWishlist, getLocalWishlist } from '../utils/wishlistStorage';
import { useAppDispatch } from './../store/hooks';

type Role = 'admin' | 'client' | null;

type AuthContextType = {
  role: Role;

  userId: string | null;
  loading: boolean;
  loginAs: (role: Role, userId?: string) => Promise<void>;
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

    // Kiểm tra token có đúng định dạng JWT không
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

    const storedRole = localStorage.getItem('role') as Role | null; // Dùng localStorage thay vì sessionStorage
    const storedUserId = localStorage.getItem('userId'); // Dùng localStorage thay vì sessionStorage
    if (storedRole) setRole(storedRole);
    if (storedUserId) setUserId(storedUserId);
  };

  useEffect(() => {
    checkAuthStatus();
    setLoading(false); // Đảm bảo setLoading(false) được gọi
  }, []);

  const loginAs = async (newRole: Role, newUserId?: string) => {
    if (newRole) localStorage.setItem('role', newRole);
    else localStorage.removeItem('role');

    if (newUserId) localStorage.setItem('userId', newUserId);
    else localStorage.removeItem('userId');

    setRole(newRole);
    setUserId(newUserId || null);

    // Merge guest cart with user cart when logging in
    if (newUserId) {
      try {
        // 1. Sync cart
        const guestCart = getLocalCart();
        if (guestCart.length > 0) {
          const mergedCart = await CartService.syncCart(newUserId, guestCart);
          dispatch(syncCartAfterLogin(mergedCart));
        } else {
          const userCart = await CartService.getCart(newUserId);
          dispatch(syncCartAfterLogin(userCart));
        }

        // 2. Sync wishlist
        const guestWishlist = getLocalWishlist();
        if (guestWishlist.length > 0) {
          // Fetch current backend wishlist first to avoid toggling (removing) existing items
          const currentBackendWishlist = await WishlistService.getWishlist(newUserId);

          for (const productId of guestWishlist) {
            // Only add if NOT already in backend wishlist
            if (!currentBackendWishlist.includes(productId)) {
              try {
                await WishlistService.toggleItem(newUserId, productId);
              } catch (err) {
                console.error('Error syncing wishlist item:', productId, err);
              }
            }
          }

          // Clear local wishlist after syncing to prevent leaking to next user
          clearLocalWishlist();
        }

        // Fetch final wishlist from backend
        const finalWishlist = await WishlistService.getWishlist(newUserId);
        dispatch(syncWishlistAfterLogin(finalWishlist));

      } catch (err) {
        console.error('Error syncing cart/wishlist after login:', err);
        dispatch(syncCartAfterLogin([]));
        dispatch(syncWishlistAfterLogin([]));
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setRole(null);
    setUserId(null);

    dispatch(clearCart());
    dispatch(clearWishlist()); // Clear Redux state
    clearLocalWishlist(); // Clear guest data on logout in storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/');
  };

  // Luôn render children, không phụ thuộc vào loading
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