import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Avatar } from "@mui/material";

interface UserProfile {
  username: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    name: "",
    email: "",
    avatarUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Lỗi khi tải thông tin cá nhân");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Mở dialog chọn file khi nhấn vào avatar
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Đọc file ảnh thành base64 và set avatarUrl để preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(prev => ({
        ...prev,
        avatarUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatarUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message || "Cập nhật thành công");
    } catch (err) {
      console.error(err);
      setMessage("Cập nhật thất bại");
    }
  };

  if (loading) return <Typography>Đang tải...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Thông tin cá nhân
      </Typography>

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

      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleUpdate}>
        Cập nhật
      </Button>

      {message && (
        <Typography sx={{ mt: 2, color: message.includes("thành công") ? "green" : "red" }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default ProfilePage;
