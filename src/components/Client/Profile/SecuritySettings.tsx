import {
    Button,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import '../../../styles/ProfileContent.css';

interface SecuritySettingsProps {
    onChangePassword: (data: any) => void;
    message: string;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onChangePassword, message }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { showToast } = useToast();

    const handleSubmit = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast("Vui lòng nhập đầy đủ thông tin", "warning");
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast("Mật khẩu xác nhận không khớp", "error");
            return;
        }
        onChangePassword({ currentPassword, newPassword });
    };

    return (
        <div className="profile-content-container">
            <div className="profile-header">
                <Typography variant="h5">Đổi Mật Khẩu</Typography>
                <Typography variant="body2">
                    Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
                </Typography>
            </div>

            <div className="profile-divider" style={{ margin: '24px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}></div>

            <div className="profile-form">
                <div className="form-group">
                    <label className="form-label">Mật khẩu cũ</label>
                    <TextField
                        fullWidth
                        type="password"
                        variant="outlined"
                        size="small"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Mật khẩu mới</label>
                    <TextField
                        fullWidth
                        type="password"
                        variant="outlined"
                        size="small"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Xác nhận mật khẩu</label>
                    <TextField
                        fullWidth
                        type="password"
                        variant="outlined"
                        size="small"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <Button
                    variant="contained"
                    fullWidth
                    className="save-btn"
                    onClick={handleSubmit}
                    sx={{ bgcolor: '#ff5722', '&:hover': { bgcolor: '#e64a19' } }}
                >
                    Xác Nhận
                </Button>

                {message && (
                    <Typography
                        sx={{
                            mt: 2,
                            fontSize: '14px',
                            color: message.includes("thành công") ? "green" : "red",
                            textAlign: 'center',
                            fontWeight: 500
                        }}
                    >
                        {message}
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default SecuritySettings;