import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';

// Tạo store
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    // thêm các reducer khác ở đây
  },
  // tùy chọn thêm nếu muốn debug Redux devtools
  devTools: import.meta.env.MODE !== 'production',
});

// Typescript types
export type RootState = ReturnType<typeof store.getState>; // Kiểu state toàn cục
export type AppDispatch = typeof store.dispatch; // Kiểu dispatch
