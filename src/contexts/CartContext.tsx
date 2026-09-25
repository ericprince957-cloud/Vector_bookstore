import React, { createContext, useContext, useState, useCallback } from 'react';
import { Book, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  isInCart: (bookId: string) => boolean;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const addToCart = useCallback((book: Book) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.book.id === book.id);
      const newItems = exists ? prev : [...prev, { book, quantity: 1 }];
      localStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const removeFromCart = useCallback((bookId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.book.id !== bookId);
      localStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, []);

  const isInCart = useCallback((bookId: string) => {
    return items.some((item) => item.book.id === bookId);
  }, [items]);

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isInCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
