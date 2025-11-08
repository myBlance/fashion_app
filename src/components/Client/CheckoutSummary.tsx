import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CheckoutSummary.css';

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
  onPlaceOrder?: () => void; // Bây giờ là tùy chọn
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ cartItems, totalAmount }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('shopeepay');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const navigate = useNavigate();

  // Giả lập phí vận chuyển
  const shippingFee = 16500;

  // Tính tổng tiền sau khi cộng phí vận chuyển
  const finalTotal = totalAmount + shippingFee;

  // Hàm xử lý khi nhấn nút "Đặt hàng"
  const handlePlaceOrder = () => {
    if (selectedPaymentMethod === 'shopeepay') {
      navigate('/payment/shopeepay');
    } else if (selectedPaymentMethod === 'credit-card') {
      navigate('/payment/credit-card');
    } else if (selectedPaymentMethod === 'google-pay') {
      navigate('/payment/google-pay');
    } else if (selectedPaymentMethod === 'cash-on-delivery') {
      navigate('/payment/cod');
    } else {
      alert('Phương thức thanh toán chưa được hỗ trợ');
    }
  };

  return (
    <div className="checkout-summary">
      {/* Địa chỉ nhận hàng */}
      <div className="section address-section">
        <div className="section-header">
          <span className="icon">📍</span>
          <h3>Địa Chỉ Nhận Hàng</h3>
          <button className="change-btn">Thay đổi</button>
        </div>
        <div className="address-info">
          <strong>Trần Long (+84) 776 467 128</strong>
          <p>Số 45, Ngõ 57 Mễ Trì, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội</p>
        </div>
      </div>

      {/* Sản phẩm */}
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
          <button className="choose-voucher">Chọn Voucher</button>
        </div>
      </div>

      {/* Phương thức vận chuyển */}
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

      {/* Phương thức thanh toán */}
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
              id="google-pay"
              name="payment"
              value="google-pay"
              checked={selectedPaymentMethod === 'google-pay'}
              onChange={() => setSelectedPaymentMethod('google-pay')}
            />
            <label htmlFor="google-pay">
              <img src="/assets/images/google-pay.png" alt="SeePay" className="payment-icon" />
              SeePay
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

      {/* Tổng kết */}
      <div className="section total-section">
        <div className="total-row">
          <span>Tổng tiền hàng</span>
          <span>{totalAmount.toLocaleString()}₫</span>
        </div>
        <div className="total-row">
          <span>Phí vận chuyển</span>
          <span>{shippingFee.toLocaleString()}₫</span>
        </div>
        <div className="total-row total-final">
          <strong>Tổng thanh toán</strong>
          <strong>{finalTotal.toLocaleString()}₫</strong>
        </div>
      </div>

      {/* Nút đặt hàng */}
      <div className="place-order-button">
        <button onClick={handlePlaceOrder} className="order-btn">
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

export default CheckoutSummary;