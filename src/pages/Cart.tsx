import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/common/SEOHead';

const Cart: React.FC = () => {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout');
  };

  return (
    <>
      <SEOHead title="Cart — BookVault" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">Browse our collection and add some books.</p>
            <Link
              to="/books"
              className="mt-6 inline-flex px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.book.id} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl">
                <img
                  src={item.book.cover_url || 'https://via.placeholder.com/80x100?text=Book'}
                  alt={item.book.title}
                  className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/books/${item.book.slug}`} className="font-medium text-gray-900 hover:text-emerald-700">
                    {item.book.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-0.5">{item.book.author}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{formatPrice(item.book.price)}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.book.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {/* Summary */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total</span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={clearCart}
                  className="px-4 py-3 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-100"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
              {!isAuthenticated && (
                <p className="mt-3 text-sm text-gray-500 text-center">
                  You can checkout as a guest or{' '}
                  <Link to="/login" className="text-emerald-700 font-medium">sign in</Link>
                  {' '}to save your library.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
