import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchCart } from '../../../store/cartSlice';
import { useAppDispatch } from '../../../store/hooks';
import { fetchWishlist } from '../../../store/wishlistSlice';
import '../../../styles/Navbar.css';
import MobileBottomNav from './MobileBottomNav';
import MobileMenuDrawer from './MobileMenuDrawer';
import NavbarIcons from './NavbarIcons';
import NavbarMenu from './NavbarMenu';
import NavbarSearch from './NavbarSearch';
import NavbarTop from './NavbarTop';

const Navbar: React.FC = () => {
  const { userId } = useAuth();
  const dispatch = useAppDispatch();

  // --- Menu Drawer Logic ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // ✅ Fetch cart & wishlist continuously
  useEffect(() => {
    if (userId) {
      // Fetch immediately
      dispatch(fetchCart(userId));
      dispatch(fetchWishlist(userId));

      // Set up polling every 2 seconds
      const interval = setInterval(() => {
        dispatch(fetchCart(userId));
        dispatch(fetchWishlist(userId));
      }, 2000);

      // Clean up interval on unmount
      return () => clearInterval(interval);
    }
  }, [userId, dispatch]);

  return (
    <div className="navbar">
      <div className="navbar-banner">
        <img src="/assets/images/banner_top.webp" alt="" />
      </div>

      <NavbarTop />

      <div className="navbar-main">
        <NavbarSearch />

        <div className='navbar-logo-icons'>
          <Link to="/" className="navbar-logo">
            <img src="/assets/images/logo.webp" alt="" />
          </Link>

          <NavbarIcons onToggleMenu={toggleMenu} />
        </div>
      </div>

      <NavbarMenu />

      {/* --- DRAWER (Mobile Menu) --- */}
      <MobileMenuDrawer
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      />

      {/* --- MOBILE BOTTOM NAVIGATION BAR --- */}
      <MobileBottomNav
        onToggleMenu={toggleMenu}
        mobileMenuOpen={mobileMenuOpen}
      />
    </div>
  );
};

export default Navbar;