import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { CartService } from "../services/cartService";

// -----------------------------
// 1️⃣ Kiểu dữ liệu
// -----------------------------
export interface CartItem {
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

// -----------------------------
// 2️⃣ Trạng thái khởi tạo
// -----------------------------
const initialState: CartState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
};

// -----------------------------
// 3️⃣ Async thunk: add sản phẩm lên server
// -----------------------------
export const addToCartServer = createAsyncThunk<
  CartItem,
  { userId: string; item: CartItem }
>(
  "cart/addToCartServer",
  async ({ userId, item }, { dispatch }) => {
    // Gửi lên server
    const savedItem = await CartService.addToCart(userId, item);

    // Cập nhật Redux + localStorage
    dispatch(addToCart(item));

    return savedItem;
  }
);

// -----------------------------
// 4️⃣ Async thunk: đồng bộ giỏ hàng khi login
// -----------------------------
export const syncCartAfterLogin = createAsyncThunk<CartItem[], string>(
  "cart/syncAfterLogin",
  async (userId, { dispatch }) => {
    const localCart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    // Merge localCart với server
    await CartService.syncCart(userId, localCart);

    // Lấy lại giỏ hàng từ server
    const serverCart = await CartService.getCart(userId);

    // Cập nhật state
    dispatch(setCartItems(serverCart));

    return serverCart;
  }
);

// -----------------------------
// 5️⃣ Slice: reducers
// -----------------------------
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const existing = state.items.find(
        (i) =>
          i.id === item.id && i.color === item.color && i.size === item.size
      );

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    increaseQuantity(
      state,
      action: PayloadAction<{ id: string; color: string; size: string }>
    ) {
      const { id, color, size } = action.payload;
      const item = state.items.find(
        (i) => i.id === id && i.color === color && i.size === size
      );
      if (item) item.quantity += 1;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    decreaseQuantity(
      state,
      action: PayloadAction<{ id: string; color: string; size: string }>
    ) {
      const { id, color, size } = action.payload;
      const item = state.items.find(
        (i) => i.id === id && i.color === color && i.size === size
      );
      if (item && item.quantity > 1) item.quantity -= 1;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart(
      state,
      action: PayloadAction<{ id: string; color: string; size: string }>
    ) {
      const { id, color, size } = action.payload;
      state.items = state.items.filter(
        (i) => !(i.id === id && i.color === color && i.size === size)
      );
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

// -----------------------------
// 6️⃣ Export actions + reducer
// -----------------------------
export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  setCartItems,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
