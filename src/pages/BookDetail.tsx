import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Eye, FileText, Calendar, Tag, CheckCircle2 } from 'lucide-react';
import { booksApi } from '../api/books';
import { ordersApi } from '../api/orders';
import { Book } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SEOHead from '../components/common/SEOHead';

const BookDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!slug) return;
      try {
        const data = await booksApi.getBySlug(slug);
        setBook(data);
      } catch {
        setError('Book not found');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [slug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleBuyNow = async () => {
    if (!book) return;
    setPurchasing(true);
    try {
      if (!isAuthenticated) {
        // Guest checkout - redirect to checkout with book
        navigate(`/checkout?book=${book.id}`);
      } else {
        // Authenticated - create order and pay
        const order = await ordersApi.create([book.id]);
        const payment = await ordersApi.initializePayment(order.id, '');
        window.location.href = payment.authorization_url;
      }
    } catch {
      setError('Unable to process purchase. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handlePreview = () => {
    if (book?.preview_file) {
      window.open(book.preview_file, '_blank');
    }
  };

  if (loading) return <LoadingSpinner fullPage message="Loading book details..." />;
  if (error || !book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Book Not Found</h2>
        <p className="mt-2 text-gray-500">The book you're looking for doesn't exist or has been removed.</p>
        <Link to="/books" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 text-white rounded-lg text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Browse Books
        </Link>
      </div>
    );
  }

  const inCart = isInCart(book.id);
  const hasDiscount = book.original_price && book.original_price > book.price;

  return (
    <>
      <SEOHead
        title={`${book.title} — BookVault`}
        description={book.short_description || book.description?.slice(0, 160)}
        image={book.cover_url}
        url={`/books/${book.slug}`}
        type="book"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <Link to="/books" className="hover:text-gray-700">Books</Link>
          {book.category && (
            <>
              <span>/</span>
              <Link to={`/books?category=${book.category.slug}`} className="hover:text-gray-700">{book.category.name}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 truncate">{book.title}</span>
        </nav>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Cover - Left */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 shadow-lg">
                <img
                  src={book.cover_url || 'https://via.placeholder.com/400x533?text=Book+Cover'}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Price & Actions */}
              <div className="mt-6 space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(book.price)}</span>
                  {hasDiscount && (
                    <span className="text-lg text-gray-400 line-through">{formatPrice(book.original_price!)}</span>
                  )}
                </div>

                <button
                  onClick={handleBuyNow}
                  disabled={purchasing}
                  className="w-full py-3.5 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-50"
                >
                  {purchasing ? 'Processing...' : 'Buy Now'}
                </button>

                <button
                  onClick={() => !inCart && addToCart(book)}
                  disabled={inCart}
                  className={`w-full py-3 border rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    inCart ? 'bg-gray-50 text-gray-500 border-gray-200' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {inCart ? 'Added to Cart' : 'Add to Cart'}
                </button>

                {book.preview_file && (
                  <button
                    onClick={handlePreview}
                    className="w-full py-3 text-emerald-700 font-medium hover:text-emerald-800 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    Preview Book
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Details - Right */}
          <div className="lg:col-span-3">
            {book.category && (
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                {book.category.name}
              </span>
            )}

            <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">{book.title}</h1>
            
            {book.author && (
              <p className="mt-2 text-lg text-gray-600">by <span className="font-medium text-gray-800">{book.author}</span></p>
            )}

            {/* Meta */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500">
              {book.file_type && (
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> {book.file_type.toUpperCase()}
                </span>
              )}
              {book.file_size && (
                <span>Size: {formatFileSize(book.file_size)}</span>
              )}
              {book.pages && (
                <span>{book.pages} pages</span>
              )}
              {book.created_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {new Date(book.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long' })}
                </span>
              )}
            </div>

            {/* Short Description */}
            <div className="mt-6 text-gray-600 leading-relaxed">
              <p>{book.short_description}</p>
            </div>

            {/* Full Description */}
            {book.description && book.description !== book.short_description && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Book</h2>
                <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                  {book.description}
                </div>
              </div>
            )}

            {/* What You'll Learn */}
            {book.what_you_learn && book.what_you_learn.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What You'll Learn</h2>
                <ul className="space-y-3">
                  {book.what_you_learn.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Table of Contents */}
            {book.table_of_contents && book.table_of_contents.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
                <ol className="space-y-2">
                  {book.table_of_contents.map((chapter, i) => (
                    <li key={i} className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-sm font-medium text-gray-600">
                        {i + 1}
                      </span>
                      <span className="text-gray-700">{chapter}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Tags */}
            {book.tags && book.tags.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5" /> Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetail;
