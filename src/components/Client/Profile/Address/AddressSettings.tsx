import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import EditAddressModal from './EditAddressModal';
import AddAddressModal from './AddAddressModal';
import AddressList from './AddressList';

interface Address {
    _id: string;
    name: string;
    phone: string;
    address: string;
    isDefault: boolean;
    type?: "home" | "work";
}

const AddressSettings: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để xem địa chỉ.');
            setLoading(false);
            return;
        }

        const fetchAddresses = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/addresses`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // ✅ Lọc các địa chỉ hợp lệ (có _id)
                const validAddresses = (res.data.data || [])
                    .filter((addr: any) => addr?._id && typeof addr._id === 'string' && addr._id.trim() !== '')
                    .map((addr: any) => ({
                        _id: addr._id,
                        name: addr.name,
                        phone: addr.phone,
                        address: addr.address,
                        isDefault: addr.isDefault,
                        type: addr.type
                    }));

                if (validAddresses.length !== (res.data.data || []).length) {
                    console.warn('⚠️ Một số địa chỉ bị bỏ qua do thiếu _id');
                }

                setAddresses(validAddresses);
            } catch (err: any) {
                console.error('Lỗi khi lấy danh sách địa chỉ:', err);

                if (err.response?.status === 401) {
                    setError('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');
                    localStorage.removeItem('token');
                } else {
                    setError('Không thể tải danh sách địa chỉ');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, []);

    const handleAddNew = () => {
        if (!token) {
            alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để thêm địa chỉ.');
            return;
        }
        setIsAddModalOpen(true);
    };

    const handleUpdate = (id: string) => {
        if (!token) {
            alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để cập nhật địa chỉ.');
            return;
        }

        // ✅ Kiểm tra id hợp lệ
        if (!id || id === 'undefined') {
            console.error('[handleUpdate] Invalid address ID:', id);
            alert('ID địa chỉ không hợp lệ.');
            return;
        }

        const addr = addresses.find(a => a._id === id);
        if (!addr) {
            console.error('[handleUpdate] Address not found for ID:', id);
            alert('Không tìm thấy địa chỉ.');
            return;
        }

        setEditingAddress(addr);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!token) {
            alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để xóa địa chỉ.');
            return;
        }
        if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/addresses/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setAddresses(prev => prev.filter(addr => addr._id !== id));
        } catch (err: any) {
            console.error('Lỗi khi xóa địa chỉ:', err);
            if (err.response?.status === 401) {
                alert('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');
                localStorage.removeItem('token');
            } else {
                alert('Không thể xóa địa chỉ');
            }
        }
    };

    const handleSetDefault = async (id: string) => {
        if (!token) {
            alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để cập nhật địa chỉ.');
            return;
        }
        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/addresses/${id}`,
                { isDefault: true },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setAddresses(prev =>
                prev.map(addr => ({
                    ...addr,
                    isDefault: addr._id === id,
                }))
            );
        } catch (err: any) {
            console.error('Lỗi khi cập nhật địa chỉ mặc định:', err);
            if (err.response?.status === 401) {
                alert('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');
                localStorage.removeItem('token');
            } else {
                alert('Không thể cập nhật địa chỉ mặc định');
            }
        }
    };

    const handleSaveAddress = async (updatedAddress: any) => {
        if (!token) {
            alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để cập nhật địa chỉ.');
            return;
        }

        // ✅ Kiểm tra _id hợp lệ trước khi gửi
        if (!updatedAddress?._id || updatedAddress._id === 'undefined') {
            console.error('❌ Missing or invalid _id in updatedAddress:', updatedAddress);
            alert('Lỗi: ID địa chỉ không hợp lệ.');
            return;
        }

        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/addresses/${updatedAddress._id}`,
                {
                    name: updatedAddress.name,
                    phone: updatedAddress.phone,
                    address: updatedAddress.address,
                    isDefault: updatedAddress.isDefault,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // ✅ Backend trả về địa chỉ đã cập nhật
            const savedAddr = res.data.data;

            // ✅ Kiểm tra lại _id từ backend
            if (!savedAddr?._id) {
                console.error('❌ Backend không trả về _id hợp lệ:', savedAddr);
                alert('Lỗi: Không nhận được dữ liệu địa chỉ hợp lệ từ máy chủ.');
                return;
            }

            setAddresses(prev =>
                prev.map(addr => (addr._id === savedAddr._id ? savedAddr : addr))
            );

            setIsEditModalOpen(false);
        } catch (err: any) {
            console.error('Lỗi khi cập nhật địa chỉ:', err);
            if (err.response?.status === 401) {
                alert('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');
                localStorage.removeItem('token');
            } else {
                alert('Không thể cập nhật địa chỉ');
            }
        }
    };

    const handleAddAddress = async (newAddress: any) => {
        if (!token) {
            alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để thêm địa chỉ.');
            return;
        }
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/addresses`,
                newAddress,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const addedAddr = res.data.data;

            // ✅ Kiểm tra _id từ backend
            if (!addedAddr?._id) {
                console.error('❌ Backend không trả về _id cho địa chỉ mới:', addedAddr);
                alert('Lỗi: Không nhận được ID địa chỉ từ máy chủ.');
                return;
            }

            setAddresses(prev => [...prev, addedAddr]);

            setIsAddModalOpen(false);
        } catch (err: any) {
            console.error('Lỗi khi thêm địa chỉ:', err);
            if (err.response?.status === 401) {
                alert('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');
                localStorage.removeItem('token');
            } else {
                alert('Không thể thêm địa chỉ');
            }
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Địa Chỉ
            </Typography>
            <AddressList
                addresses={addresses}
                onAddNew={handleAddNew}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
            />

            {/* Modal chỉnh sửa */}
            {editingAddress && (
                <EditAddressModal
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    address={editingAddress}
                    onSave={handleSaveAddress}
                />
            )}

            {/* Modal thêm mới */}
            <AddAddressModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddAddress}
            />
        </Box>
    );
};

export default AddressSettings;