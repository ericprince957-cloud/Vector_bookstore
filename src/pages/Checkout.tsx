import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersApi } from '../api/orders';
import { booksApi } from '../api/books';
import { Book } from '../types';
import SEOHead from '../components/common/SEOHead';

const Checkout: React.FC = () => {
  const { items, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(user?.email || '');
  const [singleBook, setSingleBook] = useState<Book | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const singleBookId = searchParams.get('book');

  useEffect(() => {
    if (singleBookId) {
      booksApi.getById(singleBookId).then(setSingleBook).catch(() => navigate('/books'));
    }
  }, [singleBookId, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);
  };

  const getBookIds = (): string[] => {
    if (singleBook) return [singleBook.id];
    return items.map((item) => item.book.id);
  };

  const getTotal = (): number => {
    if (singleBook) return singleBook.price;
    return items.reduce((sum, item) => sum + item.book.price, 0);
  };

  const handlePayment = async () => {
    if (!email) {
      setError('Please provide your email address.');
      return;
    }
    setProcessing(true);
    setError('');

    try {
      const bookIds = getBookIds();
      const order = await ordersApi.create(bookIds, !isAuthenticated ? email : undefined);
      const payment = await ordersApi.initializePayment(order.id, email);

      // Store order info for verification after payment
      sessionStorage.setItem('pending_order', JSON.stringify({
        order_id: order.id,
        reference: payment.reference,
        book_ids: bookIds,
      }));

      // Redirect to Paystack
      window.location.href = payment.authorization_url;
    } catch {
      setError('Unable to initialize payment. Please try again.');
      setProcessing(false);
    }
  };

  // If no items and no single book
  if (!singleBookId && items.length === 0) {
    navigate('/books');
    return null;
  }

  const total = getTotal();

  return (
    <>
      <SEOHead title="Checkout — BookVault" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
          {singleBook ? (
            <div className="flex items-center gap-4">
              <img src={singleBook.cover_url} alt={singleBook.title} className="w-12 h-16 object-cover rounded" />
              <div>
                <p className="font-medium text-gray-900 text-sm">{singleBook.title}</p>
                <p className="text-sm text-gray-500">{singleBook.author}</p>
              </div>
              <p className="ml-auto font-bold text-gray-900">{formatPrice(singleBook.price)}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.book.id} className="flex items-center gap-3">
                  <img src={item.book.cover_url} alt={item.book.title} className="w-10 h-14 object-cover rounded" />
                  <p className="text-sm text-gray-700 flex-1 truncate">{item.book.title}</p>
                  <p className="text-sm font-medium text-gray-900">{formatPrice(item.book.price)}</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Email */}
        {!isAuthenticated && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-gray-400">(for order confirmation)</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="your@email.com"
            />
          </div>
        )}

        {/* Payment info */}
        <div className="bg-emerald-50 rounded-xl p-4 mb-8">
          <p className="text-sm text-emerald-800">
            <strong>Secure Payment:</strong> You'll be redirected to Paystack to complete your payment safely. 
            We accept cards, bank transfers, and USSD.
          </p>
        </div>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full py-4 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-50 text-lg"
        >
          {processing ? 'Processing...' : `Pay ${formatPrice(total)}`}
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          By completing this purchase, you agree to our Terms of Service and Refund Policy.
        </p>
      </div>
    </>
  );
};

export default Checkout;
