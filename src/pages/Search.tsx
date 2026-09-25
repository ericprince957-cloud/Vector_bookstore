import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { booksApi } from '../api/books';
import { Book } from '../types';
import BookCard from '../components/ui/BookCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import SEOHead from '../components/common/SEOHead';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    setSearchParams({ q: searchQuery });
    try {
      const response = await booksApi.getAll({ search: searchQuery, per_page: 20 });
      setResults(response.data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <>
      <SEOHead title={query ? `Search: ${query} — BookVault` : 'Search Books — BookVault'} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search bar */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, keyword..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              autoFocus
            />
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <LoadingSpinner message="Searching..." />
        ) : searched ? (
          results.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-6">
                {results.length} {results.length === 1 ? 'result' : 'results'} for "{searchParams.get('q')}"
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="No books matched your search"
              description={`We couldn't find any books for "${searchParams.get('q')}". Try different keywords or browse all books.`}
              actionLabel="Browse All Books"
              actionPath="/books"
            />
          )
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500">Start typing to search our book collection</p>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;
