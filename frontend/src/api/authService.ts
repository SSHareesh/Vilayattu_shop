import api from './axios';
import { User } from '../types';

// Define the response shape for auth calls
interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  // Register a new user
  register: async (userData: any) => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  // Login existing user
  login: async (credentials: any) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }
};