import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Loader, Search } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import ProductFilters from '../components/common/ProductFilters';
import { Product } from '../types';
import { productService } from '../api/productService';

// Derived from your CSV/Database categories
const AVAILABLE_CATEGORIES = [
  'Cricket', 'Football', 'Hockey', 'Badminton', 'Tennis', 
  'Table Tennis', 'Basketball', 'Volleyball', 'Kabaddi', 
  'Chess', 'Carrom', 'Cards'
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Effect: Sync URL params with state
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Effect: Fetch Data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // We fetch based on category (supported by backend)
        // Note: Sort and Price are handled client-side for smoother UX 
        // unless the dataset is huge, then we'd move logic to backend.
        const data = await productService.getAllProducts(selectedCategory || undefined);
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]); // Refetch when category changes

  // Filter Logic (Client Side)
  const filteredProducts = products
    .filter(product => {
      // Price Filter
      const matchesPrice = Number(product.price) <= priceRange[1];
      // Search Filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPrice && matchesSearch;
    })
    .sort((a, b) => {
      // Sort Logic
      switch (sortBy) {
        case 'price-asc': return Number(a.price) - Number(b.price);
        case 'price-desc': return Number(b.price) - Number(a.price);
        case 'name-asc': return a.name.localeCompare(b.name);
        default: return 0; // 'newest' relies on default DB order usually
      }
    });

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
    setIsFilterOpen(false); // Close mobile menu on selection
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header & Mobile Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {selectedCategory ? `${selectedCategory} Gear` : 'All Products'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {filteredProducts.length} items found
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors text-gray-900 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="flex-shrink-0">
          <ProductFilters 
            categories={AVAILABLE_CATEGORIES}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="w-10 h-10 text-primary-light animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-sm underline text-red-500"
              >
                Try refreshing
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  setPriceRange([0, 10000]);
                  setSearchQuery('');
                  setSearchParams({});
                }}
                className="mt-4 text-primary-light font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;