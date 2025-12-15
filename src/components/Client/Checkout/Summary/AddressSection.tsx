import React, { useState } from 'react';
import { Address } from '../../../../types/Address';
import AddressForm from '../../Common/AddressForm';

interface AddressSectionProps {
    addresses: Address[];
    selectedAddress: Address | null;
    onSelectAddress: (address: Address) => void;
    onAddAddress: (newAddress: any) => Promise<void>;
}

const AddressSection: React.FC<AddressSectionProps> = ({ addresses, selectedAddress, onSelectAddress, onAddAddress }) => {
    // 1. Hooks & State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newAddressData, setNewAddressData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveNewAddress = async () => {
        if (!newAddressData || !newAddressData.name || !newAddressData.phone || !newAddressData.fullAddress) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        setIsSaving(true);
        try {
            await onAddAddress({
                name: newAddressData.name,
                phone: newAddressData.phone,
                address: newAddressData.fullAddress,
                city: newAddressData.city,
                district: newAddressData.district,
                ward: newAddressData.ward,
                specificAddress: newAddressData.specificAddress,
                isDefault: addresses.length === 0 // Make default if it's the first address
            });
            setIsAddingNew(false);
            setNewAddressData(null);
        } catch (error) {
            console.error("Failed to add address", error);
        } finally {
            setIsSaving(false);
        }
    };

    // 2. Render
    return (
        <>
            {/* Modal chọn địa chỉ */}
            {isModalOpen && (
                <div className="address-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="address-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{isAddingNew ? 'Thêm địa chỉ mới' : 'Chọn địa chỉ nhận hàng'}</h3>

                        {isAddingNew ? (
                            <div className="add-address-form-wrapper">
                                <AddressForm
                                    onChange={(data, fullAddressString) => {
                                        setNewAddressData({ ...data, fullAddress: fullAddressString });
                                    }}
                                />
                                <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => setIsAddingNew(false)}
                                        disabled={isSaving}
                                    >
                                        Trở lại
                                    </button>
                                    <button
                                        className="btn-primary"
                                        onClick={handleSaveNewAddress}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Đang lưu...' : 'Lưu địa chỉ'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="address-list">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr._id}
                                            className={`address-item ${selectedAddress?._id === addr._id ? 'selected' : ''}`}
                                            onClick={() => {
                                                onSelectAddress(addr);
                                                setIsModalOpen(false);
                                            }}
                                        >
                                            <div>
                                                <strong>{addr.name} (+84) {addr.phone}</strong>
                                                <p>{addr.address}</p>
                                            </div>
                                            {addr.isDefault && <span className="default-tag">Mặc định</span>}
                                        </div>
                                    ))}
                                </div>
                                <div className="modal-footer-actions" style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <button
                                        className="btn-dashed"
                                        onClick={() => setIsAddingNew(true)}
                                        style={{ border: '1px dashed #ee4d2d', color: '#ee4d2d', padding: '8px 15px', background: 'white', cursor: 'pointer' }}
                                    >
                                        + Thêm địa chỉ mới
                                    </button>
                                    <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                                        Đóng
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="section address-section">
                <div className="section-header">
                    <span className="icon">📍</span>
                    <h3>Địa Chỉ Nhận Hàng</h3>
                    <button className="change-btn" onClick={() => setIsModalOpen(true)}>
                        Thay đổi
                    </button>
                </div>
                <div className="address-info">
                    {selectedAddress ? (
                        <>
                            <strong>{selectedAddress.name} (+84) {selectedAddress.phone}</strong>
                            <p>{selectedAddress.address}</p>
                        </>
                    ) : (
                        <p>Chưa có địa chỉ nào</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default AddressSection;
