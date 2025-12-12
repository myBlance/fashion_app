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
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        specificAddress: '',
        type: 'home' as 'home' | 'work',
        isDefault: false,
    });

    // Fetch Provinces
    React.useEffect(() => {
        fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
            .then(response => response.json())
            .then(data => {
                if (data.error === 0) {
                    setProvinces(data.data);
                }
            })
            .catch(err => console.error(err));
    }, []);

    // Fetch Districts
    React.useEffect(() => {
        if (selectedProvince) {
            fetch(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`)
                .then(response => response.json())
                .then(data => {
                    if (data.error === 0) {
                        setDistricts(data.data);
                        setWards([]);
                        setSelectedDistrict('');
                        setSelectedWard('');
                    }
                })
                .catch(err => console.error(err));
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedProvince]);

    // Fetch Wards
    React.useEffect(() => {
        if (selectedDistrict) {
            fetch(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`)
                .then(response => response.json())
                .then(data => {
                    if (data.error === 0) {
                        setWards(data.data);
                        setSelectedWard('');
                    }
                })
                .catch(err => console.error(err));
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, type: e.target.value as 'home' | 'work' }));
    };

    const handleSave = () => {
        if (!formData.name || !formData.phone || !selectedProvince || !selectedDistrict || !selectedWard || !formData.specificAddress) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const provinceName = provinces.find(p => p.id === selectedProvince)?.name || '';
        const districtName = districts.find(d => d.id === selectedDistrict)?.name || '';
        const wardName = wards.find(w => w.id === selectedWard)?.name || '';

        const fullAddress = `${formData.specificAddress}, ${wardName}, ${districtName}, ${provinceName}`;

        onAdd({
            name: formData.name,
            phone: formData.phone,
            address: fullAddress,
            type: formData.type,
            isDefault: formData.isDefault,
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
                        select
                        fullWidth
                        label="Tỉnh / Thành phố"
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        variant="outlined"
                        size="small"
                        SelectProps={{ native: true }}
                        InputLabelProps={{ shrink: true }}
                    >
                        <option value="">Chọn Tỉnh/Thành phố</option>
                        {provinces.map((province) => (
                            <option key={province.id} value={province.id}>
                                {province.name}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Quận / Huyện"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        variant="outlined"
                        size="small"
                        disabled={!selectedProvince}
                        SelectProps={{ native: true }}
                        InputLabelProps={{ shrink: true }}
                    >
                        <option value="">Chọn Quận/Huyện</option>
                        {districts.map((district) => (
                            <option key={district.id} value={district.id}>
                                {district.name}
                            </option>
                        ))}
                    </TextField>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        select
                        fullWidth
                        label="Phường / Xã"
                        value={selectedWard}
                        onChange={(e) => setSelectedWard(e.target.value)}
                        variant="outlined"
                        size="small"
                        disabled={!selectedDistrict}
                        SelectProps={{ native: true }}
                        InputLabelProps={{ shrink: true }}
                    >
                        <option value="">Chọn Phường/Xã</option>
                        {wards.map((ward) => (
                            <option key={ward.id} value={ward.id}>
                                {ward.name}
                            </option>
                        ))}
                    </TextField>
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