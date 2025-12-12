import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import AddressForm from '../../Common/AddressForm';

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
        address: '',
        type: 'home' as 'home' | 'work',
        isDefault: false,
    });

    const [isValid, setIsValid] = useState(false);

    const handleAddressFormChange = (data: any, fullAddress: string) => {
        setFormData(prev => ({
            ...prev,
            name: data.name,
            phone: data.phone,
            address: fullAddress
        }));

        // Simple validation check
        const valid = !!data.name && !!data.phone && !!data.city && !!data.district && !!data.ward && !!data.specificAddress;
        setIsValid(valid);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, type: e.target.value as 'home' | 'work' }));
    };

    const handleSave = () => {
        if (!isValid) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        onAdd(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Thêm địa chỉ mới
            </DialogTitle>
            <DialogContent>
                <AddressForm onChange={handleAddressFormChange} />

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