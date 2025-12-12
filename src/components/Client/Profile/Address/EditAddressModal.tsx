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

    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    const [formData, setFormData] = useState({
        name: address.name,
        phone: address.phone,
        specificAddress: '',
        isDefault: address.isDefault || false,
        type: address.type || 'home',
    });

    // Parse initial address on open
    const initialParts = React.useMemo(() => parseAddress(address.address), [address.address]);

    // Initialize specific address part
    React.useEffect(() => {
        setFormData(prev => ({ ...prev, specificAddress: initialParts.specificAddress }));
    }, [initialParts]);

    // Fetch Provinces
    React.useEffect(() => {
        fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
            .then(response => response.json())
            .then(data => {
                if (data.error === 0) {
                    setProvinces(data.data);
                    // Try to auto-select province
                    const found = data.data.find((p: any) => p.name === initialParts.city || initialParts.city.includes(p.name) || p.name.includes(initialParts.city));
                    if (found) setSelectedProvince(found.id);
                }
            })
            .catch(err => console.error(err));
    }, [initialParts.city]);

    // Fetch Districts
    React.useEffect(() => {
        if (selectedProvince) {
            fetch(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`)
                .then(response => response.json())
                .then(data => {
                    if (data.error === 0) {
                        setDistricts(data.data);

                        // Check if we should auto-select district
                        // We only auto-select if the current selectedProvince matches the initial address province
                        const matchedProv = provinces.find((p: any) => p.name === initialParts.city || initialParts.city.includes(p.name) || p.name.includes(initialParts.city));

                        let autoSelected = false;
                        if (matchedProv && matchedProv.id === selectedProvince) {
                            const found = data.data.find((d: any) => d.name === initialParts.district || initialParts.district.includes(d.name) || d.name.includes(initialParts.district));
                            if (found) {
                                setSelectedDistrict(found.id);
                                autoSelected = true;
                            }
                        }

                        if (!autoSelected) {
                            setSelectedDistrict('');
                            setWards([]);
                            setSelectedWard('');
                        }
                    }
                })
                .catch(err => console.error(err));
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedProvince, provinces, initialParts.city, initialParts.district]);

    // Fetch Wards
    React.useEffect(() => {
        if (selectedDistrict) {
            fetch(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`)
                .then(response => response.json())
                .then(data => {
                    if (data.error === 0) {
                        setWards(data.data);

                        // Auto-select ward
                        const matchedDist = districts.find((d: any) => d.name === initialParts.district || initialParts.district.includes(d.name) || d.name.includes(initialParts.district));

                        let autoSelected = false;
                        if (matchedDist && matchedDist.id === selectedDistrict) {
                            const found = data.data.find((w: any) => w.name === initialParts.ward || initialParts.ward.includes(w.name) || w.name.includes(initialParts.ward));
                            if (found) {
                                setSelectedWard(found.id);
                                autoSelected = true;
                            }
                        }

                        if (!autoSelected) {
                            setSelectedWard('');
                        }
                    }
                })
                .catch(err => console.error(err));
        } else {
            setWards([]);
        }
    }, [selectedDistrict, districts, initialParts.district, initialParts.ward]);


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

        if (!formData.name || !formData.phone || !selectedProvince || !selectedDistrict || !selectedWard || !formData.specificAddress) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const provinceName = provinces.find(p => p.id === selectedProvince)?.name || '';
        const districtName = districts.find(d => d.id === selectedDistrict)?.name || '';
        const wardName = wards.find(w => w.id === selectedWard)?.name || '';

        const fullAddress = `${formData.specificAddress}, ${wardName}, ${districtName}, ${provinceName}`;

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

export default EditAddressModal;