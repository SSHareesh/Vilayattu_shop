import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import ProductFilters from '../components/common/ProductFilters';
import { Product } from '../types';
import { productService } from '../api/productService';

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
  
  // Sidebar State - Default to open on large screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
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
  }, [selectedCategory]);

  // Client-side filtering
  const filteredProducts = products
    .filter(product => {
      const matchesPrice = Number(product.price) <= priceRange[1];
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPrice && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return Number(a.price) - Number(b.price);
        case 'price-desc': return Number(b.price) - Number(a.price);
        case 'name-asc': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
    // On mobile, close sidebar after selection
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      
      {/* 1. TOP HEADER BAR - Distinct and separated */}
      {/* Note: Navbar is h-16 (4rem). This header is h-20 (5rem). Total offset = 9rem (36 tailwind units) */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30 shadow-sm h-20 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-4">
            
            {/* Left: Sidebar Toggle & Title */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                title={isSidebarOpen ? "Close Filters" : "Show Filters"}
              >
                {isSidebarOpen ? <PanelLeftClose className="w-6 h-6" /> : <PanelLeftOpen className="w-6 h-6" />}
              </button>
              
              <div className="hidden sm:block border-l border-gray-300 dark:border-gray-600 h-8 mx-2"></div>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none">
                  {selectedCategory ? selectedCategory : 'All Equipment'}
                </h1>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {filteredProducts.length} items
                </span>
              </div>
            </div>

            {/* Right: Search Bar */}
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 shadow-inner"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT - Sidebar + Content */}
      <div className="flex flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6 relative items-start">
        
        {/* MOBILE OVERLAY BACKDROP - Only visible on small screens when sidebar is open */}
        {isSidebarOpen && (
           <div 
             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
             onClick={() => setIsSidebarOpen(false)}
           />
        )}

        {/* SIDEBAR */}
        <aside 
          className={`
            /* Common Transitions */
            transition-all duration-300 ease-in-out flex-shrink-0
            
            /* DESKTOP (lg): Sticky Behavior */
            lg:sticky lg:top-36 lg:z-0
            ${isSidebarOpen ? 'lg:w-72 lg:opacity-100 lg:translate-x-0' : 'lg:w-0 lg:opacity-0 lg:-translate-x-10 lg:pointer-events-none'}
            
            /* MOBILE (<lg): Fixed Overlay Behavior */
            fixed inset-y-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl lg:shadow-none lg:bg-transparent lg:dark:bg-transparent
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          // Important: This height calc ensures the sticky sidebar fits exactly in the viewport without getting cut off
          style={{ height: 'calc(100vh - 9rem)' }} 
        >
          {/* Scrollable Container inside Sidebar */}
          <div className="h-full overflow-y-auto pr-2 pb-20  lg:pb-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
             <ProductFilters 
              categories={AVAILABLE_CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              sortBy={sortBy}
              onSortChange={setSortBy}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <main className={`flex-grow min-w-0 transition-all duration-300 ${isSidebarOpen && window.innerWidth < 1024 ? 'blur-sm' : ''}`}> 
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-[380px] bg-white dark:bg-gray-800 rounded-2xl animate-pulse border border-gray-200 dark:border-gray-700"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl border border-red-200 dark:border-red-800 text-center">
              <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No products found</h3>
              <p className="text-gray-500 mb-6">Adjust your filters to see more results.</p>
              <button 
                onClick={() => { setSelectedCategory(null); setPriceRange([0, 10000]); setSearchQuery(''); }}
                className="text-primary-light hover:underline font-bold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${isSidebarOpen ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default Products;