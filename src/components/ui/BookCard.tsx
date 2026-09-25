import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, Eye } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(book.id);
  const hasDiscount = book.original_price && book.original_price > book.price;
  const discountPercent = hasDiscount
    ? Math.round(((book.original_price! - book.price) / book.original_price!) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Cover */}
      <Link to={`/books/${book.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={book.cover_url || 'https://via.placeholder.com/300x400?text=Book+Cover'}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
            -{discountPercent}%
          </span>
        )}
        {book.featured && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-emerald-700 text-white text-xs font-semibold rounded">
            Featured
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        {book.category && (
          <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
            {book.category.name}
          </span>
        )}
        <Link to={`/books/${book.slug}`}>
          <h3 className="mt-1 text-base font-semibold text-gray-900 line-clamp-2 hover:text-emerald-700 transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{book.short_description}</p>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(book.price)}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(book.original_price!)}</span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Link
            to={`/books/${book.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </Link>
          <button
            onClick={() => !inCart && addToCart(book)}
            disabled={inCart}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              inCart
                ? 'bg-gray-100 text-gray-500 cursor-default'
                : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {inCart ? 'In Cart' : 'Buy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
