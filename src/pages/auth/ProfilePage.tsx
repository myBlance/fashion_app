import {
    Box,
    Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import AddressSettings from "../../components/Client/Profile/Address/AddressSettings";
import BankSettings from "../../components/Client/Profile/BankSettings";
import ProfileContent from "../../components/Client/Profile/ProfileContent";
import ProfileTabs from "../../components/Client/Profile/ProfileTabs";
import SecuritySettings from "../../components/Client/Profile/SecuritySettings";
import UserSavedVouchers from "../../components/Client/Profile/UserSavedVouchers";

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
    const [activeTab, setActiveTab] = useState(0);
    const [profile, setProfile] = useState<UserProfile>({
        username: "",
        name: "",
        email: "",
        avatarUrl: "",
        phone: "*******01",
        gender: "male",
        birthDate: "**/**/2003",
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setMessage('Bạn chưa đăng nhập. Vui lòng đăng nhập để xem hồ sơ.');
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
                    setMessage('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');
                    localStorage.removeItem('token');
                } else {
                    setMessage('Lỗi khi tải thông tin cá nhân');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

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
            alert('Dung lượng file không được vượt quá 1MB');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            alert('Chỉ cho phép file JPG, PNG');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile(prev => ({ ...prev, avatarUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateProfile = async () => {
        if (!token) {
            setMessage('Bạn chưa đăng nhập. Vui lòng đăng nhập để cập nhật hồ sơ.');
            return;
        }

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
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessage(res.data.message || "Cập nhật thành công");
        } catch (err: any) {
            console.error('Lỗi khi cập nhật hồ sơ:', err);
            if (err.response?.status === 401) {
                setMessage('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');
                localStorage.removeItem('token');
            } else {
                setMessage("Cập nhật thất bại");
            }
        }
    };

    const handleChangePassword = async () => {
        if (!token) {
            setPasswordMessage('Bạn chưa đăng nhập. Vui lòng đăng nhập để đổi mật khẩu.');
            return;
        }

        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/change-password`,
                {
                    password: "", // cần lấy từ state
                    newPassword: "", // cần lấy từ state
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setPasswordMessage(res.data.message || "Đổi mật khẩu thành công");
        } catch (err: any) {
            console.error('Lỗi khi đổi mật khẩu:', err);
            if (err.response?.status === 401) {
                setPasswordMessage('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');
                localStorage.removeItem('token');
            } else {
                setPasswordMessage("Đổi mật khẩu thất bại");
            }
        }
    };

    if (loading) return <Typography>Đang tải...</Typography>;

    const renderTabContent = () => {
        switch (activeTab) {
            case 0: return (
                <ProfileContent
                    profile={profile}
                    onProfileChange={handleProfileChange}
                    onFileChange={handleFileChange}
                    onAvatarClick={handleAvatarClick}
                    onSave={handleUpdateProfile}
                    message={message}
                />
            );
            case 1: return <BankSettings />;
            case 2: return <AddressSettings />;
            case 3: return (
                <SecuritySettings
                    onChangePassword={handleChangePassword}
                    message={passwordMessage}
                />
            );
            case 8: return <UserSavedVouchers />;
            
            default: return (
                <ProfileContent
                    profile={profile}
                    onProfileChange={handleProfileChange}
                    onFileChange={handleFileChange}
                    onAvatarClick={handleAvatarClick}
                    onSave={handleUpdateProfile}
                    message={message}
                />
            );
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 3, padding: 3, maxWidth: 1200, margin: 'auto' }}>
            <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                username={profile.username}
                avatarUrl={profile.avatarUrl}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                {renderTabContent()}
            </Box>
        </Box>
    );
};

export default ProfilePage;