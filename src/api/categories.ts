import apiClient from './client';
import { Category } from '../types';

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await apiClient.get('/categories');
    return data;
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const { data } = await apiClient.get(`/categories/${slug}`);
    return data;
  },
};
