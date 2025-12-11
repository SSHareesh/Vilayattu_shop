import { useEffect, useState } from 'react';
import { ArrowRight, Trophy, Activity, Target, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { Product } from '../types';
import { productService } from '../api/productService';

const CATEGORIES = [
  { id: 1, name: 'Cricket', icon: Trophy, color: 'bg-blue-500' },
  { id: 2, name: 'Football', icon: Activity, color: 'bg-green-500' },
  { id: 3, name: 'Badminton', icon: Target, color: 'bg-orange-500' },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch real data from the backend
        const data = await productService.getFeaturedProducts();
        setFeaturedProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please check if backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-gray-50 dark:bg-gray-900 text-black dark:text-white overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-light rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-light rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Unleash Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary-light">
                Inner Athlete
              </span>
            </h1>
            <p className="text-xl text-gray-900 dark:text-gray-50 max-w-2xl mx-auto lg:mx-0">
              Premium equipment for Cricket, Football, Badminton, and more. 
              Elevate your game with Vilayattu Shop.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/products" 
                className="px-8 py-4 rounded-full bg-primary-light hover:bg-blue-600 text-white font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              {/* <Link 
                to="/about" 
                className="px-8 py-4 rounded-full bg-gray-800 dark:bg-white/10 hover:bg-black/100 dark:hover:bg-white/20 backdrop-blur-sm text-white font-bold text-lg transition-all border border-white/20"
              >
                Learn More
              </Link> */}
            </div>
          </div>
          {/* Hero Image Placeholder */}
          <div className="lg:w-1/2 mt-12 lg:mt-0 relative">
             <div className="w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center shadow-2xl">
                <img 
                src="/images/home/hero-page.png" 
                alt="Sports equipment home page" 
                />
             </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Shop by Sport</h2>
          <Link to="/products" className="text-primary-light font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.id} 
              to={`/products?category=${cat.name}`}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${cat.color} opacity-10 rounded-bl-full transition-transform group-hover:scale-150`}></div>
              <cat.icon className={`w-10 h-10 ${cat.color.replace('bg-', 'text-')} mb-4`} />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-light transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Explore gear &rarr;
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Trending Now</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Top-rated equipment chosen by players like you. Don't miss out on these bestsellers.
          </p>
        </div>

        {loading ? (
           // Loading State
           <div className="flex justify-center items-center h-64">
             <Loader className="w-10 h-10 text-primary-light animate-spin" />
           </div>
        ) : error ? (
           // Error State
           <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
             <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
             <p className="text-sm text-gray-500 mt-2">Ensure your backend server is running on port 5000</p>
           </div>
        ) : featuredProducts.length === 0 ? (
           // Empty State
           <div className="text-center py-12 text-gray-500">
             <p>No products found in the database.</p>
           </div>
        ) : (
           // Products Grid
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {featuredProducts.map((product) => (
               <ProductCard key={product.product_id} product={product} />
             ))}
           </div>
        )}
      </section>
      
      {/* Newsletter / CTA Section */}
       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-light rounded-3xl p-8 lg:p-16 text-center text-white relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
           <div className="relative z-10 max-w-2xl mx-auto">
             <h2 className="text-3xl font-bold mb-4">Join the Vilayattu Club</h2>
             <p className="text-blue-100 mb-8">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
             <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
               <input disabled
                 type="email" 
                 placeholder="coming soon..." 
                 className="cursor-not-allowed flex-grow px-6 py-3 rounded-full text-white-100 focus:outline-none focus:ring-2 focus:ring-white"
               />
               <button disabled className="cursor-not-allowed px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors">
                 Subscribe
               </button>
             </div>
           </div>
        </div>
      </section> 

    </div>
  );
};

export default Home;