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
import { Address } from '../../../../types/Address';
import AddressForm from '../../Common/AddressForm';

interface EditAddressModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (updatedAddress: Address) => void;
    address: Address;
}

const EditAddressModal: React.FC<EditAddressModalProps> = ({
    open,
    onClose,
    onSave,
    address,
}) => {
    const [formData, setFormData] = useState({
        name: address.name,
        phone: address.phone,
        address: address.address,
        isDefault: address.isDefault || false,
        type: address.type || 'home',
    });

    const [isValid, setIsValid] = useState(true); // Assume valid initially since it's an edit

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
        if (!address._id) {
            console.error('❌ Missing _id in address', address);
            alert('Không thể lưu: thiếu ID địa chỉ.');
            return;
        }

        if (!isValid) {
            alert('Vui lòng điền đầy đủ thông tin');
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
                Cập nhật địa chỉ
            </DialogTitle>
            <DialogContent>
                <AddressForm
                    initialData={{
                        name: address.name,
                        phone: address.phone,
                        address: address.address
                    }}
                    onChange={handleAddressFormChange}
                />

                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
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
                    color="primary"
                    sx={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                    }}
                >
                    Cập nhật
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAddressModal;