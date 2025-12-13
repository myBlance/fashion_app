import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import { Badge } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';

interface MobileBottomNavProps {
    onToggleMenu: () => void;
    mobileMenuOpen: boolean;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onToggleMenu, mobileMenuOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Redux selectors
    const cartItems = useAppSelector((state) => state.cart.items);
    const wishlistItems = useAppSelector((state) => state.wishlist.items);

    const totalQuantity = cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
    const wishlistCount = wishlistItems?.length || 0;

    const getActiveTab = () => {
        if (mobileMenuOpen) return 'menu'; // Ưu tiên check menu mở trước

        const currentPath = location.pathname;
        if (currentPath.startsWith('/cart')) return 'cart';
        if (currentPath.startsWith('/wishlist')) return 'wishlist';
        if (currentPath === '/') return 'home';
        if (currentPath.startsWith('/orders')) return 'orders';
        if (currentPath.startsWith('/profile')) return 'profile';
        return '';
    };

    const activeTab = getActiveTab();

    const handleNavigation = (path: string) => {
        if (mobileMenuOpen) {
            onToggleMenu();
        }
        navigate(path);
    };

    return (
        <div className="navbar-bottom-mobile">
            {/* 1. Giỏ hàng */}
            <div
                className={`bottom-nav-item ${activeTab === 'cart' ? 'active' : ''}`}
                onClick={() => handleNavigation('/cart')}
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
                onClick={() => handleNavigation('/wishlist')}
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
                onClick={() => handleNavigation('/')}
            >
                <div className="nav-icon-wrapper">
                    <HomeOutlinedIcon className={activeTab === 'home' ? 'active-icon' : ''} />
                </div>
            </div>

            {/* 4. DANH MỤC (Toggle Menu) */}
            <div
                className={`bottom-nav-item ${mobileMenuOpen ? 'active' : ''}`}
                onClick={onToggleMenu}
            >
                <div className="nav-icon-wrapper">
                    <WidgetsOutlinedIcon className={mobileMenuOpen ? 'active-icon' : ''} />
                </div>
            </div>

            {/* 5. Tài khoản */}
            <div
                className={`bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => handleNavigation('/profile')}
            >
                <div className="nav-icon-wrapper">
                    <PermIdentityOutlinedIcon className={activeTab === 'profile' ? 'active-icon' : ''} />
                </div>
            </div>
        </div>
    );
};

export default MobileBottomNav;
