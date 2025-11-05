import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setCartItems, increaseQuantity, decreaseQuantity, removeFromCart, CartItem } from '../../store/cartSlice';
import { CartService } from '../../services/cartService';
import '../../styles/CartPage.css';
import DynamicBreadcrumbs from '../../components/Client/DynamicBreadcrumbs';
import { useAuth } from '../../contexts/AuthContext';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const { userId } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [loading, setLoading] = useState(false);

  // Lấy giỏ hàng
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const data = await CartService.getCart(userId);
        dispatch(setCartItems(data));
      } catch (err) {
        console.error('Lỗi khi tải giỏ hàng:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userId, dispatch]);

  // Tăng số lượng
  const handleIncrease = async (item: CartItem) => {
    if (!userId) return;
    const newQuantity = (item.quantity ?? 1) + 1;

    dispatch(increaseQuantity({ productId: item.productId, color: item.color, size: item.size }));
    try {
      await CartService.updateQuantity(userId, item.productId, newQuantity, item.color, item.size);
    } catch (err) {
      console.error('Lỗi khi tăng số lượng:', err);
      dispatch(decreaseQuantity({ productId: item.productId, color: item.color, size: item.size }));
    }
  };

  // Giảm số lượng
  const handleDecrease = async (item: CartItem) => {
    if (!userId) return;
    const currentQty = item.quantity ?? 1;
    if (currentQty <= 1) return;

    const newQuantity = currentQty - 1;
    dispatch(decreaseQuantity({ productId: item.productId, color: item.color, size: item.size }));
    try {
      await CartService.updateQuantity(userId, item.productId, newQuantity, item.color, item.size);
    } catch (err) {
      console.error('Lỗi khi giảm số lượng:', err);
      dispatch(increaseQuantity({ productId: item.productId, color: item.color, size: item.size }));
    }
  };

  // Xóa sản phẩm
  const handleRemove = async (item: CartItem) => {
    if (!userId) return;
    dispatch(removeFromCart({ productId: item.productId, color: item.color, size: item.size }));
    try {
      await CartService.removeItem(userId, item.productId, item.color, item.size);
    } catch (err) {
      console.error('Lỗi khi xóa sản phẩm:', err);
      const data = await CartService.getCart(userId);
      dispatch(setCartItems(data));
    }
  };

  if (loading) return <div className="loading">Đang tải giỏ hàng...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart" style={{ textAlign: 'center', padding: '60px 20px', color: '#555', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <img src="/assets/images/empty-cart.png" alt="Empty Cart" style={{ width: '220px', maxWidth: '90%', marginBottom: '20px', opacity: 0.85 }} />
        <p style={{ fontSize: '18px', marginBottom: '16px', color: '#666' }}>Hãy thêm sản phẩm để bắt đầu mua sắm!</p>
        <a href="/" style={{ display: 'inline-block', padding: '10px 24px', backgroundColor: '#000', color: '#fff', textDecoration: 'none', fontWeight: 500, borderRadius: '5px', transition: 'background-color 0.3s ease' }}
           onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.backgroundColor = '#333')}
           onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.backgroundColor = '#000')}>
          Tiếp tục mua sắm
        </a>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <DynamicBreadcrumbs />
      <div className="cart-content">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Thông tin sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={`${item.productId}-${item.color}-${item.size}`}>
                <td className="product-info">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <div className="product-name">{item.name}</div>
                    <div className="product-variant">{item.color} / {item.size}</div>
                    <button className="delete-btn" onClick={() => handleRemove(item)}>Xóa</button>
                  </div>
                </td>
                <td className="price">{(item.price ?? 0).toLocaleString()}₫</td>
                <td className="quantity">
                  <div className="quantity-controls">
                    <button onClick={() => handleDecrease(item)}>−</button>
                    <input type="text" readOnly value={item.quantity ?? 1} />
                    <button onClick={() => handleIncrease(item)}>+</button>
                  </div>
                </td>
                <td className="total-price">{((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}₫</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cart-summary">
          <div className="shipping-time">
            
          </div>

          <div className="checkout">
            <div className="total">
              Tổng tiền:{' '}
              <span className="total-amount">
                {cartItems.reduce((acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 1), 0).toLocaleString()}₫
              </span>
            </div>
            <button className="checkout-btn">Thanh toán</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
