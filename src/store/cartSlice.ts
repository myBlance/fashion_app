import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id?: string;
  productId: string;
  name: string;
  color?: string;
  size?: string;
  price?: number;
  quantity?: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Gán lại toàn bộ giỏ hàng
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    // Thêm sản phẩm vào giỏ (nếu trùng productId+color+size thì cộng số lượng)
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = state.items.find(
        i => i.productId === action.payload.productId &&
             i.color === action.payload.color &&
             i.size === action.payload.size
      );
      if (item) {
        item.quantity = (item.quantity ?? 1) + (action.payload.quantity ?? 1);
      } else {
        state.items.push(action.payload);
      }
    },

    // Tăng số lượng
    increaseQuantity: (state, action: PayloadAction<{ productId: string; color?: string; size?: string }>) => {
      const item = state.items.find(
        i => i.productId === action.payload.productId &&
             i.color === action.payload.color &&
             i.size === action.payload.size
      );
      if (item) item.quantity = (item.quantity ?? 1) + 1;
    },

    // Giảm số lượng
    decreaseQuantity: (state, action: PayloadAction<{ productId: string; color?: string; size?: string }>) => {
      const item = state.items.find(
        i => i.productId === action.payload.productId &&
             i.color === action.payload.color &&
             i.size === action.payload.size
      );
      if (item && (item.quantity ?? 1) > 1) item.quantity!--;
    },

    // Xóa sản phẩm khỏi giỏ
    removeFromCart: (state, action: PayloadAction<{ productId: string; color?: string; size?: string }>) => {
      state.items = state.items.filter(
        i => !(i.productId === action.payload.productId &&
               i.color === action.payload.color &&
               i.size === action.payload.size)
      );
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: (state) => {
      state.items = [];
    },

    // Đồng bộ giỏ hàng sau khi login (merge items cũ + mới)
    syncCartAfterLogin: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  setCartItems,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  syncCartAfterLogin
} = cartSlice.actions;

export default cartSlice.reducer;
