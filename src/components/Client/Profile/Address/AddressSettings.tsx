import { Alert, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useToast } from '../../../../contexts/ToastContext';
import '../../../../styles/ProfileContent.css';
import { Address } from '../../../../types/Address';
import AddAddressModal from './AddAddressModal';
import AddressList from './AddressList';
import EditAddressModal from './EditAddressModal';

const AddressSettings: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { showToast } = useToast();

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
            showToast('Bạn chưa đăng nhập. Vui lòng đăng nhập để thêm địa chỉ.', 'warning');
            return;
        }
        setIsAddModalOpen(true);
    };

    const handleUpdate = (id: string) => {
        if (!token) {
            showToast('Bạn chưa đăng nhập. Vui lòng đăng nhập để cập nhật địa chỉ.', 'warning');
            return;
        }

        // ✅ Kiểm tra id hợp lệ
        if (!id || id === 'undefined') {
            console.error('[handleUpdate] Invalid address ID:', id);
            showToast('ID địa chỉ không hợp lệ.', 'error');
            return;
        }

        const addr = addresses.find(a => a._id === id);
        if (!addr) {
            console.error('[handleUpdate] Address not found for ID:', id);
            showToast('Không tìm thấy địa chỉ.', 'error');
            return;
        }

        setEditingAddress(addr);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!token) {
            showToast('Bạn chưa đăng nhập. Vui lòng đăng nhập để xóa địa chỉ.', 'warning');
            return;
        }
        if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/addresses/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setAddresses(prev => prev.filter(addr => addr._id !== id));
            showToast("Xóa địa chỉ thành công", "success");
        } catch (err: any) {
            console.error('Lỗi khi xóa địa chỉ:', err);
            if (err.response?.status === 401) {
                showToast('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.', 'error');
                localStorage.removeItem('token');
            } else {
                showToast('Không thể xóa địa chỉ', 'error');
            }
        }
    };

    const handleSetDefault = async (id: string) => {
        if (!token) {
            showToast('Bạn chưa đăng nhập. Vui lòng đăng nhập để cập nhật địa chỉ.', 'warning');
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
            showToast("Đặt làm địa chỉ mặc định thành công", "success");
        } catch (err: any) {
            console.error('Lỗi khi cập nhật địa chỉ mặc định:', err);
            if (err.response?.status === 401) {
                showToast('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.', 'error');
                localStorage.removeItem('token');
            } else {
                showToast('Không thể cập nhật địa chỉ mặc định', 'error');
            }
        }
    };

    const handleSaveAddress = async (updatedAddress: any) => {
        if (!token) {
            showToast('Bạn chưa đăng nhập. Vui lòng đăng nhập để cập nhật địa chỉ.', 'warning');
            return;
        }

        // ✅ Kiểm tra _id hợp lệ trước khi gửi
        if (!updatedAddress?._id || updatedAddress._id === 'undefined') {
            console.error('❌ Missing or invalid _id in updatedAddress:', updatedAddress);
            showToast('Lỗi: ID địa chỉ không hợp lệ.', 'error');
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
                    type: updatedAddress.type,
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
                showToast('Lỗi: Không nhận được dữ liệu địa chỉ hợp lệ từ máy chủ.', 'error');
                return;
            }

            setAddresses(prev =>
                prev.map(addr => (addr._id === savedAddr._id ? savedAddr : addr))
            );

            setIsEditModalOpen(false);
            showToast("Cập nhật thành công", "success");
        } catch (err: any) {
            console.error('Lỗi khi cập nhật địa chỉ:', err);
            if (err.response?.status === 401) {
                showToast('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.', 'error');
                localStorage.removeItem('token');
            } else if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                // ✅ Xử lý lỗi array validator
                const errorMsg = err.response.data.errors.map((e: any) => e.msg).join(', ');
                showToast(`Lỗi: ${errorMsg}`, 'error');
            } else if (err.response?.data?.message) {
                showToast(`Lỗi: ${err.response.data.message}`, 'error');
            } else {
                showToast('Không thể cập nhật địa chỉ', 'error');
            }
        }
    };

    const handleAddAddress = async (newAddress: any) => {
        if (!token) {
            showToast('Bạn chưa đăng nhập. Vui lòng đăng nhập để thêm địa chỉ.', 'warning');
            return;
        }
        try {
            const payload = {
                name: newAddress.name,
                phone: newAddress.phone,
                address: newAddress.address,
                type: newAddress.type,
                isDefault: newAddress.isDefault,
            };

            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/addresses`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const addedAddr = res.data.data;

            // ✅ Kiểm tra _id từ backend
            if (!addedAddr?._id) {
                console.error('❌ Backend không trả về _id cho địa chỉ mới:', addedAddr);
                showToast('Lỗi: Không nhận được ID địa chỉ từ máy chủ.', 'error');
                return;
            }

            setAddresses(prev => [...prev, addedAddr]);

            setIsAddModalOpen(false);
            showToast("Thêm địa chỉ thành công", "success");
        } catch (err: any) {
            console.error('Lỗi khi thêm địa chỉ:', err);
            if (err.response?.status === 401) {
                showToast('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.', 'error');
                localStorage.removeItem('token');
            } else if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                // ✅ Xử lý lỗi từ express-validator (mảng errors)
                const errorMsg = err.response.data.errors.map((e: any) => e.msg).join(', ');
                console.error('Backend validation errors:', err.response.data.errors);
                showToast(`Lỗi: ${errorMsg}`, 'error');
            } else if (err.response?.data?.message) {
                // ✅ Hiển thị thông báo lỗi chung
                console.error('Backend error message:', err.response.data);
                showToast(`Lỗi: ${err.response.data.message}`, 'error');
            } else {
                showToast('Không thể thêm địa chỉ', 'error');
            }
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <div className="profile-content-container">
            <div className="profile-header">
                <Typography variant="h5">Địa Chỉ</Typography>
                <Typography variant="body2">
                    Quản lý danh sách địa chỉ nhận hàng của bạn
                </Typography>
            </div>

            <div className="profile-divider" style={{ margin: '24px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}></div>

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
        </div>
    );
};

export default AddressSettings;