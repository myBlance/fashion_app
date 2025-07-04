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

interface UserProfile {
    username: string;
    name?: string;
    email?: string;
    avatarUrl?: string;
}

const ProfilePage: React.FC = () => {
    const [tab, setTab] = useState(0);
    

    const [profile, setProfile] = useState<UserProfile>({
        username: "",
        name: "",
        email: "",
        avatarUrl: "",
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    // const [emailMessage, setEmailMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [currentPassword, setcurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // const [newEmail, setNewEmail] = useState("");
    const [, setNewEmail] = useState("");
    

    const token = localStorage.getItem("token");
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(res.data.data);
                setNewEmail(res.data.email || "");
            } catch (err) {
                console.error(err);
                setMessage("Lỗi khi tải thông tin cá nhân");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                console.error('Lỗi cập nhật:', err.response?.data); 
            } else {
                console.error('Lỗi không xác định:', err);
            }
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordMessage("Mật khẩu xác nhận không khớp");
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
                setcurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } catch (err: any) {
            if (axios.isAxiosError(err) && err.response) {
                setPasswordMessage(err.response.data.message || "Đổi mật khẩu thất bại");
            } else {
                setPasswordMessage("Lỗi không xác định");
            }
        }

    };

//   const handleChangeEmail = async () => {
//     try {
//       const res = await axios.post(
//         `${API_BASE_URL}/api/users/change-email`,
//         { email: newEmail },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setEmailMessage(res.data.message || "Email đã được cập nhật");
//     } catch (err) {
//       console.error(err);
//       setEmailMessage("Cập nhật email thất bại");
//     }
//   };

    if (loading) return <Typography>Đang tải...</Typography>;

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", padding: 4 }}>
        

        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
            <Tab label="Thông tin cá nhân" />
            <Tab label="Cài đặt bảo mật" />
        </Tabs>

        {tab === 0 && (
            <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                src={profile.avatarUrl || "https://i.pravatar.cc/150?img=3"}
                alt={profile.name || profile.username}
                sx={{ width: 80, height: 80, mr: 2, cursor: "pointer" }}
                onClick={handleAvatarClick}
                />
                <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
                />
                <Typography variant="h6">{profile.name || profile.username}</Typography>
            </Box>

            <TextField
                fullWidth
                label="Họ và tên"
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Email"
                name="email"
                value={profile.email || ""}
                onChange={handleChange}
                margin="normal"
            />

            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleUpdateProfile}>
                Cập nhật
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
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Đổi mật khẩu
                </Typography>
                <TextField
                    fullWidth
                    label="Mật khẩu cũ"
                    type="password"
                    value={currentPassword}
                    onChange={e => setcurrentPassword(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Mật khẩu mới"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Xác nhận mật khẩu mới"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
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

            {/* <Divider sx={{ my: 4 }} />
                <TextField
                fullWidth
                label="Mật khẩu cũ"
                type="password"
                value={currentPassword}
                onChange={e => setcurrentPassword(e.target.value)}
                margin="normal"
            />
            <Typography variant="h6">Đổi email</Typography>
            <TextField
                fullWidth
                label="Email mới"
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                margin="normal"
            />
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleChangeEmail}>
                Đổi email
            </Button>
            {emailMessage && (
                <Typography sx={{ mt: 2, color: emailMessage.includes("thành công") ? "green" : "red" }}>
                {emailMessage}
                </Typography>
            )} */}
            </>
        )}
        </Box>
    );
};

export default ProfilePage;
