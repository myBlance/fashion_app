import React, { useEffect, useState } from 'react';
import { Menu, MenuProps, useLogout, useTranslate } from 'react-admin';

import { Loyalty, MoreVert, Person, Reviews, ShoppingCart, Store } from '@mui/icons-material';
import {
    Avatar,
    Box,
    IconButton,
    MenuItem,
    Menu as MuiMenu,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/MyMenu.css';

interface UserProfile {
    name: string;
    avatarUrl?: string;
}

const UserMenu = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const logout = useLogout();
    const navigate = useNavigate();

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleClose();
        sessionStorage.removeItem('role');
        logout();
        window.location.href = '/';
    };

    const handleInforUser = () => {
        handleClose();
        navigate('/admin/profile');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        axios.get(`${API_BASE_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                const data = res.data.data;
                setProfile({
                    name: data.name || 'ADMIN',
                    avatarUrl: data.avatarUrl || '/user-avatar.png',
                });
            })
            .catch((err) => {
                console.error('Lỗi khi lấy thông tin người dùng:', err);
                setProfile({ name: 'ADMIN', avatarUrl: '/user-avatar.png' });
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Box className="user-menu-box">
                <Box display="flex" alignItems="center" gap={2} onClick={handleInforUser} sx={{ cursor: 'pointer' }}>
                    <Avatar alt={profile?.name || 'User'} src={profile?.avatarUrl || '/user-avatar.png'} />
                    <Typography variant="body1" className="user-menu-name">
                        {loading ? 'Đang tải...' : profile?.name || 'ADMIN'}
                    </Typography>
                </Box>

                <IconButton onClick={handleMenuClick}>
                    <MoreVert className="user-menu-icon" />
                </IconButton>
            </Box>

            <MuiMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleInforUser}>Thông tin Admin</MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </MuiMenu>
        </>
    );
};

const MyMenu: React.FC<MenuProps> = (props) => {
    const translate = useTranslate();
    return (
        <Box className="my-menu-container">
            {/* Logo trên cùng */}
            <Box className="my-menu-logo-box">
                <h1 className="my-menu-logo">
                    DolaStyle
                </h1>
            </Box>

            {/* Menu chính */}
            <Box className="my-menu-items-box">
                <Menu {...props}>
                    <Menu.DashboardItem
                        className="my-menu-item"
                        primaryText={translate('resources.dashboard.name', { _: 'Bảng điều khiển' })}
                    />
                    <Menu.Item
                        to="/admin/orders"
                        primaryText={translate('resources.orders.name', { smart_count: 2, _: 'Đơn hàng' })}
                        leftIcon={<ShoppingCart />}
                        className="my-menu-item"
                    />
                    <Menu.Item
                        to="/admin/products"
                        primaryText={translate('resources.products.name', { smart_count: 2, _: 'Sản phẩm' })}
                        leftIcon={<Store />}
                        className="my-menu-item"
                    />
                    <Menu.Item
                        to="/admin/vouchers"
                        primaryText={translate('resources.vouchers.name', { smart_count: 2, _: 'Mã giảm giá' })}
                        leftIcon={<Loyalty />}
                        className="my-menu-item"
                    />
                    <Menu.Item
                        to="/admin/reviews"
                        primaryText={translate('resources.reviews.name', { smart_count: 2, _: 'Đánh giá' })}
                        leftIcon={<Reviews />}
                        className="my-menu-item"
                    />
                    <Menu.Item
                        to="/admin/users"
                        primaryText={translate('resources.users.name', { smart_count: 2, _: 'Người dùng' })}
                        leftIcon={<Person />}
                        className="my-menu-item"
                    />
                    {/* Thêm mục menu khác tại đây */}
                </Menu>
            </Box>

            {/* Thông tin người dùng + More menu */}
            <UserMenu />
        </Box>
    );
};

export default MyMenu;
