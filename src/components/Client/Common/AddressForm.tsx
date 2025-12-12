import { Box, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface AddressFormData {
    name: string;
    phone: string;
    specificAddress: string;
    city: string;     // Stores the ID or Name? The current implementation mixes them slightly but relies on ID for selection. The output string needs Name.
    district: string;
    ward: string;
}

interface AddressFormProps {
    initialData?: {
        name: string;
        phone: string;
        address: string; // Full string for Edit parsing
    };
    onChange: (data: AddressFormData, fullAddressString: string) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ initialData, onChange }) => {
    // Parsing logic for Edit mode
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
        return { city: '', district: '', ward: '', specificAddress: fullAddr };
    };

    const initialParts = React.useMemo(() => initialData ? parseAddress(initialData.address) : { city: '', district: '', ward: '', specificAddress: '' }, [initialData]);

    const [name, setName] = useState(initialData?.name || '');
    const [phone, setPhone] = useState(initialData?.phone || '');
    const [specificAddress, setSpecificAddress] = useState(initialParts.specificAddress);

    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    // Fetch Provinces & Auto-select
    useEffect(() => {
        fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
            .then(response => response.json())
            .then(data => {
                if (data.error === 0) {
                    setProvinces(data.data);
                    if (initialParts.city) {
                        const found = data.data.find((p: any) => p.name === initialParts.city || initialParts.city.includes(p.name) || p.name.includes(initialParts.city));
                        if (found) setSelectedProvince(found.id);
                    }
                }
            })
            .catch(err => console.error(err));
    }, [initialParts.city]);

    // Fetch Districts & Auto-select
    useEffect(() => {
        if (selectedProvince) {
            fetch(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`)
                .then(response => response.json())
                .then(data => {
                    if (data.error === 0) {
                        setDistricts(data.data);

                        // Auto-select logic
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
    }, [selectedProvince, provinces, initialParts]); // Included initialParts for dependency stability

    // Fetch Wards & Auto-select
    useEffect(() => {
        if (selectedDistrict) {
            fetch(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`)
                .then(response => response.json())
                .then(data => {
                    if (data.error === 0) {
                        setWards(data.data);

                        // Auto-select logic
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
    }, [selectedDistrict, districts, initialParts]);

    // Notify parent of changes
    useEffect(() => {
        const provinceName = provinces.find(p => p.id === selectedProvince)?.name || '';
        const districtName = districts.find(d => d.id === selectedDistrict)?.name || '';
        const wardName = wards.find(w => w.id === selectedWard)?.name || '';

        const fullAddress = `${specificAddress}, ${wardName}, ${districtName}, ${provinceName}`;

        onChange({
            name,
            phone,
            specificAddress,
            city: selectedProvince,
            district: selectedDistrict,
            ward: selectedWard
        }, fullAddress);
    }, [name, phone, specificAddress, selectedProvince, selectedDistrict, selectedWard, provinces, districts, wards]);

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 1 }}>
                <TextField
                    fullWidth
                    label="Họ và tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                    size="small"
                />
                <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                    value={specificAddress}
                    onChange={(e) => setSpecificAddress(e.target.value)}
                    variant="outlined"
                    size="small"
                />
            </Box>
        </Box>
    );
};

export default AddressForm;
