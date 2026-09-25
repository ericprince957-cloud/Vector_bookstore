import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Download, Shield, Zap } from 'lucide-react';
import { booksApi } from '../api/books';
import { categoriesApi } from '../api/categories';
import { Book, Category } from '../types';
import BookCard from '../components/ui/BookCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SEOHead from '../components/common/SEOHead';

const Home: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [newestBooks, setNewestBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, newest, cats] = await Promise.allSettled([
          booksApi.getFeatured(),
          booksApi.getNewest(8),
          categoriesApi.getAll(),
        ]);
        if (featured.status === 'fulfilled') setFeaturedBooks(featured.value);
        if (newest.status === 'fulfilled') setNewestBooks(newest.value);
        if (cats.status === 'fulfilled') setCategories(cats.value);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayBooks = featuredBooks.length > 0 ? featuredBooks : newestBooks.slice(0, 4);

  return (
    <>
      <SEOHead />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-emerald-50/50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Practical Books for{' '}
                <span className="text-emerald-700">Learning, Building</span> and Growing.
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                Discover practical digital books designed to help you develop useful skills, 
                manage your money, build businesses and navigate the modern digital world.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  Explore Books
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Browse Categories
                </Link>
              </div>
            </div>

            {/* Book covers visual */}
            <div className="relative hidden lg:block">
              <div className="relative flex items-center justify-center">
                {displayBooks.length > 0 ? (
                  <div className="flex gap-4 perspective-1000">
                    {displayBooks.slice(0, 3).map((book, i) => (
                      <div
                        key={book.id}
                        className="w-44 h-60 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
                        style={{
                          transform: `rotateY(${(i - 1) * 8}deg) translateY(${i === 1 ? -10 : 0}px)`,
                        }}
                      >
                        <img
                          src={book.cover_url || 'https://via.placeholder.com/300x400?text=Book'}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-80 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Books</h2>
              <p className="mt-2 text-gray-600">Handpicked books to accelerate your growth</p>
            </div>
            <Link to="/books" className="hidden sm:flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading books..." />
          ) : displayBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured books available yet. Check back soon!</p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link to="/books" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
              View all books <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.slice(0, 10).map((category) => (
                <Link
                  key={category.id}
                  to={`/books?category=${category.slug}`}
                  className="flex flex-col items-center p-5 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all"
                >
                  <span className="text-sm font-medium text-gray-800 text-center">{category.name}</span>
                  {category.book_count !== undefined && (
                    <span className="mt-1 text-xs text-gray-400">{category.book_count} books</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">Why BookVault?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="font-semibold text-gray-900">Instant Download</h3>
              <p className="mt-2 text-sm text-gray-500">Get your books immediately after payment. No waiting.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="font-semibold text-gray-900">Secure Payment</h3>
              <p className="mt-2 text-sm text-gray-500">Pay safely with Paystack. Your data is protected.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="font-semibold text-gray-900">Lifetime Access</h3>
              <p className="mt-2 text-sm text-gray-500">Download your purchased books anytime from your library.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="font-semibold text-gray-900">Practical Content</h3>
              <p className="mt-2 text-sm text-gray-500">Books focused on real skills and actionable knowledge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to Start Learning?</h2>
          <p className="mt-4 text-emerald-100 text-lg">
            Browse our collection of practical digital books and start building your skills today.
          </p>
          <Link
            to="/books"
            className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Browse All Books
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
