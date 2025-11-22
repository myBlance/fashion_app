import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Typography,
    Container,
    CircularProgress,
    Alert,
    Snackbar,
    Paper,
    useTheme,
    useMediaQuery
} from "@mui/material";
import axios from "axios";

// Import các component con (Giữ nguyên đường dẫn của bạn)
import AddressSettings from "../../components/Client/Profile/Address/AddressSettings";
import BankSettings from "../../components/Client/Profile/BankSettings";
import ProfileContent from "../../components/Client/Profile/ProfileContent";
import ProfileTabs from "../../components/Client/Profile/ProfileTabs"; // Component chúng ta vừa sửa
import SecuritySettings from "../../components/Client/Profile/SecuritySettings";
import UserSavedVouchers from "../../components/Client/Profile/UserSavedVouchers";
import OrderHistoryPage from "../client/OrderHistoryPage";

interface UserProfile {
    username: string;
    name?: string;
    email?: string;
    avatarUrl?: string;
    phone?: string;
    gender?: string;
    birthDate?: string;
}

const ProfilePage: React.FC = () => {
    // --- Hooks cho Responsive ---
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Dưới 900px là mobile/tablet dọc

    // --- State ---
    const [activeTab, setActiveTab] = useState(0);
    const [profile, setProfile] = useState<UserProfile>({
        username: "",
        name: "",
        email: "",
        avatarUrl: "",
        phone: "",
        gender: "male",
        birthDate: "",
    });

    const [loading, setLoading] = useState(true);
    
    // State cho thông báo (Snackbar)
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const token = localStorage.getItem("token");

    // --- Helper hiển thị thông báo ---
    const showToast = (msg: string, type: "success" | "error") => {
        setToastMessage(msg);
        setToastType(type);
        setToastOpen(true);
    };

    // --- Fetch Data ---
    useEffect(() => {
        if (!token) {
            showToast('Bạn chưa đăng nhập. Vui lòng đăng nhập.', 'error');
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(res.data.data || {});
            } catch (err: any) {
                console.error('Lỗi khi tải hồ sơ:', err);
                if (err.response?.status === 401) {
                    showToast('Phiên đăng nhập hết hạn.', 'error');
                    localStorage.removeItem('token');
                } else {
                    showToast('Lỗi tải thông tin.', 'error');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    // --- Handlers ---
    const handleProfileChange = (field: string, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1 * 1024 * 1024) {
            showToast('Dung lượng file quá lớn (>1MB)', 'error');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            showToast('Chỉ hỗ trợ JPG/PNG', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile(prev => ({ ...prev, avatarUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateProfile = async () => {
        if (!token) return showToast('Vui lòng đăng nhập', 'error');

        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/profile`,
                {
                    name: profile.name,
                    email: profile.email,
                    avatarUrl: profile.avatarUrl,
                    phone: profile.phone,
                    gender: profile.gender,
                    birthDate: profile.birthDate,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showToast(res.data.message || "Cập nhật thành công", 'success');
        } catch (err: any) {
            showToast("Cập nhật thất bại", 'error');
        }
    };

    const handleChangePassword = async () => {
        try {
             // ... logic axios change password
             showToast("Đổi mật khẩu thành công", 'success');
        } catch (err: any) {
             showToast("Đổi mật khẩu thất bại", 'error');
        }
    };

    // --- Render Content Wrapper ---
    // Bọc nội dung bên phải trong Paper để đồng bộ style với Sidebar
    const renderTabContent = () => {
        let content;
        switch (activeTab) {
            case 0:
                content = (
                    <ProfileContent
                        profile={profile}
                        onProfileChange={handleProfileChange}
                        onFileChange={handleFileChange}
                        onAvatarClick={handleAvatarClick}
                        onSave={handleUpdateProfile}
                        message="" // Đã dùng Toast nên có thể bỏ message ở đây
                    />
                );
                break;
            case 1: content = <BankSettings />; break;
            case 2: content = <AddressSettings />; break;
            case 3:
                content = (
                    <SecuritySettings
                        onChangePassword={handleChangePassword}
                        message="" 
                    />
                );
                break;
            case 4: content = <Typography>Thiết lập Thông Báo (Đang phát triển)</Typography>; break;
            case 5: content = <Typography>Thiết lập Riêng Tư (Đang phát triển)</Typography>; break;
            case 6: content = <Typography>Thông tin Cá Nhân (Đang phát triển)</Typography>; break;
            case 7: content = <OrderHistoryPage/>; break; 
            case 8: content = <UserSavedVouchers />; break;
            default: content = <Typography>Đang phát triển...</Typography>;
        }

        return (
            <Paper 
                elevation={isMobile ? 0 : 1} 
                sx={{ 
                    p: isMobile ? 0 : 3, 
                    borderRadius: 2,
                    minHeight: 400,
                    backgroundColor: isMobile ? 'transparent' : '#fff',
                    boxShadow: isMobile ? 'none' : '0 2px 8px rgba(0,0,0,0.05)'
                }}
            >
                {content}
            </Paper>
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress sx={{ color: '#ff5722' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Layout chính */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row', // Chuyển hướng cột/hàng
                    gap: 3,
                    alignItems: 'flex-start' // Quan trọng để sidebar không bị kéo giãn chiều cao
                }}
            >
                {/* Sidebar (Trái/Trên) */}
                <Box sx={{ width: isMobile ? '100%' : 'auto', flexShrink: 0 }}>
                    <ProfileTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        username={profile.username}
                        avatarUrl={profile.avatarUrl}
                    />
                </Box>

                {/* Content (Phải/Dưới) */}
                <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
                    {renderTabContent()}
                </Box>
            </Box>

            {/* Thông báo Toast */}
            <Snackbar 
                open={toastOpen} 
                autoHideDuration={4000} 
                onClose={() => setToastOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setToastOpen(false)} severity={toastType} sx={{ width: '100%' }} variant="filled">
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProfilePage;