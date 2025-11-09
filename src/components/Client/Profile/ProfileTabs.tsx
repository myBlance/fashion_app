import React from 'react';
import {
    Box,
    Tabs,
    Tab,
    Avatar,
    Typography,
    useMediaQuery,
    useTheme,
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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const tabs = [
        { label: "Hồ Sơ", icon: <Person /> },
        { label: "Ngân Hàng", icon: <AccountBalance /> },
        { label: "Địa Chỉ", icon: <LocationOn /> },
        { label: "Đổi Mật Khẩu", icon: <Lock /> },
        { label: "Cài Đặt Thông Báo", icon: <Notifications /> },
        { label: "Thiết Lập Riêng Tư", icon: <PrivacyTip /> },
        { label: "Thông Tin Cá Nhân", icon: <Info /> },
        { label: "Đơn Mua", icon: <ShoppingBag /> },
        { label: "Kho Voucher", icon: <LocalOffer /> },
    ];

    return (
        <Box
            sx={{
                width: isMobile ? '100%' : 260,
                borderRight: isMobile ? 'none' : '1px solid #eee',
                pb: 2,
                backgroundColor: isMobile ? 'transparent' : '#fff',
                borderRadius: 2,
                boxShadow: isMobile ? 'none' : '0 2px 8px rgba(0,0,0,0.05)',
            }}
        >
            {/* Avatar + tên người dùng */}
            <Box sx={{ mb: 3, textAlign: 'center', pt: 3 }}>
                <Avatar
                    src={avatarUrl || "https://i.pravatar.cc/150?img=3"}
                    alt={username}
                    sx={{
                        width: 90,
                        height: 90,
                        mx: 'auto',
                        mb: 1,
                        border: '2px solid #ff5722',
                    }}
                />
                <Typography variant="subtitle1" fontWeight="bold">
                    {username}
                </Typography>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ cursor: 'pointer', '&:hover': { color: '#ff5722' } }}
                >
                    Sửa Hồ Sơ
                </Typography>
            </Box>

            {/* Tabs */}
            <Tabs
                orientation={isMobile ? "horizontal" : "vertical"}
                value={activeTab}
                onChange={(_, newValue) => onTabChange(newValue)}
                sx={{
                    '& .MuiTabs-indicator': { display: 'none' },
                    '& .MuiTab-root': {
                        justifyContent: isMobile ? 'center' : 'flex-start',
                        py: 1.2,
                        px: 2,
                        borderRadius: '10px',
                        mb: 0.8,
                        fontSize: '15px',
                        fontWeight: 500,
                        textTransform: 'none',
                        color: '#555',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.2,
                        transition: 'all 0.25s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 87, 34, 0.1)',
                            color: '#ff5722',
                        },
                        '&.Mui-selected': {
                            backgroundColor: '#ff5722',
                            color: '#fff',
                            fontWeight: 600,
                        },
                    },
                }}
            >
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        icon={tab.icon}
                        label={tab.label}
                        iconPosition="start"
                    />
                ))}
            </Tabs>
        </Box>
    );
};

export default ProfileTabs;
