import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CartService } from '../services/cartService';

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
  loading: boolean;
  error: string | null;
}

// Async action: fetch cart từ backend
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId: string) => {
    const items = await CartService.getCart(userId);
    return items; // CartItem[]
  }
);

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = state.items.find(
        i =>
          i.productId === action.payload.productId &&
          i.color === action.payload.color &&
          i.size === action.payload.size
      );
      if (item) {
        item.quantity = (item.quantity ?? 1) + (action.payload.quantity ?? 1);
      } else {
        state.items.push(action.payload);
      }
    },

    increaseQuantity: (state, action: PayloadAction<{ productId: string; color?: string; size?: string }>) => {
      const item = state.items.find(
        i =>
          i.productId === action.payload.productId &&
          i.color === action.payload.color &&
          i.size === action.payload.size
      );
      if (item) item.quantity = (item.quantity ?? 1) + 1;
    },

    decreaseQuantity: (state, action: PayloadAction<{ productId: string; color?: string; size?: string }>) => {
      const item = state.items.find(
        i =>
          i.productId === action.payload.productId &&
          i.color === action.payload.color &&
          i.size === action.payload.size
      );
      if (item && (item.quantity ?? 1) > 1) item.quantity!--;
    },

    removeFromCart: (state, action: PayloadAction<{ productId: string; color?: string; size?: string }>) => {
      state.items = state.items.filter(
        i =>
          !(
            i.productId === action.payload.productId &&
            i.color === action.payload.color &&
            i.size === action.payload.size
          )
      );
    },

    clearCart: (state) => {
      state.items = [];
    },

    // Đồng bộ giỏ hàng sau khi login
    syncCartAfterLogin: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi lấy giỏ hàng';
      });
  },
});

export const {
  setCartItems,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  syncCartAfterLogin,
} = cartSlice.actions;

export default cartSlice.reducer;
