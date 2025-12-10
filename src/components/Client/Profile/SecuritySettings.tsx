import {
    Button,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useToast } from '../../../contexts/ToastContext';

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
        <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Đổi Mật Khẩu
            </Typography>
            <TextField
                fullWidth
                label="Mật khẩu cũ"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Mật khẩu mới"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Xác nhận mật khẩu mới"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
            />
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleSubmit}
            >
                Đổi mật khẩu
            </Button>
            {message && (
                <Typography
                    sx={{
                        mt: 2,
                        color: message.includes("thành công") ? "green" : "red",
                        textAlign: 'center'
                    }}
                >
                    {message}
                </Typography>
            )}
        </>
    );
};

export default SecuritySettings;