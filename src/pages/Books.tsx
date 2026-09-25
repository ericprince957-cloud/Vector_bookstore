import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { booksApi } from '../api/books';
import { categoriesApi } from '../api/categories';
import { Book, Category, BooksFilter } from '../types';
import BookCard from '../components/ui/BookCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import SEOHead from '../components/common/SEOHead';

const Books: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<BooksFilter>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: (searchParams.get('sort') as BooksFilter['sort']) || 'newest',
    featured: searchParams.get('featured') === 'true' ? true : undefined,
    page: Number(searchParams.get('page')) || 1,
    per_page: 12,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await categoriesApi.getAll();
        setCategories(cats);
      } catch { /* ignore */ }
    };
    fetchCategories();
  }, []);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await booksApi.getAll(filters);
      setBooks(response.data);
      setTotalPages(response.total_pages);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const updateFilter = (key: keyof BooksFilter, value: string | number | boolean | undefined) => {
    const newFilters = { ...filters, [key]: value, page: key === 'page' ? value as number : 1 };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== false) {
        params.set(k, String(v));
      }
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ page: 1, per_page: 12, sort: 'newest' });
    setSearchParams({});
  };

  const hasActiveFilters = filters.search || filters.category || filters.featured;

  return (
    <>
      <SEOHead title="Browse Books — BookVault" description="Browse our collection of practical digital books on technology, business, finance, and more." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Books</h1>
            <p className="mt-1 text-gray-500">Discover practical knowledge for your growth</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Search & Filters */}
        <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-8">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author, or keyword..."
                value={filters.search || ''}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Filter row */}
            <div className="flex flex-wrap gap-3">
              {/* Category */}
              <select
                value={filters.category || ''}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={filters.sort || 'newest'}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="title_asc">Title: A-Z</option>
                <option value="title_desc">Title: Z-A</option>
              </select>

              {/* Featured */}
              <button
                onClick={() => updateFilter('featured', filters.featured ? undefined : true)}
                className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  filters.featured
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Featured Only
              </button>

              {/* Clear */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner message="Loading books..." />
        ) : books.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => updateFilter('page', page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      page === filters.page
                        ? 'bg-emerald-700 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No books found"
            description="Try adjusting your search or filters to find what you're looking for."
            actionLabel="Browse All Books"
            actionPath="/books"
          />
        )}
      </div>
    </>
  );
};

export default Books;
