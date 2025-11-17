import React from 'react';
import CheckoutSummary from '../../components/Client/CheckoutSummary';
import { useLocation } from 'react-router-dom';

// Định nghĩa kiểu cho item
type CartItem = {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
};

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const { selectedCartItems } = location.state || {};

  // Kiểm tra nếu không có item được truyền
  if (!selectedCartItems || selectedCartItems.length === 0) {
    return (
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2>Không có sản phẩm nào được chọn để thanh toán.</h2>
        <p>Vui lòng quay lại giỏ hàng để chọn sản phẩm.</p>
        <a href="/cart" style={{ color: '#000', textDecoration: 'underline' }}>Quay lại giỏ hàng</a>
      </div>
    );
  }

  // Lọc hoặc ánh xạ để đảm bảo image không undefined
  const processedCartItems = selectedCartItems.map((item: CartItem) => ({
    ...item,
    image: item.image || '/assets/images/placeholder.png', // ảnh mặc định nếu không có
  })) as Array<{
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
  }>;

  const totalAmount = processedCartItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Thanh Toán</h2>
      <CheckoutSummary
        cartItems={processedCartItems}
        totalAmount={totalAmount}
        // Nếu bạn vẫn muốn giữ onPlaceOrder, có thể truyền vào
        // onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
};

export default CheckoutPage;