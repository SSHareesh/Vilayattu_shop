import api from './axios';

export interface Address {
  address_id: number;
  user_id: number;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: string;
}

export const addressService = {
  // Get user addresses
  getMyAddresses: async () => {
    // Note: You need to implement GET /api/addresses in backend if not exists
    // For now, let's assume it exists or return mock data if backend isn't ready
    try {
      const response = await api.get<Address[]>('/addresses');
      return response.data;
    } catch (e) {
      console.warn("Address API not ready, using mock", e);
      return []; 
    }
  },

  // Add new address
  addAddress: async (address: Omit<Address, 'address_id' | 'user_id'>) => {
    const response = await api.post<Address>('/addresses', address);
    return response.data;
  }
};