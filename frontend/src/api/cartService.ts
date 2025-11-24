import api from './axios';
import { CartItem } from '../types';

export const cartService = {
  // Get user's cart
  getCart: async () => {
    const response = await api.get<CartItem[]>('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId: number, quantity: number) => {
    const response = await api.post<CartItem>('/cart', { productId, quantity });
    return response.data;
  },

  // Update item quantity
  updateQuantity: async (cartItemId: number, quantity: number) => {
    const response = await api.put<CartItem>(`/cart/${cartItemId}`, { quantity });
    return response.data;
  },

  // Remove item
  removeFromCart: async (cartItemId: number) => {
    await api.delete(`/cart/${cartItemId}`);
    return cartItemId; // Return ID to remove from local state
  }
};