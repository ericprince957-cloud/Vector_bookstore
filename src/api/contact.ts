import apiClient from './client';
import { ContactMessage } from '../types';

export const contactApi = {
  submit: async (message: ContactMessage): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/contact', message);
    return data;
  },
};
