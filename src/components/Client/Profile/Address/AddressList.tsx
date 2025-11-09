import React from 'react';
import {
    Box,
    Typography,
    Button,
    Divider,
    Chip,
    Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Address {
    _id: string;
    name: string;
    phone: string;
    address: string;
    isDefault: boolean;
}

interface AddressListProps {
    addresses: Address[];
    onAddNew: () => void;
    onUpdate: (id: string) => void;
    onDelete: (id: string) => void;
    onSetDefault: (id: string) => void;
}

const AddressList: React.FC<AddressListProps> = ({
    addresses,
    onAddNew,
    onUpdate,
    onDelete,
    onSetDefault,
}) => {
    return (
        <Box>

            {/* Nút thêm địa chỉ */}
            <Button
                variant="contained"
                color="error"
                startIcon={<AddIcon />}
                onClick={onAddNew}
                sx={{
                    mb: 3,
                    fontSize: 14,
                    fontWeight: 'bold',
                    px: 2,
                    py: 0.8,
                    textTransform: 'none',
                    borderRadius: 2,
                }}
            >
                Thêm địa chỉ mới
            </Button>

            <Divider sx={{ mb: 3 }} />

            {/* Danh sách địa chỉ */}
            {addresses.length === 0 ? (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ textAlign: 'center', py: 4 }}
                >
                    Bạn chưa có địa chỉ nào.
                </Typography>
            ) : (
                addresses.map((addr) => (
                    <Box
                        key={addr._id}
                        sx={{
                            p: 2,
                            mb: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            transition: '0.2s',
                            '&:hover': { backgroundColor: '#fafafa' },
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                        >
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {addr.name} | {addr.phone}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                >
                                    {addr.address}
                                </Typography>
                                {addr.isDefault && (
                                    <Chip
                                        label="Mặc định"
                                        size="small"
                                        color="primary"
                                        sx={{ mt: 1, fontSize: '12px' }}
                                    />
                                )}
                            </Box>

                            <Stack direction="column" spacing={1} alignItems="flex-end">
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={() => onUpdate(addr._id)}
                                        sx={{ textTransform: 'none', fontSize: 14 }}
                                    >
                                        Cập nhật
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => onDelete(addr._id)}
                                        sx={{ textTransform: 'none', fontSize: 14 }}
                                    >
                                        Xóa
                                    </Button>
                                </Stack>

                                {!addr.isDefault && (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => onSetDefault(addr._id)}
                                        sx={{
                                            textTransform: 'none',
                                            fontSize: 12,
                                            py: 0.5,
                                            px: 1,
                                            mt: 0.5,
                                        }}
                                    >
                                        Thiết lập mặc định
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    </Box>
                ))
            )}

            {/* Thông báo cập nhật (chỉ hiển thị khi có địa chỉ) */}
            {addresses.length > 0 && (
                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        backgroundColor: '#fff8e1',
                        borderRadius: 2,
                        borderLeft: '4px solid #ffc107',
                    }}
                >
                    <Typography variant="caption" color="warning.main">
                        Một vài thông tin có thể đã cũ, vui lòng giúp chúng tôi cập nhật địa chỉ
                        của bạn.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default AddressList;
