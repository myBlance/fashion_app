import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WishlistService } from '../services/wishlistService';
import { clearLocalWishlist, getLocalWishlist, saveLocalWishlist } from '../utils/wishlistStorage';

// Async action: fetch wishlist từ backend
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (userId: string) => {
    const wishlist = await WishlistService.getWishlist(userId);
    return wishlist; // danh sách productId
  }
);

interface WishlistState {
  items: string[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Load guest wishlist from localStorage
    loadGuestWishlist: (state) => {
      const localWishlist = getLocalWishlist();
      state.items = localWishlist;
    },

    toggleWishlist: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.items.includes(id)) {
        state.items = state.items.filter((itemId) => itemId !== id);
      } else {
        state.items.push(id);
      }
      saveLocalWishlist(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      clearLocalWishlist();
    },

    // Sync wishlist after login
    syncWishlistAfterLogin: (state, action: PayloadAction<string[]>) => {
      state.items = action.payload;
      clearLocalWishlist();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi lấy wishlist';
      });
  },
});

export const { loadGuestWishlist, toggleWishlist, clearWishlist, syncWishlistAfterLogin } = wishlistSlice.actions;
export default wishlistSlice.reducer;
