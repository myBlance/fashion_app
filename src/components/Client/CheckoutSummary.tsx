import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/CheckoutSummary.css';

import VoucherModal from '../../components/Client/Voucher/VoucherModal';
import { Voucher } from '../../types/Voucher';
import { Address } from '../../types/Address';

interface CheckoutSummaryProps {
  cartItems: Array<{
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
  }>;
  totalAmount: number;
  onPlaceOrder?: () => void;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ cartItems, totalAmount }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('shopeepay');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Tính phí vận chuyển
  const shippingFee = shippingMethod === 'express' ? 30000 : 16500;

  // Kiểm tra điều kiện áp dụng voucher
  const isVoucherValid = selectedVoucher && totalAmount >= (selectedVoucher.minOrderValue || 0);

  // ✅ Tính giảm giá từ voucher
  const calculateDiscount = () => {
    if (!selectedVoucher || !isVoucherValid) return 0;

    if (selectedVoucher.type === 'fixed') {
      // ✅ Giảm giá cố định: không vượt quá tổng tiền
      return Math.min(selectedVoucher.value || 0, totalAmount);
    }

    if (selectedVoucher.type === 'percentage') {
      // ✅ Giảm giá theo %: tính phần trăm của tổng tiền, không vượt quá tổng tiền
      const percentage = selectedVoucher.value || 0;
      const discount = (totalAmount * percentage) / 100;
      return Math.min(discount, totalAmount);
    }

    return 0;
  };

  // ✅ Tính tổng tiền sau khi áp dụng voucher
  const discountAmount = calculateDiscount();
  const finalTotal = totalAmount - discountAmount + shippingFee;

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const addrList = res.data.data || [];
        setAddresses(addrList);

        const defaultAddr = addrList.find((addr: Address) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        } else if (addrList.length > 0) {
          setSelectedAddress(addrList[0]);
        }
      } catch (err) {
        console.error('Lỗi khi tải địa chỉ:', err);
      }
    };

    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Vui lòng chọn địa chỉ nhận hàng.');
      return;
    }

    if (selectedVoucher && !isVoucherValid) {
      alert(`Voucher ${selectedVoucher.code} không đủ điều kiện áp dụng (cần đơn tối thiểu ${(selectedVoucher.minOrderValue || 0).toLocaleString()}đ).`);
      return;
    }

    let userId = null;
    if (token) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        userId = res.data.data._id;
      } catch (err) {
        console.error('Lỗi khi lấy thông tin người dùng:', err);
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login');
        return;
      }
    }

    if (!userId) {
      alert('Vui lòng đăng nhập để đặt hàng.');
      navigate('/login');
      return;
    }

    // ✅ Điều hướng tới đúng trang thanh toán
    if (selectedPaymentMethod === 'shopeepay') {
      navigate('/payment/shopeepay');
    } else if (selectedPaymentMethod === 'credit-card') {
      navigate('/payment/credit-card');
    } else if (selectedPaymentMethod === 'seepay') {
      navigate('/payment/seepay', {
        state: {
          cartItems,
          totalAmount,
          shippingFee,
          discountAmount,
          selectedAddress,
          userId,
        },
      });
    } else if (selectedPaymentMethod === 'cash-on-delivery') {
      navigate('/payment/cod', {
        state: {
          cartItems,
          totalAmount,
          shippingFee,
          discountAmount,
          selectedAddress,
          userId,
        },
      });
    } else {
      alert('Phương thức thanh toán chưa được hỗ trợ');
    }
  };

  // ✅ Hàm để hiển thị thông tin giảm giá của voucher
  const getVoucherDisplayText = (voucher: Voucher | null) => {
    if (!voucher) return '';

    if (voucher.type === 'percentage') {
      return `Giảm ${voucher.value}%`;
    }

    if (voucher.type === 'fixed') {
      return `Giảm ${(voucher.value || 0).toLocaleString()}₫`;
    }

    return 'Giảm giá';
  };

  const handleSelectVoucher = (voucher: Voucher | null) => {
    setSelectedVoucher(voucher);
  };

  return (
    <div className="checkout-summary">
      {/* Modal chọn địa chỉ */}
      {isAddressModalOpen && (
        <div className="address-modal-overlay" onClick={() => setIsAddressModalOpen(false)}>
          <div className="address-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Chọn địa chỉ nhận hàng</h3>
            <div className="address-list">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`address-item ${selectedAddress?._id === addr._id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedAddress(addr);
                    setIsAddressModalOpen(false);
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
            <button className="close-modal-btn" onClick={() => setIsAddressModalOpen(false)}>
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal chọn voucher */}
      <VoucherModal
        open={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        onSelect={handleSelectVoucher}
        selectedVoucher={selectedVoucher}
      />

      {/* Địa chỉ nhận hàng */}
      <div className="section address-section">
        <div className="section-header">
          <span className="icon">📍</span>
          <h3>Địa Chỉ Nhận Hàng</h3>
          <button className="change-btn" onClick={() => setIsAddressModalOpen(true)}>
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

      {/* Các phần còn lại giữ nguyên */}
      <div className="section products-section">
        <div className="section-header">
          <h3>Sản phẩm</h3>
        </div>
        <div className="products-list">
          {cartItems.map((item, index) => (
            <div key={index} className="product-item">
              <img src={item.image} alt={item.name} />
              <div className="product-details">
                <div className="product-name">{item.name}</div>
                <div className="product-variant">{item.color} / {item.size}</div>
                <div className="product-price">
                  {(item.price).toLocaleString()}₫ x {item.quantity}
                </div>
              </div>
              <div className="product-total">
                {(item.price * item.quantity).toLocaleString()}₫
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voucher */}
      <div className="section voucher-section">
        <div className="voucher-row">
          <div className="voucher-label">Voucher từ Shop</div>
          <button
            className="choose-voucher"
            onClick={() => setIsVoucherModalOpen(true)}
          >
            Chọn Voucher
          </button>
        </div>

        {/* ✅ Hiển thị voucher đã chọn với thông tin giảm giá */}
        {selectedVoucher && (
          <div className="selected-voucher" style={{
            marginTop: '12px',
            padding: '12px',
            background: isVoucherValid ? '#fff8e1' : '#ffebee',
            border: `1px solid ${isVoucherValid ? '#ffd54f' : '#f44336'}`,
            borderRadius: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <strong>{selectedVoucher.code}</strong> - {getVoucherDisplayText(selectedVoucher)}
              {!isVoucherValid && (
                <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
                  (Không đủ điều kiện)
                </span>
              )}
            </div>
            <button
              onClick={() => setSelectedVoucher(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#d32f2f',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Xóa
            </button>
          </div>
        )}
      </div>

      <div className="section shipping-section">
        <div className="section-header">
          <h3>Phương Thức Vận Chuyển</h3>
        </div>
        <div className="shipping-options">
          <div className="shipping-option">
            <input
              type="radio"
              id="standard-shipping"
              name="shipping"
              value="standard"
              checked={shippingMethod === 'standard'}
              onChange={() => setShippingMethod('standard')}
            />
            <label htmlFor="standard-shipping">
              <div className="shipping-title">Nhận hàng 10/11</div>
              <div className="shipping-desc">
                Nhận hàng 10/11 nếu đơn hàng được giao trước 12:00 ngày 07/11/2025.
              </div>
            </label>
            <div className="shipping-price">16.500₫</div>
          </div>
          <div className="shipping-option">
            <input
              type="radio"
              id="express-shipping"
              name="shipping"
              value="express"
              checked={shippingMethod === 'express'}
              onChange={() => setShippingMethod('express')}
            />
            <label htmlFor="express-shipping">
              <div className="shipping-title">Nhận hàng 09/11 - 10/11</div>
              <div className="shipping-desc">Giao hàng nhanh</div>
            </label>
            <div className="shipping-price">30.000₫</div>
          </div>
        </div>
      </div>

      <div className="section payment-section">
        <div className="section-header">
          <h3>Phương Thức Thanh Toán</h3>
        </div>
        <div className="payment-methods">
          <div className="payment-method">
            <input
              type="radio"
              id="shopeepay"
              name="payment"
              value="shopeepay"
              checked={selectedPaymentMethod === 'shopeepay'}
              onChange={() => setSelectedPaymentMethod('shopeepay')}
            />
            <label htmlFor="shopeepay">
              <img src="/assets/images/shopeepay.png" alt="ShopeePay" className="payment-icon" />
              Ví ShopeePay
            </label>
          </div>
          <div className="payment-method">
            <input
              type="radio"
              id="credit-card"
              name="payment"
              value="credit-card"
              checked={selectedPaymentMethod === 'credit-card'}
              onChange={() => setSelectedPaymentMethod('credit-card')}
            />
            <label htmlFor="credit-card">
              <img src="/assets/images/credit-card.png" alt="Thẻ tín dụng/giới hạn" className="payment-icon" />
              Thẻ tín dụng/Ghi nợ
            </label>
          </div>
          <div className="payment-method">
            <input
              type="radio"
              id="seepay"
              name="payment"
              value="seepay"
              checked={selectedPaymentMethod === 'seepay'}
              onChange={() => setSelectedPaymentMethod('seepay')}
            />
            <label htmlFor="seepay">
              <img src="/assets/images/seepay.png" alt="SeePay" className="payment-icon" />
              SeePay (Quét QR)
            </label>
          </div>
          <div className="payment-method">
            <input
              type="radio"
              id="cash-on-delivery"
              name="payment"
              value="cash-on-delivery"
              checked={selectedPaymentMethod === 'cash-on-delivery'}
              onChange={() => setSelectedPaymentMethod('cash-on-delivery')}
            />
            <label htmlFor="cash-on-delivery">
              <img src="/assets/images/cod.png" alt="Thanh toán khi nhận hàng" className="payment-icon" />
              Thanh toán khi nhận hàng
            </label>
          </div>
        </div>
      </div>

      <div className="section total-section">
        <div className="total-row">
          <span>Tổng tiền hàng</span>
          <span>{totalAmount.toLocaleString()}₫</span>
        </div>
        {selectedVoucher && isVoucherValid && (
          <div className="total-row">
            <span>Giảm giá ({selectedVoucher.code})</span>
            <span style={{ color: 'green' }}>-{discountAmount.toLocaleString()}₫</span>
          </div>
        )}
        {selectedVoucher && !isVoucherValid && (
          <div className="total-row">
            <span>Giảm giá ({selectedVoucher.code})</span>
            <span style={{ color: '#d32f2f' }}>Không áp dụng</span>
          </div>
        )}
        <div className="total-row">
          <span>Phí vận chuyển</span>
          <span>{shippingFee.toLocaleString()}₫</span>
        </div>
        <div className="total-row total-final">
          <strong>Tổng thanh toán</strong>
          <strong>{finalTotal.toLocaleString()}₫</strong>
        </div>
      </div>

      <div className="place-order-button">
        <button onClick={handlePlaceOrder} className="order-btn">
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

export default CheckoutSummary;