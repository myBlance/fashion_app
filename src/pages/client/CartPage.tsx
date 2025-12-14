import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EditCartItemDialog from '../../components/Client/Cart/EditCartItemDialog';
import PageHeader from '../../components/Client/Common/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { CartService } from '../../services/cartService';
import { RootState } from '../../store';
import { decreaseQuantity, increaseQuantity, loadGuestCart, removeFromCart, setCartItems } from '../../store/cartSlice';
import '../../styles/CartPage.css';
import { CartItem } from '../../types/CartItem';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const { userId } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const { showToast } = useToast();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (userId) {
        // If user is logged in, fetch from backend
        setLoading(true);
        try {
          const data = await CartService.getCart(userId);
          dispatch(setCartItems(data));
        } catch (err) {
          console.error('Lỗi khi tải giỏ hàng:', err);
        } finally {
          setLoading(false);
        }
      } else {
        // If user is not logged in, load from localStorage
        dispatch(loadGuestCart());
      }
    };
    fetchCart();
  }, [userId, dispatch]);

  const handleIncrease = async (item: CartItem) => {
    const currentQty = item.quantity ?? 1;
    const maxStock = item.stock ?? 9999;

    if (currentQty >= maxStock) {
      showToast(`Chỉ còn ${maxStock} sản phẩm trong kho!`, 'warning');
      return;
    }

    const newQuantity = currentQty + 1;
    dispatch(increaseQuantity({ productId: item.productId, color: item.color, size: item.size }));

    // Only sync to backend if user is logged in
    if (userId) {
      try {
        await CartService.updateQuantity(item.productId, userId, newQuantity, item.color, item.size);
      } catch (err) {
        dispatch(decreaseQuantity({ productId: item.productId, color: item.color, size: item.size }));
      }
    }
  };

  const handleDecrease = async (item: CartItem) => {
    const currentQty = item.quantity ?? 1;
    if (currentQty <= 1) return;
    const newQuantity = currentQty - 1;
    dispatch(decreaseQuantity({ productId: item.productId, color: item.color, size: item.size }));

    // Only sync to backend if user is logged in
    if (userId) {
      try {
        await CartService.updateQuantity(item.productId, userId, newQuantity, item.color, item.size);
      } catch (err) {
        dispatch(increaseQuantity({ productId: item.productId, color: item.color, size: item.size }));
      }
    }
  };

  const handleRemove = (item: CartItem) => {
    setItemToDelete(item);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    dispatch(removeFromCart({ productId: itemToDelete.productId, color: itemToDelete.color, size: itemToDelete.size }));

    // Only sync to backend if user is logged in
    if (userId) {
      try {
        await CartService.removeItem(itemToDelete.productId, userId, itemToDelete.color, itemToDelete.size);
      } catch (err) {
        const data = await CartService.getCart(userId);
        dispatch(setCartItems(data));
      }
    }
    setOpenDeleteDialog(false);
    setItemToDelete(null);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setItemToDelete(null);
  };

  // Edit Variant Logic
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const handleUpdateVariant = async (oldColor: string, oldSize: string, newColor: string, newSize: string) => {
    if (!userId || !editingItem) return;

    try {
      const updatedCart = await CartService.updateVariant(
        userId,
        editingItem.productId,
        oldColor,
        oldSize,
        newColor,
        newSize
      );
      dispatch(setCartItems(updatedCart));
      showToast('Cập nhật phân loại thành công', 'success');
    } catch (error) {
      console.error(error);
      showToast('Lỗi khi cập nhật phân loại', 'error');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Giỏ hàng trống!', 'warning');
      return;
    }
    const selectedCartItems = cartItems.filter(item => {
      const id = `${item.productId}-${item.color}-${item.size}`;
      return selectedItems[id] ?? false;
    });

    if (selectedCartItems.length === 0) {
      showToast('Vui lòng chọn sản phẩm để thanh toán.', 'warning');
      return;
    }
    navigate('/checkout', { state: { selectedCartItems } });
  };

  const totalSelectedAmount = cartItems.reduce((acc, item) => {
    const id = `${item.productId}-${item.color}-${item.size}`;
    if (selectedItems[id]) {
      return acc + (item.price ?? 0) * (item.quantity ?? 1);
    }
    return acc;
  }, 0);

  if (loading) return <div className="cart-loading"><div className="spinner"></div>Đang tải giỏ hàng...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-wrapper" >
        <div className="cart-container">
          <PageHeader title="Giỏ hàng (0)" />
          <div className="empty-cart-container">
            <img src="/assets/images/empty-cart.png" alt="Empty Cart" />
            <p>Giỏ hàng của bạn đang trống</p>
            <a href="/" className="continue-shopping-btn">Tiếp tục mua sắm</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <div className="cart-container">
        <PageHeader title={`Giỏ hàng (${cartItems.length})`} />

        <div className="cart-layout">
          {/* Cột trái: Danh sách sản phẩm */}
          <div className="cart-list-section">
            <table className="cart-table">
              <thead>
                <tr>
                  <th className="col-checkbox">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={cartItems.length > 0 && cartItems.every(item =>
                        selectedItems[`${item.productId}-${item.color}-${item.size}`]
                      )}
                      onChange={(e) => {
                        const newSelected: Record<string, boolean> = {};
                        cartItems.forEach(item => {
                          newSelected[`${item.productId}-${item.color}-${item.size}`] = e.target.checked;
                        });
                        setSelectedItems(newSelected);
                      }}
                    />
                  </th>
                  <th className="col-product">Sản phẩm</th>
                  <th className="col-price">Đơn giá</th>
                  <th className="col-quantity">Số lượng</th>
                  <th className="col-total">Thành tiền</th>
                  <th className="col-action"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const itemId = `${item.productId}-${item.color}-${item.size}`;
                  const isChecked = selectedItems[itemId] ?? false;

                  return (
                    <tr key={itemId} className={isChecked ? "row-selected" : ""}>
                      <td className="col-checkbox" data-label="Chọn">
                        <input
                          type="checkbox"
                          className="custom-checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            setSelectedItems(prev => ({ ...prev, [itemId]: e.target.checked }));
                          }}
                        />
                      </td>

                      <td className="col-product" data-label="Sản phẩm">
                        <div className="product-item">
                          <img src={item.image} alt={item.name} />
                          <div className="product-details">
                            <div className="product-name">{item.name}</div>
                            <div className="product-variant">
                              <span>Màu: {item.color}</span>
                              <span>Size: {item.size}</span>
                              {item.stock !== undefined && (
                                <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                                  (Kho: {item.stock})
                                </span>
                              )}
                              <button
                                className="edit-variant-btn"
                                style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }}
                                onClick={() => {
                                  setEditingItem(item);
                                }}
                                title="Đổi màu/size"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="col-price" data-label="Đơn giá">
                        {(item.price ?? 0).toLocaleString()}₫
                      </td>

                      <td className="col-quantity" data-label="Số lượng">
                        <div className="quantity-box">
                          <button onClick={() => handleDecrease(item)} disabled={(item.quantity ?? 1) <= 1}>-</button>
                          <input type="text" readOnly value={item.quantity ?? 1} />
                          <button
                            onClick={() => handleIncrease(item)}
                            disabled={(item.quantity ?? 1) >= (item.stock ?? 9999)}
                            style={{ opacity: (item.quantity ?? 1) >= (item.stock ?? 9999) ? 0.5 : 1 }}
                          >+</button>
                        </div>
                      </td>

                      <td className="col-total" data-label="Thành tiền">
                        {((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}₫
                      </td>

                      <td className="col-action">
                        <button className="remove-btn" onClick={() => handleRemove(item)} title="Xóa sản phẩm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cột phải: Tổng tiền */}
          <div className="cart-summary-section">
            <div className="summary-card">
              <h3>Thanh toán</h3>
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{totalSelectedAmount.toLocaleString()}₫</span>
              </div>
              <div className="summary-row total">
                <span>Tổng cộng:</span>
                <span className="total-price-final">{totalSelectedAmount.toLocaleString()}₫</span>
              </div>
              <p className="vat-note">(Đã bao gồm VAT nếu có)</p>
              <button className="checkout-btn" onClick={handleCheckout}>
                Tiến hành đặt hàng
              </button>
            </div>
          </div>

        </div>
      </div>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận xóa sản phẩm"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa sản phẩm <strong>{itemToDelete?.name}</strong> khỏi giỏ hàng không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <EditCartItemDialog
        open={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleUpdateVariant}
      />
    </div>
  );
};

export default CartPage;