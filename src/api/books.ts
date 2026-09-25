import apiClient from './client';
import { Book, BooksFilter, PaginatedResponse } from '../types';

export const booksApi = {
  getAll: async (filters?: BooksFilter): Promise<PaginatedResponse<Book>> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.min_price) params.append('min_price', String(filters.min_price));
    if (filters?.max_price) params.append('max_price', String(filters.max_price));
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.per_page) params.append('per_page', String(filters.per_page));

    const { data } = await apiClient.get(`/books?${params.toString()}`);
    return data;
  },

  getFeatured: async (): Promise<Book[]> => {
    const { data } = await apiClient.get('/books/featured');
    return data;
  },

  getBySlug: async (slug: string): Promise<Book> => {
    const { data } = await apiClient.get(`/books/slug/${slug}`);
    return data;
  },

  getById: async (id: string): Promise<Book> => {
    const { data } = await apiClient.get(`/books/${id}`);
    return data;
  },

  getNewest: async (limit = 8): Promise<Book[]> => {
    const { data } = await apiClient.get(`/books/newest?limit=${limit}`);
    return data;
  },
};
