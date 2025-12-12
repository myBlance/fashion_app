import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Badge, Box } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';

interface NavbarIconsProps {
    onToggleMenu: () => void;
}

const NavbarIcons: React.FC<NavbarIconsProps> = ({ onToggleMenu }) => {
    const navigate = useNavigate();
    const cartItems = useAppSelector((state) => state.cart.items);
    const wishlistItems = useAppSelector((state) => state.wishlist.items);

    const totalQuantity = cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
    const wishlistCount = wishlistItems?.length || 0;

    return (
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

            <div className="hamburger-menu" onClick={onToggleMenu}>
                <div></div><div></div><div></div>
            </div>
        </div>
    );
};

export default NavbarIcons;
