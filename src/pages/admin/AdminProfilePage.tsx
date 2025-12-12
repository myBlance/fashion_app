import { LockOutlined, LogoutOutlined, PersonOutline, PhotoCamera } from "@mui/icons-material";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLogout } from 'react-admin';
import '../../styles/AdminProfilePage.css';

interface AdminProfile {
    username: string;
    name?: string;
    email?: string;
    avatarUrl?: string;
}

const AdminProfilePage: React.FC = () => {
    const [tab, setTab] = useState(0);
    const [profile, setProfile] = useState<AdminProfile>({
        username: "",
        name: "",
        email: "",
        avatarUrl: "",
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const logout = useLogout();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(res.data.data);
            } catch (err) {
                console.error("Lỗi khi tải thông tin admin:", err);
                setMessage("Lỗi khi tải thông tin");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile(prev => ({ ...prev, avatarUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateProfile = async () => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/profile`,
                {
                    name: profile.name,
                    email: profile.email,
                    avatarUrl: profile.avatarUrl,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessage(res.data.message || "Cập nhật thành công");
            setTimeout(() => setMessage(""), 3000);
        } catch (err: any) {
            console.error("Lỗi cập nhật:", err);
            setMessage("Cập nhật thất bại");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordMessage("Mật khẩu xác nhận không khớp");
            setTimeout(() => setPasswordMessage(""), 3000);
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage("Mật khẩu mới phải có ít nhất 6 ký tự");
            setTimeout(() => setPasswordMessage(""), 3000);
            return;
        }

        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/change-password`,
                {
                    password: currentPassword,
                    newPassword,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setPasswordMessage(res.data.message || "Đổi mật khẩu thành công");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => setPasswordMessage(""), 3000);
        } catch (err: any) {
            console.error("Lỗi đổi mật khẩu:", err);
            setPasswordMessage(err.response?.data?.message || "Đổi mật khẩu thất bại");
            setTimeout(() => setPasswordMessage(""), 3000);
        }
    };

    if (loading) {
        return (
            <Box className="admin-profile-card" sx={{ justifyContent: 'center', alignItems: 'center', minHeight: '400px!important' }}>
                <Typography>Đang tải thông tin...</Typography>
            </Box>
        );
    }

    return (
        <Box className="admin-profile-card">
            {/* LEFT SIDEBAR */}
            <Box className="admin-profile-sidebar">
                <Box className="admin-avatar-box">
                    <Avatar
                        src={profile.avatarUrl || "https://i.pravatar.cc/150?img=5"}
                        alt={profile.name || profile.username}
                        className="admin-avatar"
                        onClick={handleAvatarClick}
                    />
                    <Box className="admin-camera-icon-box" onClick={handleAvatarClick}>
                        <PhotoCamera fontSize="small" />
                    </Box>
                </Box>
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                />

                <Typography className="profile-name">
                    {profile.name || profile.username}
                </Typography>
                <Typography className="profile-email">
                    {profile.email || "Chưa cập nhật email"}
                </Typography>
                <Typography variant="caption" sx={{ mt: 1, opacity: 0.6 }}>
                    @{profile.username}
                </Typography>
            </Box>

            {/* RIGHT CONTENT */}
            <Box className="admin-profile-content">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" className="profile-heading" sx={{ mb: 0 }}>
                        Cài đặt tài khoản
                    </Typography>
                </Box>

                <Tabs
                    value={tab}
                    onChange={(_, newTab) => setTab(newTab)}
                    className="admin-tabs"
                >
                    <Tab icon={<PersonOutline />} iconPosition="start" label="Thông tin cá nhân" />
                    <Tab icon={<LockOutlined />} iconPosition="start" label="Bảo mật" />
                </Tabs>

                {tab === 0 && (
                    <Box className="profile-form">
                        <TextField
                            label="Họ và tên"
                            name="name"
                            value={profile.name || ""}
                            onChange={handleProfileChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            className="modern-input"
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={profile.email || ""}
                            onChange={handleProfileChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            className="modern-input"
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            className="action-btn"
                            sx={{ mt: 4, bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}
                            onClick={handleUpdateProfile}
                        >
                            Lưu thay đổi
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<LogoutOutlined />}
                            onClick={() => logout()}
                            sx={{ borderRadius: '10px', mt: 16, ml: 40 }}
                        >
                            Đăng xuất
                        </Button>

                        {message && (
                            <Alert severity={message.includes("thất bại") ? "error" : "success"} sx={{ mt: 2, borderRadius: 2 }}>
                                {message}
                            </Alert>
                        )}
                    </Box>
                )}

                {tab === 1 && (
                    <Box className="profile-form">
                        <TextField
                            label="Mật khẩu hiện tại"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            className="modern-input"
                        />
                        <TextField
                            label="Mật khẩu mới"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            helperText="Tối thiểu 6 ký tự"
                            className="modern-input"
                        />
                        <TextField
                            label="Xác nhận mật khẩu"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            className="modern-input"
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            className="action-btn"
                            sx={{ mt: 4, bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}
                            onClick={handleChangePassword}
                            disabled={!currentPassword || !newPassword || !confirmPassword}
                        >
                            Đổi mật khẩu
                        </Button>

                        {passwordMessage && (
                            <Alert severity={passwordMessage.includes("thất bại") ? "error" : "success"} sx={{ mt: 2, borderRadius: 2 }}>
                                {passwordMessage}
                            </Alert>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default AdminProfilePage;
