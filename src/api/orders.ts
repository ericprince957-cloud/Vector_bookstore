import apiClient from './client';
import { Order } from '../types';

export const ordersApi = {
  create: async (bookIds: string[], email?: string): Promise<Order> => {
    const { data } = await apiClient.post('/orders', { book_ids: bookIds, guest_email: email });
    return data;
  },

  initializePayment: async (orderId: string, email: string): Promise<{ authorization_url: string; reference: string }> => {
    const { data } = await apiClient.post(`/orders/${orderId}/pay`, { email });
    return data;
  },

  verifyPayment: async (reference: string): Promise<Order> => {
    const { data } = await apiClient.get(`/orders/verify/${reference}`);
    return data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const { data } = await apiClient.get('/orders/my-orders');
    return data;
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const { data } = await apiClient.get(`/orders/${orderId}`);
    return data;
  },

  getDownloadUrl: async (orderId: string, bookId: string): Promise<{ download_url: string; expires_at: string }> => {
    const { data } = await apiClient.get(`/orders/${orderId}/download/${bookId}`);
    return data;
  },
};
