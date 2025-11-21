// Defines the shape of a User object returned from the backend
export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
}

// Defines the shape of the Auth state in Redux
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Defines a Product (matching your Database Schema)
export interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number; // We receive decimals as strings or numbers depending on driver, usually number in JSON
  stock_quantity: number;
  category_id: number;
  category_name?: string; // Joined from backend
  image_url: string;
}

// Defines a Cart Item
export interface CartItem {
  cart_item_id: number;
  product_id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}