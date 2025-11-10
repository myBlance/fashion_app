import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchCart } from '../../../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchWishlist } from '../../../store/wishlistSlice';

import '../../../styles/Navbar.css';

const textList = [
  'Dola Style xin chào bạn!',
  'Vô vàn khuyến mãi hấp dẫn đang chờ bạn!',
  'Nhanh tay chọn cho mình những sản phẩm ưng ý nhất!',
];

const placeholders = ['Áo', 'Quần jeans', 'Giày sneaker', 'Váy'];

const Navbar: React.FC = () => {
  const { role, logout, userId } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux state
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // Fetch cart & wishlist immediately after userId is available
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
      dispatch(fetchWishlist(userId));
    }
  }, [userId, dispatch]);

  // Navbar menu
  const [menuActive, setMenuActive] = useState(false);
  const toggleMenu = () => setMenuActive(!menuActive);

  // Banner text
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % textList.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Search placeholder typing effect
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [typedPlaceholder, setTypedPlaceholder] = useState('');
  useEffect(() => {
    const currentText = placeholders[placeholderIndex];
    let charIndex = 0;
    setTypedPlaceholder('');
    const typingInterval = setInterval(() => {
      setTypedPlaceholder((prev) => prev + currentText[charIndex]);
      charIndex++;
      if (charIndex >= currentText.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          setTypedPlaceholder('');
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 3000);
      }
    }, 150);
    return () => clearInterval(typingInterval);
  }, [placeholderIndex]);

  return (
    <div className="navbar">
      {/* Banner */}
      <div className="navbar-banner">
        <img src="/assets/images/banner_top.webp" alt="" />
      </div>

      {/* Navbar Top */}
      <div className="navbar-top">
        <div className="navbar-top-left">
          <p className="text-list">{textList[currentTextIndex]}</p>
        </div>
        <div className="navbar-top-right">
          {role === 'client' ? (
            <>
              <Button onClick={logout}>Đăng xuất</Button>
              <Button>
                <Link to="/profile">Tài khoản</Link>
              </Button>
            </>
          ) : (
            <>
              <Button>
                <Link to="/auth?tab=login">Đăng nhập</Link>
              </Button>
              <Button>
                <Link to="/auth?tab=register">Đăng ký</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Navbar Main */}
      <div className="navbar-main">
        {/* Search */}
        <div className="navbar-search">
          <input type="text" placeholder={typedPlaceholder} className="navbar-search-input" />
          <span className="navbar-search-icon">
            <SearchIcon />
          </span>
        </div>

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/assets/images/logo.webp" alt="" />
        </Link>

        {/* Icons */}
        <div className="navbar-icons">
          <div className="navbar-icon">
            <AssignmentTurnedInOutlinedIcon />
            <span>Kiểm tra</span>
          </div>

          <div className="navbar-icon" onClick={() => navigate('/wishlist')}>
            {wishlistItems.length > 0 ? (
              <FavoriteIcon sx={{ color: '#e91e63' }} />
            ) : (
              <FavoriteBorderIcon />
            )}
            <span>Yêu thích</span>
            {wishlistItems.length > 0 && (
              <span className="navbar-icon-badge">{wishlistItems.length}</span>
            )}
          </div>

          <div className="navbar-icon" onClick={() => navigate('/cart')}>
            <ShoppingCartOutlinedIcon />
            <span>Giỏ hàng</span>
            {totalQuantity > 0 && (
              <span className="navbar-icon-badge">{totalQuantity}</span>
            )}
          </div>

          <div className="hamburger-menu" onClick={toggleMenu}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

      {/* Menu Links */}
      <nav className="navbar-menu">
        <ul>
          <li>
            <Link to="/" className="nav-link">
              Trang chủ
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link to="/shop" className="nav-link">
              Sản phẩm
            </Link>
          </li>
          <li>
            <Link to="/blog" className="nav-link">
              Blog
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">
              Liên hệ
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
