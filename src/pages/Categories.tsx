import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoriesApi } from '../api/categories';
import { Category } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SEOHead from '../components/common/SEOHead';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategories(data);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <SEOHead title="Categories — BookVault" description="Browse books by category. Find practical digital books on technology, business, finance, and more." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h1>
          <p className="mt-2 text-gray-600">Find books organized by topic</p>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading categories..." />
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/books?category=${category.slug}`}
                className="group p-6 bg-white border border-gray-100 rounded-xl hover:border-emerald-200 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{category.description}</p>
                )}
                {category.book_count !== undefined && (
                  <span className="mt-3 inline-block text-sm font-medium text-emerald-700">
                    {category.book_count} {category.book_count === 1 ? 'book' : 'books'}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories available yet.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Categories;
