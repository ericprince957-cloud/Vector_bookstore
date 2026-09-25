import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download, BookOpen, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ordersApi } from '../api/orders';
import { Order } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import SEOHead from '../components/common/SEOHead';

const Dashboard: React.FC = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, isLoading, navigate]);

  const fetchOrders = async () => {
    try {
      const data = await ordersApi.getMyOrders();
      setOrders(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleDownload = async (orderId: string, bookId: string) => {
    setDownloadingId(bookId);
    try {
      const { download_url } = await ordersApi.getDownloadUrl(orderId, bookId);
      window.open(download_url, '_blank');
    } catch {
      alert('Unable to download. Please try again or contact support.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading || loading) return <LoadingSpinner fullPage message="Loading your library..." />;

  const purchasedBooks = orders
    .filter((o) => o.status === 'paid')
    .flatMap((o) => o.items.map((item) => ({ ...item, order_id: o.id })));

  return (
    <>
      <SEOHead title="My Library — BookVault" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Library</h1>
            <p className="mt-1 text-gray-600">Welcome back, {user?.name?.split(' ')[0] || 'Reader'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-4 bg-gray-50 rounded-xl">
            <BookOpen className="w-5 h-5 text-emerald-700 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{purchasedBooks.length}</p>
            <p className="text-sm text-gray-500">Books Owned</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <User className="w-5 h-5 text-emerald-700 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            <p className="text-sm text-gray-500">Total Orders</p>
          </div>
        </div>

        {/* Purchased Books */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Books</h2>

        {purchasedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedBooks.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl">
                {item.book?.cover_url && (
                  <img
                    src={item.book.cover_url}
                    alt={item.book.title}
                    className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{item.book?.title || 'Book'}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Purchased: {new Date(item.book?.created_at || '').toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDownload(item.order_id, item.book_id)}
                    disabled={downloadingId === item.book_id}
                    className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {downloadingId === item.book_id ? 'Loading...' : 'Download'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No books yet"
            description="You haven't purchased any books yet. Browse our collection to find your next read."
            actionLabel="Browse Books"
            actionPath="/books"
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;
