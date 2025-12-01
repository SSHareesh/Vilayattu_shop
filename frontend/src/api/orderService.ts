import api from './axios';

export interface Order {
  order_id: number;
  total_amount: string;
  status: string;
  order_date: string;
  // We can add items later if we build a specific Order Detail view
}

export const orderService = {
  createOrder: async (shippingAddressId: number) => {
    const response = await api.post<{ orderId: number, message: string }>('/orders', { 
      shippingAddressId 
    });
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },
  
  getOrderById: async (id: number) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }
};