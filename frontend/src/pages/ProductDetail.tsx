import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ShoppingCart, Heart, ArrowLeft, Star, Truck, ShieldCheck, 
  RotateCcw, Minus, Plus, Share2 
} from 'lucide-react';
import { productService } from '../api/productService';
import { addToCart } from '../store/slices/cartSlice';
import { Product } from '../types';
import { AppDispatch, RootState } from '../store/store';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please log in to purchase items.');
      navigate('/login');
      return;
    }
    
    if (product) {
      setAddingToCart(true);
      try {
        await dispatch(addToCart({ productId: product.product_id, quantity })).unwrap();
        alert('Added to cart successfully!');
      } catch (err) {
        alert('Failed to add to cart.');
      } finally {
        setAddingToCart(false);
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:text-white">Loading...</div>;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Product not found'}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/products" className="hover:text-primary-light flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
          <span>/</span>
          <span>{product.category_name}</span>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* LEFT: Product Image */}
            <div className="lg:w-1/2 bg-gray-50 dark:bg-gray-700/50 p-8 lg:p-16 flex items-center justify-center relative">
               <img 
                 src={product.image_url} 
                 alt={product.name} 
                 className="w-full max-w-md object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-500"
               />
               <button className="absolute top-6 right-6 p-3 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors">
                 <Heart className="w-6 h-6" />
               </button>
            </div>

            {/* RIGHT: Product Info */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-primary-light/10 text-primary-light text-xs font-bold uppercase tracking-wider rounded-full">
                    {product.category_name}
                  </span>
                  {product.stock_quantity > 0 ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
                      In Stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">
                  {product.name}
                </h1>
                
                {/* Rating Mockup */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">(24 Reviews)</span>
                </div>

                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  ₹{Number(product.price).toLocaleString()}
                  <span className="text-lg text-gray-400 font-normal ml-2 line-through">
                    ₹{(Number(product.price) * 1.2).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  {/* Quantity */}
                  <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-xl p-1 w-fit">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all"
                    >
                      <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="p-3 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all"
                    >
                      <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button 
                    onClick={handleAddToCart}
                    disabled={addingToCart || product.stock_quantity === 0}
                    className="flex-1 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-primary-light dark:hover:bg-primary-light hover:text-white dark:hover:text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  
                  <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <Truck className="w-5 h-5 text-primary-light" />
                    <span>Free Delivery if ordered over ₹2000</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <ShieldCheck className="w-5 h-5 text-primary-light" />
                    <span>1 Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <RotateCcw className="w-5 h-5 text-primary-light" />
                    <span>7 Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabs */}
          <div className="border-t border-gray-100 dark:border-gray-700">
            <div className="flex border-b border-gray-100 dark:border-gray-700">
              {['desc', 'specs', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-8 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === tab 
                      ? 'border-primary-light text-primary-light' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab === 'desc' ? 'Description' : tab === 'specs' ? 'Specifications' : 'Reviews'}
                </button>
              ))}
            </div>
            <div className="p-8 lg:p-12 bg-gray-50/50 dark:bg-gray-800/50">
              {activeTab === 'desc' && (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {product.description}
                    <br /><br />
                    Designed for athletes who demand the best, this product combines durability with high-performance materials. Whether you are training for the championship or just playing a weekend match, rely on {product.name} to deliver consistent results.
                  </p>
                </div>
              )}
              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Category</span>
                    <span className="font-medium text-gray-900 dark:text-white">{product.category_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">SKU</span>
                    <span className="font-medium text-gray-900 dark:text-white">VL-{product.product_id}-SP</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Stock Status</span>
                    <span className="font-medium text-gray-900 dark:text-white">{product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;