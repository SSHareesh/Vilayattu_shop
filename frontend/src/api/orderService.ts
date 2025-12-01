import api from './axios';

export const orderService = {
    createOrder: async (shippingAddressId: number) => {
        const response = await api.post<{ orderId: Number, message: string}> 
        ('/orders',{ shippingAddressId});
        return response.data;
    },
};