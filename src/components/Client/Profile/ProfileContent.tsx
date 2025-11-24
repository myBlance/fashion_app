import EditIcon from '@mui/icons-material/Edit';
import {
    Avatar,
    Box,
    Button,
    Divider,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material';
import React, { useRef } from 'react';

interface ProfileContentProps {
    profile: {
        username: string;
        name?: string;
        email?: string;
        avatarUrl?: string;
        phone?: string;
        gender?: string;
        birthDate?: string;
    };
    onProfileChange: (field: string, value: string) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAvatarClick: () => void;
    onSave: () => void;
    message: string;
    onEditEmail?: () => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
    profile,
    onProfileChange,
    onFileChange,
    onAvatarClick,
    onSave,
    message,
    onEditEmail,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Hồ Sơ Của Tôi
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Quản lý thông tin hồ sơ để bảo mật tài khoản
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Layout 2 cột: Thông tin bên trái, avatar bên phải */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                }}
            >
                {/* Cột trái: Thông tin hồ sơ */}
                <Box sx={{ flex: 2 }}>
                    {/* Tên đăng nhập */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            Tên đăng nhập
                        </Typography>
                        <TextField
                            fullWidth
                            name="username"
                            value={profile.username}
                            onChange={(e) => onProfileChange('username', e.target.value)}
                            sx={{ mt: 0.5 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            Tên Đăng nhập có thể thay đổi.
                        </Typography>
                    </Box>

                    {/* Họ tên */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            Tên
                        </Typography>
                        <TextField
                            fullWidth
                            name="name"
                            value={profile.name || ""}
                            onChange={(e) => onProfileChange('name', e.target.value)}
                            sx={{ mt: 0.5 }}
                        />
                    </Box>

                    {/* Email */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            Email
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {profile.email ? (
                                <TextField
                                    fullWidth
                                    name="email"
                                    value={profile.email}
                                    onChange={(e) => onProfileChange('email', e.target.value)}
                                    sx={{ mt: 0.5 }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={onEditEmail}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            ) : (
                                <TextField
                                    fullWidth
                                    name="email"
                                    value=""
                                    onChange={(e) => onProfileChange('email', e.target.value)}
                                    placeholder="Chưa có email"
                                    sx={{ mt: 0.5 }}
                                />
                            )}
                            {!profile.email && (
                                <Button
                                    variant="text"
                                    color="primary"
                                    sx={{ ml: 1, textTransform: 'none', fontSize: '14px' }}
                                    onClick={onEditEmail}
                                >
                                    Thêm
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {/* Số điện thoại */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            Số điện thoại
                        </Typography>
                        <TextField
                            fullWidth
                            name="phone"
                            type="tel"
                            value={profile.phone || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Chỉ cho phép số và dấu +
                                if (value === '' || /^\+?[0-9]*$/.test(value)) {
                                    onProfileChange('phone', value);
                                }
                            }}
                            placeholder="+84 123 456 789"
                            helperText="Ví dụ: +84 987654321"
                            sx={{ mt: 0.5 }}
                        />
                    </Box>

                    {/* Giới tính */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            Giới tính
                        </Typography>
                        <RadioGroup
                            row
                            name="gender"
                            value={profile.gender || "male"}
                            onChange={(e) => onProfileChange('gender', e.target.value)}
                            sx={{ mt: 0.5 }}
                        >
                            <FormControlLabel value="male" control={<Radio />} label="Nam" />
                            <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                            <FormControlLabel value="other" control={<Radio />} label="Khác" />
                        </RadioGroup>
                    </Box>

                    {/* Ngày sinh */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            Ngày sinh
                        </Typography>
                        <TextField
                            fullWidth
                            name="birthDate"
                            type="date"
                            value={profile.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : ""}
                            onChange={(e) => onProfileChange('birthDate', e.target.value)}
                            sx={{ mt: 0.5 }}
                            InputLabelProps={{ shrink: true }}
                            helperText={profile.birthDate ? `Ngày sinh: ${new Date(profile.birthDate).toLocaleDateString('vi-VN')}` : "Chọn ngày sinh của bạn"}
                        />
                    </Box>

                    {/* Nút Lưu */}
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        sx={{ py: 1.5, fontSize: '16px', fontWeight: 'bold' }}
                        onClick={onSave}
                    >
                        Lưu
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
                </Box>

                {/* Cột phải: Ảnh đại diện */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}
                >
                    <Avatar
                        src={profile.avatarUrl || "https://i.pravatar.cc/150?img=3"}
                        alt="Avatar"
                        sx={{
                            width: 120,
                            height: 120,
                            cursor: 'pointer',
                            mb: 2,
                            border: '2px solid #ccc'
                        }}
                        onClick={onAvatarClick}
                    />
                    <input
                        type="file"
                        accept="image/jpeg,image/png"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={onFileChange}
                    />
                    <Button variant="outlined" size="small" onClick={onAvatarClick}>
                        Chọn Ảnh
                    </Button>
                    <Typography variant="caption" display="block" mt={1} textAlign="center">
                        Dung lượng tối đa 1 MB<br />
                        Định dạng: .JPEG, .PNG
                    </Typography>
                </Box>
            </Box>
        </>
    );
};

export default ProfileContent;