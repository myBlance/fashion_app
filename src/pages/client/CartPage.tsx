import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/index';
import { increaseQuantity, decreaseQuantity, removeFromCart } from '../../store/cartSlice';
import '../../styles/CartPage.css';
import DynamicBreadcrumbs from '../../components/Client/DynamicBreadcrumbs';

const CartPage: React.FC = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    if (cartItems.length === 0) {
        return (
            <div
                className="empty-cart"
                style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#555',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                }}
            >
                <img
                    src="/assets/images/empty-cart.png"
                    alt="Empty Cart"
                    style={{
                    width: '220px',
                    maxWidth: '90%',
                    marginBottom: '20px',
                    opacity: 0.85,
                    }}
                />
                <p
                    style={{
                    fontSize: '18px',
                    marginBottom: '16px',
                    color: '#666',
                    }}
                >
                    Hãy thêm sản phẩm để bắt đầu mua sắm!
                </p>
                <a
                    href="/"
                    style={{
                        display: 'inline-block',
                        padding: '10px 24px',
                        backgroundColor: '#000',
                        color: '#fff',
                        textDecoration: 'none',
                        fontWeight: 500,
                        borderRadius: '5px',
                        transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) =>
                        ((e.target as HTMLAnchorElement).style.backgroundColor = '#333')
                    }
                    onMouseLeave={(e) =>
                        ((e.target as HTMLAnchorElement).style.backgroundColor = '#000')
                    }
                >
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
                            <tr key={item.id}>
                                <td className="product-info">
                                    <img src={item.image} alt={item.name} />
                                    <div>
                                        <div className="product-name">{item.name}</div>
                                        <div className="product-variant">{item.color} / {item.size}</div>
                                        <button className="delete-btn" 
                                            onClick={() => dispatch(removeFromCart({
                                                id: item.id,
                                                color: item.color,
                                                size: item.size
                                            }))}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                                <td className="price">{item.price.toLocaleString()}₫</td>
                                <td className="quantity">
                                    <div className="quantity-controls">
                                        <button 
                                            onClick={() => dispatch(decreaseQuantity({
                                                id: item.id,
                                                color: item.color,
                                                size: item.size
                                            }))}
                                        >
                                            −
                                        </button>

                                        <input type="text" readOnly value={item.quantity} />

                                        <button
                                            onClick={() => dispatch(increaseQuantity({
                                                id: item.id,
                                                color: item.color,
                                                size: item.size
                                        }))}
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="total-price">{(item.price * item.quantity).toLocaleString()}₫</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="cart-summary">
                    <div className="shipping-time">
                        <label>Thời gian giao hàng</label>
                        <input type="date" placeholder='Chọn ngày' />
                        <select>
                            <option>Chọn thời gian</option>
                            <option>08h00 - 12h00</option>
                            <option>14h00 - 18h00</option>
                            <option>19h00 - 21h00</option>
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
