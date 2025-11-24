import { LockOutlined, PersonOutline, PhotoCamera } from "@mui/icons-material";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    Paper,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { CustomAppBar } from "../../components/Admin/CustomAppBar";

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
            <Card sx={{ borderRadius: '20px', mr: '-24px', p: 4 }}>
                <Typography align="center">Đang tải thông tin...</Typography>
            </Card>
        );
    }

    return (
        <Card sx={{ borderRadius: '20px', mr: '-24px', height: '100%' }}>
            <Box sx={{ padding: 2 }}>
                <CustomAppBar />

                <Typography variant="h4" fontWeight="bold" mb={3} mt={2}>
                    Cài đặt Admin
                </Typography>

                <Tabs
                    value={tab}
                    onChange={(_, newTab) => setTab(newTab)}
                    sx={{
                        mb: 3,
                        borderBottom: 1,
                        borderColor: 'divider'
                    }}
                >
                    <Tab
                        icon={<PersonOutline />}
                        iconPosition="start"
                        label="Thông tin cá nhân"
                    />
                    <Tab
                        icon={<LockOutlined />}
                        iconPosition="start"
                        label="Đổi mật khẩu"
                    />
                </Tabs>

                {tab === 0 && (
                    <Paper elevation={2} sx={{ p: 4, maxWidth: 600 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={profile.avatarUrl || "https://i.pravatar.cc/150?img=5"}
                                    alt={profile.name || profile.username}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        cursor: "pointer",
                                        border: '4px solid',
                                        borderColor: 'primary.main',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                    onClick={handleAvatarClick}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: 'primary.main',
                                        borderRadius: '50%',
                                        p: 1,
                                        cursor: 'pointer'
                                    }}
                                    onClick={handleAvatarClick}
                                >
                                    <PhotoCamera sx={{ color: 'white', fontSize: 20 }} />
                                </Box>
                            </Box>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                            />
                            <Typography variant="h6" mt={2}>{profile.name || profile.username}</Typography>
                            <Typography variant="body2" color="text.secondary">@{profile.username}</Typography>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <TextField
                            label="Họ và tên"
                            name="name"
                            value={profile.name || ""}
                            onChange={handleProfileChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
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
                        />

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{ mt: 3 }}
                            onClick={handleUpdateProfile}
                        >
                            Cập nhật thông tin
                        </Button>

                        {message && (
                            <Alert
                                severity={message.includes("thành công") ? "success" : "error"}
                                sx={{ mt: 2 }}
                            >
                                {message}
                            </Alert>
                        )}
                    </Paper>
                )}

                {tab === 1 && (
                    <Paper elevation={2} sx={{ p: 4, maxWidth: 600 }}>
                        <Typography variant="h6" mb={3}>Đổi mật khẩu</Typography>

                        <TextField
                            label="Mật khẩu cũ"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                            variant="outlined"
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
                        />
                        <TextField
                            label="Xác nhận mật khẩu mới"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{ mt: 3 }}
                            onClick={handleChangePassword}
                            disabled={!currentPassword || !newPassword || !confirmPassword}
                        >
                            Đổi mật khẩu
                        </Button>

                        {passwordMessage && (
                            <Alert
                                severity={passwordMessage.includes("thành công") ? "success" : "error"}
                                sx={{ mt: 2 }}
                            >
                                {passwordMessage}
                            </Alert>
                        )}
                    </Paper>
                )}
            </Box>
        </Card>
    );
};

export default AdminProfilePage;
