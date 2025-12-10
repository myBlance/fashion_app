import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';

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
    // Hàm parse địa chỉ cũ (nếu có)
    const parseAddress = (fullAddr: string) => {
        if (!fullAddr) return { city: '', district: '', ward: '', specificAddress: '' };

        const parts = fullAddr.split(',').map(p => p.trim());
        if (parts.length >= 4) {
            return {
                specificAddress: parts.slice(0, parts.length - 3).join(', '),
                ward: parts[parts.length - 3],
                district: parts[parts.length - 2],
                city: parts[parts.length - 1],
            };
        }
        // Fallback nếu format không đúng
        return { city: '', district: '', ward: '', specificAddress: fullAddr };
    };

    const initialAddressParts = parseAddress(address.address);

    const [formData, setFormData] = useState({
        name: address.name,
        phone: address.phone,
        city: initialAddressParts.city,
        district: initialAddressParts.district,
        ward: initialAddressParts.ward,
        specificAddress: initialAddressParts.specificAddress,
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

        if (!formData.name || !formData.phone || !formData.city || !formData.district || !formData.ward || !formData.specificAddress) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const fullAddress = `${formData.specificAddress}, ${formData.ward}, ${formData.district}, ${formData.city}`;

        onSave({
            ...formData,
            address: fullAddress,
            _id: address._id,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Cập nhật địa chỉ
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Họ và tên"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        fullWidth
                        label="Số điện thoại"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Tỉnh / Thành phố"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        fullWidth
                        label="Quận / Huyện"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Phường / Xã"
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        fullWidth
                        label="Số nhà, tên đường"
                        name="specificAddress"
                        value={formData.specificAddress}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
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
                    * Vui lòng nhập địa chỉ chính xác để giao hàng thuận tiện hơn.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
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