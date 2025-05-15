import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';
import '../../styles/CartPage.css';

const CartPage: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  if (cartItems.length === 0) {
    return <div>Giỏ hàng của bạn đang trống.</div>;
  }

  return (
    <div className="cart-container">
      <div className="breadcrumb">
        Trang chủ &gt; <span className="active">Giỏ hàng</span>
      </div>

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
            {cartItems.map((item, idx) => (
              <tr key={idx}>
                <td className="product-info">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <div className="product-name">{item.name}</div>
                    <div className="product-variant">{item.color} / {item.size}</div>
                    <button className="delete-btn">Xóa</button>
                  </div>
                </td>
                <td className="price">{item.price.toLocaleString()}₫</td>
                <td className="quantity">
                  <button className="btn-qty">-</button>
                  <span>{item.quantity}</span>
                  <button className="btn-qty">+</button>
                </td>
                <td className="total-price">{(item.price * item.quantity).toLocaleString()}₫</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cart-summary">
          <div className="shipping-time">
            <label>Thời gian giao hàng</label>
            <input type="date" />
            <select>
              <option>Chọn thời gian</option>
              <option>Sáng</option>
              <option>Chiều</option>
              <option>Tối</option>
            </select>
            <div>
              <input type="checkbox" id="invoice" />
              <label htmlFor="invoice">Xuất hóa đơn công ty</label>
            </div>
          </div>

          <div className="checkout">
            <div className="total">
              Tổng tiền: <span className="total-amount">{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString()}₫</span>
            </div>
            <button className="checkout-btn">Thanh toán</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
