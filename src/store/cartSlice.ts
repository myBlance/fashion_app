import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
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
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const existing = state.items.find(
        (i) =>
          i.id === item.id &&
          i.color === item.color &&
          i.size === item.size
      );
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },
    increaseQuantity(state, action: PayloadAction<{id: string; color: string; size: string;}>) {
      const { id, color, size } = action.payload;
      const item = state.items.find(
        i => i.id === id && i.color === color && i.size === size
      );
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity(state, action: PayloadAction<{id: string; color: string; size: string;}>) {
      const { id, color, size } = action.payload;
      const item = state.items.find(
        i => i.id === id && i.color === color && i.size === size
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    removeFromCart(state, action: PayloadAction<{id: string; color: string; size: string;}>) {
      const { id, color, size } = action.payload;
      state.items = state.items.filter(
        i => !(i.id === id && i.color === color && i.size === size)
      );
    }
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
