import React from 'react';
import {
    Box,
    Tabs,
    Tab,
    Avatar,
    Typography,
    useMediaQuery,
    useTheme,
    Paper,
    Divider,
    IconButton,
} from '@mui/material';
import {
    Person,
    AccountBalance,
    LocationOn,
    Lock,
    Notifications,
    PrivacyTip,
    Info,
    ShoppingBag,
    LocalOffer,
    Edit,
} from '@mui/icons-material';

interface ProfileTabsProps {
    activeTab: number;
    onTabChange: (value: number) => void;
    username: string;
    avatarUrl?: string;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
    activeTab,
    onTabChange,
    username,
    avatarUrl,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Đổi thành 'md' để tablet cũng dùng giao diện ngang nếu cần

    const tabs = [
        { label: "Hồ Sơ", icon: <Person /> },
        { label: "Ngân Hàng", icon: <AccountBalance /> },
        { label: "Địa Chỉ", icon: <LocationOn /> },
        { label: "Đổi Mật Khẩu", icon: <Lock /> },
        { label: "Thông Báo", icon: <Notifications /> }, // Rút gọn label cho đẹp
        { label: "Riêng Tư", icon: <PrivacyTip /> },
        { label: "Cá Nhân", icon: <Info /> },
        { label: "Đơn Mua", icon: <ShoppingBag /> },
        { label: "Voucher", icon: <LocalOffer /> },
    ];

    return (
        <Paper
            elevation={isMobile ? 1 : 3}
            sx={{
                width: isMobile ? '100%' : 280,
                height: isMobile ? 'auto' : 'fit-content',
                minHeight: isMobile ? 'auto' : '80vh', // Desktop cao tối thiểu
                borderRadius: isMobile ? 0 : 3,
                overflow: 'hidden',
                backgroundColor: '#fff',
                position: isMobile ? 'relative' : 'sticky',
                top: isMobile ? 0 : 20, // Sticky sidebar trên desktop
                zIndex: 10,
            }}
        >
            {/* --- Phần Avatar & Info --- */}
            <Box
                sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: isMobile ? 'row' : 'column', // Mobile: Ngang, Desktop: Dọc
                    alignItems: 'center',
                    justifyContent: isMobile ? 'flex-start' : 'center',
                    gap: 2,
                    background: isMobile 
                        ? 'linear-gradient(to right, #fff, #f5f5f5)' 
                        : 'transparent'
                }}
            >
                <Box position="relative">
                    <Avatar
                        src={avatarUrl || "https://i.pravatar.cc/150?img=3"}
                        alt={username}
                        sx={{
                            width: isMobile ? 50 : 100,
                            height: isMobile ? 50 : 100,
                            border: '3px solid #ff5722',
                            boxShadow: '0 4px 12px rgba(255, 87, 34, 0.2)',
                        }}
                    />
                    {/* Nút sửa ảnh nhỏ (Optional) */}
                    {!isMobile && (
                        <IconButton
                            size="small"
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: '#fff',
                                border: '1px solid #ddd',
                                '&:hover': { backgroundColor: '#f0f0f0' }
                            }}
                        >
                            <Edit fontSize="small" sx={{ width: 14, height: 14 }} />
                        </IconButton>
                    )}
                </Box>

                <Box sx={{ textAlign: isMobile ? 'left' : 'center' }}>
                    <Typography 
                        variant={isMobile ? "subtitle1" : "h6"} 
                        fontWeight="bold"
                        noWrap
                    >
                        {username}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isMobile ? 'flex-start' : 'center',
                            gap: 0.5,
                            cursor: 'pointer',
                            '&:hover': { color: '#ff5722' }
                        }}
                    >
                        <Edit sx={{ fontSize: 12 }} /> Sửa hồ sơ
                    </Typography>
                </Box>
            </Box>

            {!isMobile && <Divider variant="middle" sx={{ mb: 2 }} />}

            {/* --- Phần Tabs --- */}
            <Tabs
                orientation={isMobile ? "horizontal" : "vertical"}
                variant={isMobile ? "scrollable" : "standard"} // Mobile cho phép trượt ngang
                scrollButtons={isMobile ? "auto" : false}
                allowScrollButtonsMobile
                value={activeTab}
                onChange={(_, newValue) => onTabChange(newValue)}
                sx={{
                    // Tùy chỉnh thanh scroll trên mobile cho đẹp/ẩn đi
                    '& .MuiTabs-scroller': {
                         '::-webkit-scrollbar': { display: 'none' } 
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#ff5722',
                        left: 0,
                        width: isMobile ? '100%' : '4px', // Mobile: gạch dưới, Desktop: gạch trái
                        height: isMobile ? '3px' : '100%',
                        borderRadius: isMobile ? '3px 3px 0 0' : '0 4px 4px 0',
                    },
                }}
            >
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        icon={tab.icon}
                        label={tab.label}
                        iconPosition="start"
                        sx={{
                            minHeight: 48,
                            justifyContent: isMobile ? 'center' : 'flex-start',
                            px: 3,
                            py: 1.5,
                            fontSize: '14px',
                            fontWeight: 500,
                            textTransform: 'none',
                            color: '#666',
                            letterSpacing: '0.3px',
                            transition: 'all 0.3s ease',
                            whiteSpace: 'nowrap', // Ngăn xuống dòng trên mobile
                            
                            // Icon style
                            '& .MuiSvgIcon-root': {
                                marginBottom: '0 !important',
                                marginRight: '12px !important',
                                fontSize: '20px',
                                color: index === activeTab ? '#ff5722' : '#999',
                            },

                            // Hover effect desktop
                            '&:hover': {
                                backgroundColor: isMobile ? 'transparent' : 'rgba(255, 87, 34, 0.04)',
                                color: '#ff5722',
                                '& .MuiSvgIcon-root': { color: '#ff5722' },
                            },

                            // Selected state
                            '&.Mui-selected': {
                                color: '#ff5722',
                                fontWeight: 700,
                                backgroundColor: isMobile ? 'transparent' : 'rgba(255, 87, 34, 0.08)',
                            },
                        }}
                    />
                ))}
            </Tabs>
        </Paper>
    );
};

export default ProfileTabs;