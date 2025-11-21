import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // We will add cartReducer here later
  },
});

// These types help TypeScript understand our specific store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;