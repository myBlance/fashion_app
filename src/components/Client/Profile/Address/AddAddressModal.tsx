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

interface AddAddressModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (newAddress: any) => void;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
    open,
    onClose,
    onAdd,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        district: '',
        ward: '',
        specificAddress: '',
        type: 'home' as 'home' | 'work',
        isDefault: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, type: e.target.value as 'home' | 'work' }));
    };

    const handleSave = () => {
        if (!formData.name || !formData.phone || !formData.city || !formData.district || !formData.ward || !formData.specificAddress) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const fullAddress = `${formData.specificAddress}, ${formData.ward}, ${formData.district}, ${formData.city}`;

        onAdd({
            name: formData.name,
            phone: formData.phone,
            address: fullAddress,
            type: formData.type,
            isDefault: formData.isDefault,
            // _id sẽ do backend tự sinh
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Thêm địa chỉ mới
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

export default AddAddressModal;