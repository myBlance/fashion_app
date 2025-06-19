import React, { useEffect, useState } from 'react';
import { Menu, MenuProps, useLogout } from 'react-admin';

import { MoreVert, ShoppingCart, Store } from '@mui/icons-material';
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

// Define your API base URL here or import it from your config
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface UserProfile {
    name: string;
    avatarUrl?: string;
}

const UserMenu = () => {
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
        logout(undefined, false);
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
            <Box
                sx={{
                    borderTop: '1px solid #fff',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    mb: 2,
                }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar alt={profile?.name || 'User'} src={profile?.avatarUrl || '/user-avatar.png'} />
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                        {loading ? 'Đang tải...' : profile?.name || 'ADMIN'}
                    </Typography>
                </Box>

                <IconButton onClick={handleMenuClick}>
                    <MoreVert sx={{ color: '#fff' }} />
                </IconButton>
            </Box>

            <MuiMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleInforUser}>Thông tin Admin</MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </MuiMenu>
        </>
    );
};

const MyMenu: React.FC<MenuProps> = (props) => (
    <Box 
        display="flex" 
        flexDirection="column" 
        height="100%" 
        sx={{ backgroundColor: '#000'}}
    >
        {/* Logo trên cùng */}
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                borderBottom: '1px solid rgba(0,0,0,0.12)',
                
            }}
        >
            <h1 style={{ color: '#ff7a7a', margin: 0, fontSize: '32px', fontFamily:'fantasy' }}>
                DolaStyle
            </h1>
        </Box>

        {/* Menu chính */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto' , position: "sticky"}}>
            <Menu {...props}>
                <Menu.DashboardItem 
                    sx={{ color: "#fff",
                    "& .MuiListItemIcon-root": { color: "#fff"  },
                    "&:hover": { backgroundColor: "#3873d1"},borderRadius:3,
                    "&.RaMenuItemLink-active": {
                        backgroundColor: "#3873d1",  
                        color: "#fff",               
                    }
                    }} 
                />
                <Menu.Item 
                    to="/admin/orders" 
                    primaryText="Order" 
                    leftIcon={<ShoppingCart />} 
                    sx={{ color: "#fff",
                    "& .MuiListItemIcon-root": { color: "#fff"  },
                    "&:hover": { backgroundColor: "#3873d1"},borderRadius:3,
                    "&.RaMenuItemLink-active": {
                        backgroundColor: "#3873d1",  
                        color: "#fff",               
                    }
                    }} 
                />
                <Menu.Item 
                    to="/admin/products"
                    primaryText="Product" 
                    leftIcon={<Store />} 
                    sx={{ color: "#fff",
                    "& .MuiListItemIcon-root": { color: "#fff"  },
                    "&:hover": { backgroundColor: "#3873d1"},borderRadius:3,
                    "&.RaMenuItemLink-active": {
                        backgroundColor: "#3873d1",  
                        color: "#fff",               
                    }
                    }} 
                />
                {/* Thêm mục menu khác tại đây */}
            </Menu>
        </Box>

        {/* Thông tin người dùng + More menu */}
        <UserMenu />
    </Box>
);

export default MyMenu;
