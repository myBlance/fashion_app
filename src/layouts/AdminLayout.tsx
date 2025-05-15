import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  CssBaseline,
  Tooltip,
  Typography
} from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const drawerWidth = 240;

const AdminLayout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const user = {
    name: 'Nguyễn Văn A',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/300',
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerOpen ? drawerWidth : 60,
          flexShrink: 0,
          transition: 'width 0.3s',
          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidth : 60,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
        }}
      >
        <Box>
          <Toolbar />
          <List>
            <Tooltip title="Dashboard" placement="right" disableHoverListener={drawerOpen}>
              <ListItemButton component={Link} to="/admin/dashboard">
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                {drawerOpen && <ListItemText primary="Dashboard" />}
              </ListItemButton>
            </Tooltip>

            <Tooltip title="Orders" placement="right" disableHoverListener={drawerOpen}>
              <ListItemButton component={Link} to="/admin/orders">
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                {drawerOpen && <ListItemText primary="Orders" />}
              </ListItemButton>
            </Tooltip>
          </List>
        </Box>

        <Box
          sx={{
            p: 1.5,
            borderTop: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            gap: 1,
            minHeight: 64,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          onClick={handleAvatarClick}
        >
          <Avatar src={user.avatar} alt={user.name} sx={{ width: 36, height: 36 }} />
          {drawerOpen && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                {user.email}
              </Typography>
            </Box>
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <MenuItem onClick={() => alert('Chuyển user')}>Chuyển người dùng</MenuItem>
          <Divider />
          <MenuItem onClick={() => alert('Đăng xuất')}>Đăng xuất</MenuItem>
        </Menu>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default AdminLayout;
