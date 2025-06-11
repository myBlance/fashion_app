import React, { useState } from 'react';
import { Menu, MenuProps, useGetIdentity, useLogout } from 'react-admin';

import { ShoppingCart, MoreVert, Store } from '@mui/icons-material';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu as MuiMenu,
  MenuItem,
} from '@mui/material';

const UserMenu = () => {
    const { identity, isLoading } = useGetIdentity();
    const logout = useLogout();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
    handleClose();
    logout(undefined, false);
    window.location.href = '/';
};



    const handleSwitchUser = () => {
        handleClose();
        alert('Tính năng đổi người dùng đang được phát triển.');
    };

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
                }}
            >
                <Box display="flex" alignItems="center" gap={2} 
                   
                >
                    <Avatar alt={identity?.fullName || 'User'} src="/user-avatar.png" />
                    <Typography variant="body1" sx={{color:'#fff'}}>
                        {isLoading ? 'Đang tải...' : identity?.fullName || 'Người dùng'}
                    </Typography>
                </Box>

                <IconButton onClick={handleMenuClick}>
                    <MoreVert sx={{color:'#fff'}}/>
                </IconButton>
            </Box>

            <MuiMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleSwitchUser}>Đổi người dùng</MenuItem>
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
            <img
                src="/assets/images/logo.webp"
                alt="Logo"
                style={{ maxHeight: 35 }}
            />
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
