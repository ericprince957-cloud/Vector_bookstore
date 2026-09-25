import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Download, BookOpen } from 'lucide-react';
import { ordersApi } from '../api/orders';
import { Order } from '../types';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SEOHead from '../components/common/SEOHead';

const OrderConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { clearCart } = useCart();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setError('No payment reference found.');
        setLoading(false);
        return;
      }
      try {
        const verifiedOrder = await ordersApi.verifyPayment(reference);
        setOrder(verifiedOrder);
        clearCart();
        sessionStorage.removeItem('pending_order');
      } catch {
        setError('Payment verification failed. If you were charged, please contact support with your transaction reference.');
      } finally {
        setLoading(false);
      }
    };
    verifyPayment();
  }, [reference, clearCart]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);
  };

  const handleDownload = async (bookId: string) => {
    if (!order) return;
    try {
      const { download_url } = await ordersApi.getDownloadUrl(order.id, bookId);
      window.open(download_url, '_blank');
    } catch {
      alert('Download failed. Please try again or contact support.');
    }
  };

  if (loading) return <LoadingSpinner fullPage message="Verifying your payment..." />;

  if (error) {
    return (
      <>
        <SEOHead title="Payment Issue — BookVault" />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Pending</h1>
          <p className="mt-3 text-gray-600">{error}</p>
          <div className="mt-8 space-y-3">
            <Link to="/contact" className="block px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg">
              Contact Support
            </Link>
            <Link to="/books" className="block px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg">
              Browse Books
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!order || order.status !== 'paid') {
    return (
      <>
        <SEOHead title="Order Status — BookVault" />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order Status</h1>
          <p className="mt-3 text-gray-600">
            {order?.status === 'pending' ? 'Your payment is being processed. Please check back shortly.' : 'Unable to retrieve order details.'}
          </p>
          <Link to="/" className="mt-6 inline-flex px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg">
            Go Home
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Payment Successful — BookVault" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Success */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="mt-3 text-gray-600">Thank you for your purchase. Your books are ready to download.</p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Number</span>
              <span className="font-medium text-gray-900">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-medium text-gray-900">{formatPrice(order.total_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-900">{order.guest_email || 'Sent to your account'}</span>
            </div>
          </div>
        </div>

        {/* Downloads */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Books</h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl">
              {item.book?.cover_url && (
                <img src={item.book.cover_url} alt={item.book.title} className="w-14 h-18 object-cover rounded-lg" />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.book?.title || 'Book'}</p>
                <p className="text-sm text-gray-500">{item.book?.author}</p>
              </div>
              <button
                onClick={() => handleDownload(item.book_id)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white text-sm font-medium rounded-lg hover:bg-emerald-800"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            to="/dashboard"
            className="flex-1 text-center px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
          >
            Go to My Library
          </Link>
          <Link
            to="/books"
            className="flex-1 text-center px-6 py-3 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
