export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  short_description: string;
  cover_url: string;
  price: number;
  original_price?: number;
  category_id: string;
  category?: Category;
  featured: boolean;
  published: boolean;
  what_you_learn?: string[];
  table_of_contents?: string[];
  file_type?: string;
  file_size?: number;
  pages?: number;
  tags?: string[];
  preview_file?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  book_count?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  guest_email?: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  total_amount: number;
  items: OrderItem[];
  payment_reference?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  book_id: string;
  book?: Book;
  price: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface BooksFilter {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'title_asc' | 'title_desc';
  page?: number;
  per_page?: number;
}
