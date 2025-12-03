import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem } from '../../types';
import { cartService } from '../../api/cartService';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getCart();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: number; quantity: number }, { rejectWithValue }) => {
    try {
      return await cartService.addToCart(productId, quantity);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartItemId, quantity }: { cartItemId: number; quantity: number }, { rejectWithValue }) => {
    try {
      return await cartService.updateQuantity(cartItemId, quantity);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (cartItemId: number, { rejectWithValue }) => {
    try {
      return await cartService.removeFromCart(cartItemId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder.addCase(fetchCart.pending, (state) => { state.loading = true; });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add to Cart
    builder.addCase(addToCart.fulfilled, (state, action) => {
      // Logic: If user is on Product page, we simply increment the badge count.
      // If they go to Cart page later, fetchCart() will get full details.
      // We check if item already exists to update quantity locally if possible.
      const existingItem = state.items.find(item => item.product_id === action.payload.product_id);
      if (existingItem) {
        existingItem.quantity = action.payload.quantity;
      } else {
        // Warning: This payload lacks 'name' and 'price' because backend returns raw link table.
        // Ideally, we fetchCart() after adding, but for speed, we push.
        // Navbar only needs length, so this is fine for the badge update.
        state.items.push(action.payload);
      }
    });

    // Update Quantity - FIXED
    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      const index = state.items.findIndex(item => item.cart_item_id === action.payload.cart_item_id);
      if (index !== -1) {
        // FIX: Only update the quantity. Do NOT overwrite the whole object.
        // This preserves the 'price', 'name', and 'image_url' already in state.
        state.items[index].quantity = action.payload.quantity;
      }
    });

    // Remove Item
    builder.addCase(removeCartItem.fulfilled, (state, action) => {
      state.items = state.items.filter(item => item.cart_item_id !== action.payload);
    });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;