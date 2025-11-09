import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
} from '@mui/material';

interface EditAddressModalProps {
    open: boolean;
    onClose: () => void;
    address: {
        _id: string;
        name: string;
        phone: string;
        address: string;
        isDefault?: boolean;
        type?: 'home' | 'work';
    };
    onSave: (updatedAddress: any) => void;
}

const EditAddressModal: React.FC<EditAddressModalProps> = ({
    open,
    onClose,
    address,
    onSave,
}) => {
    const [formData, setFormData] = useState({
        name: address.name,
        phone: address.phone,
        address: address.address,
        isDefault: address.isDefault || false,
        type: address.type || 'home',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, type: e.target.value as 'home' | 'work' }));
    };

    const handleSave = () => {
  if (!address._id) {
    console.error('❌ Missing _id in address', address);
    alert('Không thể lưu: thiếu ID địa chỉ.');
    return;
  }

  onSave({
    ...formData,
    _id: address._id,
  });
};

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Cập nhật địa chỉ (dùng thông tin trước sắp nhập)
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Họ và tên"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Số điện thoại"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Box>

                <TextField
                    fullWidth
                    label="Địa chỉ chi tiết"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                />

                {/* Bản đồ giả lập */}
                <Box
                    sx={{
                        width: '100%',
                        height: 150,
                        backgroundColor: '#f0f0f0',
                        borderRadius: '8px',
                        position: 'relative',
                        overflow: 'hidden',
                        mb: 2,
                    }}
                >
                    <img
                        src="https://via.placeholder.com/600x150?text=Google+Maps+Placeholder"
                        alt="Google Maps"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 20,
                            height: 20,
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            border: '4px solid white',
                            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                        }}
                    />
                </Box>

                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Loại địa chỉ:
                </Typography>
                <RadioGroup
                    row
                    name="type"
                    value={formData.type}
                    onChange={handleTypeChange}
                    sx={{ mb: 2 }}
                >
                    <FormControlLabel value="home" control={<Radio />} label="Nhà Riêng" />
                    <FormControlLabel value="work" control={<Radio />} label="Văn Phòng" />
                </RadioGroup>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" color="text.secondary">
                    * Bạn có thể chọn loại địa chỉ để tiện quản lý.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Trở Lại
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="error"
                    sx={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                    }}
                >
                    Hoàn thành
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAddressModal;