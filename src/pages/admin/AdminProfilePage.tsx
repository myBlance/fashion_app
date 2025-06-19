import {
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
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/users/profile`, {
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
    }, []);

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
                `${API_BASE_URL}/api/users/profile`,
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
        } catch (err: any) {
            console.error("Lỗi cập nhật:", err);
            setMessage("Cập nhật thất bại");
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordMessage("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            const res = await axios.put(
                `${API_BASE_URL}/api/users/change-password`,
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
        } catch (err: any) {
            console.error("Lỗi đổi mật khẩu:", err);
            setPasswordMessage("Đổi mật khẩu thất bại");
        }
    };

    if (loading) return <Typography align="center">Đang tải thông tin...</Typography>;

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", p: 3, backgroundColor:"#fff" }}>
            <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} sx={{ mb: 3 }}>
                <Tab label="Thông tin Admin" />
                <Tab label="Đổi mật khẩu" />
            </Tabs>

            {tab === 0 && (
                <>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Avatar
                            src={profile.avatarUrl || "https://i.pravatar.cc/150?img=5"}
                            alt={profile.name || profile.username}
                            sx={{ width: 80, height: 80, mr: 2, cursor: "pointer" }}
                            onClick={handleAvatarClick}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                        />
                        <Typography variant="h6">{profile.name || profile.username}</Typography>
                    </Box>

                    <TextField
                        label="Họ và tên"
                        name="name"
                        value={profile.name || ""}
                        onChange={handleProfileChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={profile.email || ""}
                        onChange={handleProfileChange}
                        fullWidth
                        margin="normal"
                    />

                    <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpdateProfile}>
                        Cập nhật thông tin
                    </Button>

                    {message && (
                        <Typography sx={{ mt: 2, color: message.includes("thành công") ? "green" : "red" }}>
                            {message}
                        </Typography>
                    )}
                </>
            )}

            {tab === 1 && (
                <>
                    <TextField
                        label="Mật khẩu cũ"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Mật khẩu mới"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Xác nhận mật khẩu mới"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" sx={{ mt: 2 }} onClick={handleChangePassword}>
                        Đổi mật khẩu
                    </Button>

                    {passwordMessage && (
                        <Typography sx={{ mt: 2, color: passwordMessage.includes("thành công") ? "green" : "red" }}>
                            {passwordMessage}
                        </Typography>
                    )}
                </>
            )}
        </Box>
    );
};

export default AdminProfilePage;
