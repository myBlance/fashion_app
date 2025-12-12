import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import {
    Box,
    Collapse,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppSelector } from '../../../store/hooks';

interface MobileMenuDrawerProps {
    open: boolean;
    onClose: (open: boolean) => void;
}

const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({ open, onClose }) => {
    const navigate = useNavigate();
    const { role, logout } = useAuth();
    const wishlistItems = useAppSelector((state) => state.wishlist.items);
    const wishlistCount = wishlistItems?.length || 0;

    const [openProductSubMenu, setOpenProductSubMenu] = useState(false);

    const handleProductClick = () => {
        setOpenProductSubMenu(!openProductSubMenu);
    };

    const toggleMobileMenu = (openState: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        onClose(openState);
    };

    const handleClose = () => onClose(false);

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={toggleMobileMenu(false)}
            sx={{ zIndex: 1300 }}
        >
            <Box
                sx={{ width: 300, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}
                role="presentation"
                onKeyDown={toggleMobileMenu(false)}
            >
                {/* Header Đỏ */}
                <Box sx={{ bgcolor: '#b11116', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '18px' }}>DOLA STYLE</Typography>
                    <IconButton onClick={handleClose} sx={{ color: 'white' }}>
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
                                                handleProductClick();
                                            } else {
                                                navigate(item.path || '/');
                                                handleClose();
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
                                                            handleClose();
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

                        {/* ✅ LOGIC MỚI: Kiểm tra role để hiển thị */}
                        {role === 'client' ? (
                            <ListItem disablePadding sx={{ borderBottom: '1px solid #eee' }}>
                                <ListItemButton onClick={() => { logout(); handleClose(); }}>
                                    <ListItemIcon sx={{ minWidth: 35, color: '#b11116' }}>
                                        <LogoutIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Đăng xuất" primaryTypographyProps={{ fontSize: '14px' }} />
                                </ListItemButton>
                            </ListItem>
                        ) : (
                            <>
                                <ListItem disablePadding sx={{ borderBottom: '1px solid #eee' }}>
                                    <ListItemButton onClick={() => { navigate('/auth?tab=login'); handleClose(); }}>
                                        <ListItemIcon sx={{ minWidth: 35, color: '#b11116' }}><LoginIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText primary="Đăng nhập" primaryTypographyProps={{ fontSize: '14px' }} />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding sx={{ borderBottom: '1px solid #eee' }}>
                                    <ListItemButton onClick={() => { navigate('/auth?tab=register'); handleClose(); }}>
                                        <ListItemIcon sx={{ minWidth: 35, color: '#b11116' }}><AppRegistrationIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText primary="Đăng ký" primaryTypographyProps={{ fontSize: '14px' }} />
                                    </ListItemButton>
                                </ListItem>
                            </>
                        )}

                        <ListItem disablePadding sx={{ borderBottom: '1px solid #eee' }}>
                            <ListItemButton onClick={() => { navigate('/wishlist'); handleClose(); }}>
                                <ListItemIcon sx={{ minWidth: 35, color: '#b11116' }}><FavoriteBorderOutlinedIcon fontSize="small" /></ListItemIcon>
                                <ListItemText primary={`Danh sách yêu thích (${wishlistCount})`} primaryTypographyProps={{ fontSize: '14px' }} />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding sx={{ borderBottom: '1px solid #eee' }}>
                            <ListItemButton onClick={() => { navigate('/orders'); handleClose(); }}>
                                <ListItemIcon sx={{ minWidth: 35, color: '#b11116' }}><ListAltIcon fontSize="small" /></ListItemIcon>
                                <ListItemText primary="Kiểm tra đơn hàng" primaryTypographyProps={{ fontSize: '14px' }} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Box>
        </Drawer>
    );
};

export default MobileMenuDrawer;
