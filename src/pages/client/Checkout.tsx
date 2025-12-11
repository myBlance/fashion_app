import React from 'react';
import { useLocation } from 'react-router-dom';
import CheckoutSummary from '../../components/Client/Checkout/CheckoutSummary';
import '../../styles/Checkout.css';

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
  const { selectedCartItems, buyNowItem, isBuyNow } = location.state || {};

  // Xử lý cho cả 2 trường hợp: checkout từ cart và buy now
  let cartItems: CartItem[] = [];

  if (isBuyNow && buyNowItem) {
    // Buy now mode: chỉ có 1 sản phẩm
    cartItems = [buyNowItem];
  } else if (selectedCartItems && selectedCartItems.length > 0) {
    // Checkout from cart mode: nhiều sản phẩm
    cartItems = selectedCartItems;
  }

  // Kiểm tra nếu không có item nào
  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Không có sản phẩm nào để thanh toán.</h2>
        <p>Vui lòng quay lại trang sản phẩm hoặc giỏ hàng.</p>
        <a href="/cart" className="checkout-back-link">Quay lại giỏ hàng</a>
      </div>
    );
  }

  // Lọc hoặc ánh xạ để đảm bảo image không undefined
  const processedCartItems = cartItems.map((item: CartItem) => ({
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
    <div className="checkout-page-container">
      <h2>Thanh Toán {isBuyNow && '(Mua Ngay)'}</h2>
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