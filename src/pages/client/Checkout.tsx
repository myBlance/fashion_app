import React from 'react';
import CheckoutSummary from '../../components/Client/CheckoutSummary';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


const CheckoutPage: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Lọc hoặc ánh xạ để đảm bảo image không undefined
  const processedCartItems = cartItems.map(item => ({
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

  const handlePlaceOrder = () => {
    alert('Đặt hàng thành công!');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Thanh Toán</h2>
      <CheckoutSummary
        cartItems={processedCartItems}
        totalAmount={totalAmount}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
};

export default CheckoutPage;