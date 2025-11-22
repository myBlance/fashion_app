import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import SearchIcon from '@mui/icons-material/Search';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';

// --- Import mới cho Menu Drawer ---
import { Collapse } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ListAltIcon from '@mui/icons-material/ListAlt';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';

import { 
  Button, Badge, Box, Drawer, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, Typography, IconButton 
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

const placeholders = ['Áo', 'Quần', 'Đầm', 'Váy'];

const Navbar: React.FC = () => {
  const location = useLocation();
  const { role, logout, userId } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux state
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const totalQuantity = cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  const wishlistCount = wishlistItems?.length || 0;

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
      dispatch(fetchWishlist(userId));
    }
  }, [userId, dispatch]);

  // Banner text
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % textList.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Placeholder typing
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [typedPlaceholder, setTypedPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const currentText = placeholders[placeholderIndex];
    const typingTimer = setTimeout(() => {
      if (!isDeleting) {
        setTypedPlaceholder(currentText.substring(0, typedPlaceholder.length + 1));
        setTypingSpeed(150);
        if (typedPlaceholder === currentText) {
          setTypingSpeed(1500);
          setIsDeleting(true);
        }
      } else {
        setTypedPlaceholder(currentText.substring(0, typedPlaceholder.length - 1));
        setTypingSpeed(50);
        if (typedPlaceholder === '') {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }
      }
    }, typingSpeed);
    return () => clearTimeout(typingTimer);
  }, [typedPlaceholder, isDeleting, placeholderIndex, placeholders]);

  // --- Menu Drawer Logic (Mobile) ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hàm này dùng cho prop onClose của Drawer (cần trả về function event handler)
  const toggleMobileMenu = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setMobileMenuOpen(open);
  };

  // Hàm đóng menu trực tiếp (dùng cho các nút điều hướng)
  const closeMenu = () => setMobileMenuOpen(false);

  const [menuActive, setMenuActive] = useState(false);
  const toggleMenu = () => setMenuActive(!menuActive);

  const getActiveTab = () => {
    const currentPath = location.pathname;
    if (currentPath.startsWith('/cart')) return 'cart';
    if (currentPath.startsWith('/wishlist')) return 'wishlist';
    if (currentPath === '/') return 'home';
    if (currentPath.startsWith('/orders')) return 'orders';
    if (currentPath.startsWith('/profile')) return 'profile';
    if (mobileMenuOpen) return 'menu';
    return '';
  };

  const activeTab = getActiveTab();

  // State cho menu con "Sản phẩm"
  const [openProductSubMenu, setOpenProductSubMenu] = useState(false);
  const handleProductClick = () => {
    setOpenProductSubMenu(!openProductSubMenu);
  };

  // Nội dung Menu Drawer
  const mobileMenuContent = (
    <Box
      sx={{ width: 300, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}
      role="presentation"
      // Lưu ý: Không để onClick={toggleMobileMenu(false)} ở Box ngoài cùng này
      // vì nó sẽ chặn việc click mở menu con (collapse).
      onKeyDown={toggleMobileMenu(false)}
    >
      {/* Header Đỏ */}
      <Box sx={{ bgcolor: '#b11116', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '18px' }}>DOLA STYLE</Typography>
        <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ overflowY: 'auto', flex: 1 }}>
        {/* MENU CHÍNH */}
        <Box sx={{ bgcolor: '#b11116', color: 'white', px: 2, py: 1, mt: 0 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '14px' }}>MENU CHÍNH</Typography>
        </Box>
        
        <List sx={{ p: 0 }}>
          {[
            { text: 'Trang chủ', path: '/' },
            { text: 'Giới thiệu', path: '/about' },
            { 
              text: 'Sản phẩm', 
              hasSub: true, 
              subMenu: [
                { text: 'Tất cả sản phẩm', path: '/shop' },
                { text: 'Quần', path: '/shop?category=quan' },
                { text: 'Áo', path: '/shop?category=ao' },
                { text: 'Đầm', path: '/shop?category=dam' },
                { text: 'Váy', path: '/shop?category=vay' },
              ]
            },
            { text: 'Tin tức', path: '/blog' },
            { text: 'Liên hệ', path: '/contact' },
          ].map((item, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding sx={{ borderBottom: '1px solid #eee', display: 'block' }}>
                <ListItemButton 
                  onClick={() => {
                    if (item.hasSub) {
                      handleProductClick(); // Chỉ mở menu con, không đóng drawer
                    } else {
                      navigate(item.path || '/'); 
                      setMobileMenuOpen(false); // Đóng drawer
                    }
                  }}
                >
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ fontSize: '14px', fontWeight: 500, color: '#333' }} 
                  />
                  {item.hasSub && (
                    openProductSubMenu ? <ExpandLess sx={{ color: '#666' }} /> : <ExpandMore sx={{ color: '#666' }} />
                  )}
                </ListItemButton>

                {item.hasSub && item.subMenu && (
                  <Collapse in={openProductSubMenu} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ bgcolor: '#f9f9f9' }}>
                      {item.subMenu.map((subItem, subIndex) => (
                        <ListItemButton 
                          key={subIndex} 
                          sx={{ pl: 4, borderTop: '1px solid #f0f0f0' }} 
                          onClick={() => {
                            navigate(subItem.path);
                            setMobileMenuOpen(false); // Đóng drawer sau khi chọn mục con
                          }}
                        >
                          <ListItemText 
                            primary={subItem.text} 
                            primaryTypographyProps={{ fontSize: '13px', color: '#555' }} 
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </ListItem>
            </React.Fragment>
          ))}
        </List>

        {/* CÔNG CỤ */}
        <Box sx={{ bgcolor: '#b11116', color: 'white', px: 2, py: 1, mt: 0 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '14px' }}>CÔNG CỤ</Typography>
        </Box>

        <List sx={{ p: 0 }}>
          {role !== 'client' && (
            <>
              <ListItem disablePadding sx={{ borderBottom: '1px solid #eee' }}>
                <ListItemButton onClick={() => { navigate('/auth?tab=login'); setMobileMenuOpen(false); }}>
                  <ListItemIcon sx={{ minWidth: 35, color: '#b11116' }}><LoginIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Đăng nhập" primaryTypographyProps={{ fontSize: '14px' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ borderBottom: '1px solid #eee' }}>
                <ListItemButton onClick={() => { navigate('/auth?tab=register'); setMobileMenuOpen(false); }}>
                  <ListItemIcon sx={{ minWidth: 35, color: '#b11116' }}><AppRegistrationIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Đăng ký" primaryTypographyProps={{ fontSize: '14px' }} />
                </ListItemButton>
              </ListItem>
            </>
          )}

          <ListItem disablePadding sx={{ borderBottom: '1px solid #eee' }}>
            <ListItemButton onClick={() => { navigate('/wishlist'); setMobileMenuOpen(false); }}>
              <ListItemIcon sx={{ minWidth: 35, color: '#b11116' }}><FavoriteBorderOutlinedIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary={`Danh sách yêu thích (${wishlistCount})`} primaryTypographyProps={{ fontSize: '14px' }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ borderBottom: '1px solid #eee' }}>
            <ListItemButton onClick={() => { navigate('/orders'); setMobileMenuOpen(false); }}>
              <ListItemIcon sx={{ minWidth: 35, color: '#b11116' }}><ListAltIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Kiểm tra đơn hàng" primaryTypographyProps={{ fontSize: '14px' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <div className="navbar">
      <div className="navbar-banner">
        <img src="/assets/images/banner_top.webp" alt="" />
      </div>

      <div className="navbar-top">
        <div className="navbar-top-left">
          <p className="text-list">{textList[currentTextIndex]}</p>
        </div>
        <div className="navbar-top-right">
          {role === 'client' ? (
            <>
              <Button onClick={logout}>Đăng xuất</Button>
              <Button><Link to="/profile">Tài khoản</Link></Button>
            </>
          ) : (
            <>
              <Button><Link to="/auth?tab=login">Đăng nhập</Link></Button>
              <Button><Link to="/auth?tab=register">Đăng ký</Link></Button>
            </>
          )}
        </div>
      </div>

      <div className="navbar-main">
        <div className="navbar-search">
          <input type="text" placeholder={typedPlaceholder} className="navbar-search-input" />
          <span className="navbar-search-icon"><SearchIcon /></span>
        </div>
        
        <div className='navbar-logo-icons'>
          <Link to="/" className="navbar-logo">
            <img src="/assets/images/logo.webp" alt="" />
          </Link>

          <div className="navbar-icons">
            <Box className="navbar-icon" onClick={() => navigate('/orders')} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <AssignmentTurnedInOutlinedIcon />
              <span>Kiểm tra</span>
            </Box>

            <Box className="navbar-icon" onClick={() => navigate('/wishlist')} sx={{ display: 'flex' }}>
              <Badge badgeContent={wishlistCount} color="error">
                <FavoriteBorderOutlinedIcon 
                  className={wishlistCount > 0 ? 'wishlist-filled' : ''}
                  sx={{ color: wishlistCount > 0 ? '#e91e63' : 'inherit' }}
                />
              </Badge>
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>Yêu thích</Box>
            </Box>

            <Box className="navbar-icon" onClick={() => navigate('/cart')} sx={{ display: 'flex' }}>
              <Badge badgeContent={totalQuantity} color="error">
                <ShoppingCartOutlinedIcon />
              </Badge>
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>Giỏ hàng</Box>
            </Box>

            <div className="hamburger-menu" onClick={toggleMenu}>
              <div></div><div></div><div></div>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar-menu">
        <ul>
          <li><Link to="/" className="nav-link">Trang chủ</Link></li>
          <li><Link to="/about" className="nav-link">Giới thiệu</Link></li>
          <li><Link to="/shop" className="nav-link">Sản phẩm</Link></li>
          <li><Link to="/blog" className="nav-link">Blog</Link></li>
          <li><Link to="/contact" className="nav-link">Liên hệ</Link></li>
        </ul>
      </nav>

      {/* --- DRAWER (Mobile Menu) --- */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        // ✅ Prop này quan trọng: Nó giúp đóng Drawer khi click ra ngoài (backdrop)
        onClose={toggleMobileMenu(false)} 
        sx={{ zIndex: 1300 }}
      >
        {mobileMenuContent}
      </Drawer>

      {/* --- MOBILE BOTTOM NAVIGATION BAR --- */}
      <div className="navbar-bottom-mobile">
        {/* 1. Giỏ hàng */}
        <div 
          className={`bottom-nav-item ${activeTab === 'cart' ? 'active' : ''}`} 
          onClick={() => { navigate('/cart'); closeMenu(); }} // ✅ Click là đóng menu
        >
          <div className="nav-icon-wrapper">
            <Badge badgeContent={totalQuantity} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: '16px', minWidth: '16px' } }}>
              <ShoppingCartOutlinedIcon className={activeTab === 'cart' ? 'active-icon' : ''} />
            </Badge>
          </div>
        </div>
        
        {/* 2. Yêu thích */}
        <div 
          className={`bottom-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`} 
          onClick={() => { navigate('/wishlist'); closeMenu(); }} // ✅ Click là đóng menu
        >
          <div className="nav-icon-wrapper">
            <Badge badgeContent={wishlistCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: '16px', minWidth: '16px' } }}>
              <FavoriteBorderOutlinedIcon className={activeTab === 'wishlist' ? 'active-icon' : ''} />
            </Badge>
          </div>
        </div>
        
        {/* 3. Trang chủ */}
        <div 
          className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`} 
          onClick={() => { navigate('/'); closeMenu(); }} // ✅ Click là đóng menu
        >
          <div className="nav-icon-wrapper">
            <HomeOutlinedIcon className={activeTab === 'home' ? 'active-icon' : ''} />
          </div>
        </div>
        
        {/* 4. DANH MỤC (Toggle Menu) */}
        <div 
          className={`bottom-nav-item ${mobileMenuOpen ? 'active' : ''}`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} // ✅ Toggle bật/tắt
        >
          <div className="nav-icon-wrapper">
            <WidgetsOutlinedIcon className={mobileMenuOpen ? 'active-icon' : ''} />
          </div>
        </div>
        
        {/* 5. Tài khoản */}
        <div 
          className={`bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`} 
          onClick={() => { navigate('/profile'); closeMenu(); }} // ✅ Click là đóng menu
        >
          <div className="nav-icon-wrapper">
            <PermIdentityOutlinedIcon className={activeTab === 'profile' ? 'active-icon' : ''} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;