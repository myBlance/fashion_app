import React, { useState } from 'react';
import { Address } from '../../../../types/Address';

interface AddressSectionProps {
    addresses: Address[];
    selectedAddress: Address | null;
    onSelectAddress: (address: Address) => void;
    onOpenModal?: () => void; // Optional if we move modal inside, but let's keep it self-contained if possible or flexible
}

const AddressSection: React.FC<AddressSectionProps> = ({ addresses, selectedAddress, onSelectAddress }) => {
    // 1. Hooks & State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 2. Render
    return (
        <>
            {/* Modal chọn địa chỉ */}
            {isModalOpen && (
                <div className="address-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="address-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Chọn địa chỉ nhận hàng</h3>
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
                        <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                            Đóng
                        </button>
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
