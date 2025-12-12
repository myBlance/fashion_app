import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast } from '../../../contexts/ToastContext';
import { Address } from '../../../types/Address';
import { Voucher } from '../../../types/Voucher';

// Sub-components
import AddressSection from './Summary/AddressSection';
import OrderTotalSection from './Summary/OrderTotalSection';
import PaymentSection from './Summary/PaymentSection';
import ProductSection from './Summary/ProductSection';
import ShippingSection from './Summary/ShippingSection';
import VoucherSection from './Summary/VoucherSection';

import '../../../styles/CheckoutSummary.css';

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
  // 1. Hooks & State
  const navigate = useNavigate();
  const { showToast } = useToast();
  const token = localStorage.getItem('token');

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('shopeepay');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // 2. Effects
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
  }, [token]);

  // 3. Derived State & Calculations
  const shippingFee = shippingMethod === 'express' ? 30000 : 16500;

  const isVoucherValid = !!selectedVoucher && totalAmount >= (selectedVoucher.minOrderValue || 0);

  const calculateDiscount = () => {
    if (!selectedVoucher || !isVoucherValid) return 0;

    if (selectedVoucher.type === 'fixed') {
      return Math.min(selectedVoucher.value || 0, totalAmount);
    }

    if (selectedVoucher.type === 'percentage') {
      const percentage = selectedVoucher.value || 0;
      const discount = (totalAmount * percentage) / 100;
      return Math.min(discount, totalAmount);
    }

    return 0;
  };

  const discountAmount = calculateDiscount();
  const finalTotal = totalAmount - discountAmount + shippingFee;

  // 4. Handlers
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showToast('Vui lòng nhập địa chỉ giao hàng', 'warning');
      return;
    }

    if (selectedVoucher && !isVoucherValid) {
      showToast(`Voucher ${selectedVoucher.code} không đủ điều kiện áp dụng (cần đơn tối thiểu ${(selectedVoucher.minOrderValue || 0).toLocaleString()}đ).`, 'warning');
      return;
    }

    setIsPlacingOrder(true);

    let userId = null;
    if (token) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        userId = res.data.data._id;
      } catch (err) {
        console.error('Lỗi khi lấy thông tin người dùng:', err);
        showToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'error');
        setIsPlacingOrder(false);
        navigate('/login');
        return;
      }
    }

    if (!userId) {
      showToast('Vui lòng đăng nhập để đặt hàng.', 'warning');
      setIsPlacingOrder(false);
      navigate('/login');
      return;
    }

    // Prepare order data for navigation
    const orderData = {
      state: {
        cartItems,
        totalAmount,
        shippingFee,
        discountAmount,
        selectedAddress,
        userId,
      },
    };

    if (selectedPaymentMethod === 'shopeepay') {
      navigate('/payment/shopeepay');
    } else if (selectedPaymentMethod === 'seepay') {
      navigate('/payment/seepay', orderData);
    } else if (selectedPaymentMethod === 'cash-on-delivery') {
      navigate('/payment/cod', orderData);
    } else {
      showToast('Phương thức thanh toán chưa được hỗ trợ', 'info');
      setIsPlacingOrder(false);
    }
  };

  // 5. Render
  return (
    <div className="checkout-summary">
      <AddressSection
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={setSelectedAddress}
      />

      <ProductSection cartItems={cartItems} />

      <VoucherSection
        selectedVoucher={selectedVoucher}
        onSelectVoucher={setSelectedVoucher}
        isVoucherValid={isVoucherValid}
      />

      <ShippingSection
        shippingMethod={shippingMethod}
        setShippingMethod={setShippingMethod}
      />

      <PaymentSection
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
      />

      <OrderTotalSection
        totalAmount={totalAmount}
        shippingFee={shippingFee}
        finalTotal={finalTotal}
        selectedVoucher={selectedVoucher}
        isVoucherValid={isVoucherValid}
        discountAmount={discountAmount}
      />

      <div className="place-order-button">
        <button
          onClick={handlePlaceOrder}
          className="order-btn"
          disabled={isPlacingOrder}
          style={{
            opacity: isPlacingOrder ? 0.7 : 1,
            cursor: isPlacingOrder ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          {isPlacingOrder && <CircularProgress size={20} color="inherit" />}
          {isPlacingOrder ? 'Đang xử lý...' : 'Đặt hàng'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutSummary;