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
import '../../../styles/ProfileContent.css';

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
    onSave: () => void;
    message: string;
    onEditEmail?: () => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
    profile,
    onProfileChange,
    onFileChange,
    onSave,
    message,
    onEditEmail,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="profile-content-container">
            <div className="profile-header">
                <Typography variant="h5">Hồ Sơ Của Tôi</Typography>
                <Typography variant="body2">
                    Quản lý thông tin hồ sơ để bảo mật tài khoản
                </Typography>
            </div>

            <Divider className="profile-divider" />

            <div className="profile-layout">
                {/* Cột trái: Thông tin hồ sơ */}
                <div className="profile-form">
                    {/* Tên đăng nhập */}
                    <div className="form-group">
                        <label className="form-label">Tên đăng nhập</label>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            name="username"
                            value={profile.username}
                            onChange={(e) => onProfileChange('username', e.target.value)}
                        />
                        <div className="form-helper">Tên Đăng nhập có thể thay đổi.</div>
                    </div>

                    {/* Họ tên */}
                    <div className="form-group">
                        <label className="form-label">Tên</label>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            name="name"
                            value={profile.name || ""}
                            onChange={(e) => onProfileChange('name', e.target.value)}
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {profile.email ? (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    name="email"
                                    value={profile.email}
                                    onChange={(e) => onProfileChange('email', e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={onEditEmail} size="small">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            ) : (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    name="email"
                                    value=""
                                    onChange={(e) => onProfileChange('email', e.target.value)}
                                    placeholder="Chưa có email"
                                />
                            )}
                            {!profile.email && (
                                <Button
                                    variant="text"
                                    color="primary"
                                    sx={{ ml: 1, textTransform: 'none', fontSize: '14px', whiteSpace: 'nowrap' }}
                                    onClick={onEditEmail}
                                >
                                    Thêm
                                </Button>
                            )}
                        </Box>
                    </div>

                    {/* Số điện thoại */}
                    <div className="form-group">
                        <label className="form-label">Số điện thoại</label>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            name="phone"
                            type="tel"
                            value={profile.phone || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^\+?[0-9]*$/.test(value)) {
                                    onProfileChange('phone', value);
                                }
                            }}
                            placeholder="+84 123 456 789"
                            helperText="Ví dụ: +84 987654321"
                        />
                    </div>

                    {/* Giới tính */}
                    <div className="form-group">
                        <label className="form-label">Giới tính</label>
                        <RadioGroup
                            row
                            className="profile-radio-group"
                            name="gender"
                            value={profile.gender || "male"}
                            onChange={(e) => onProfileChange('gender', e.target.value)}
                        >
                            <FormControlLabel value="male" control={<Radio color="warning" size="small" />} label="Nam" />
                            <FormControlLabel value="female" control={<Radio color="warning" size="small" />} label="Nữ" />
                            <FormControlLabel value="other" control={<Radio color="warning" size="small" />} label="Khác" />
                        </RadioGroup>
                    </div>

                    {/* Ngày sinh */}
                    <div className="form-group">
                        <label className="form-label">Ngày sinh</label>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            name="birthDate"
                            type="date"
                            value={profile.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : ""}
                            onChange={(e) => onProfileChange('birthDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            helperText={profile.birthDate ? `Ngày sinh: ${new Date(profile.birthDate).toLocaleDateString('vi-VN')}` : "Chọn ngày sinh của bạn"}
                        />
                    </div>

                    {/* Nút Lưu */}
                    <Button
                        variant="contained"
                        fullWidth
                        className="save-btn"
                        onClick={onSave}
                        sx={{ bgcolor: '#ff5722', '&:hover': { bgcolor: '#e64a19' } }}
                    >
                        Lưu Thay Đổi
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

                {/* Cột phải: Ảnh đại diện */}
                <div className="avatar-section">
                    <div className="avatar-wrapper">
                        <Avatar
                            className="profile-avatar"
                            src={profile.avatarUrl || "https://i.pravatar.cc/150?img=3"}
                            alt="Avatar"
                            sx={{
                                width: 140,
                                height: 140,
                                cursor: 'pointer',
                            }}
                            onClick={() => fileInputRef.current?.click()}
                        />
                    </div>
                    <input
                        type="file"
                        accept="image/jpeg,image/png"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={onFileChange}
                    />
                    <Button
                        variant="outlined"
                        className="choose-photo-btn"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Chọn Ảnh
                    </Button>
                    <div className="avatar-hint">
                        Dung lượng tối đa 5 MB<br />
                        Định dạng: .JPEG, .PNG
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileContent;