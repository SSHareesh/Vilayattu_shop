import api from './axios';
import { Product } from '../types';

export const productService = {
  // Fetch all products (can accept query params like category, sortBy)
  getAllProducts: async (category?: string) => {
    const params = category ? { category } : {};
    const response = await api.get<Product[]>('/products', { params });
    return response.data;
  },

  // Fetch a single product by ID
  getProductById: async (id: string) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await api.get<Product[]>('/products');
    
    return response.data.slice(0, 4);
  }
};