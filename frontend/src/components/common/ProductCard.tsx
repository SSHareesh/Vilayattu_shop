import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Loader } from 'lucide-react';
import { Product } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { addToCart } from '../../store/slices/cartSlice';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      // In a real app, you'd redirect to login or open a modal
      return;
    }

    setIsAdding(true);
    try {
      await dispatch(addToCart({ productId: product.product_id, quantity: 1 })).unwrap();
      setIsAdded(true);
      // Reset the "Added" checkmark after 2 seconds
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart', error);
      alert('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:-translate-y-1 h-full">
      
      {/* Image Area */}
      <Link to={`/product/${product.product_id}`} className="relative block w-full pt-[100%] bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        
        {product.stock_quantity < 10 && (
          <div className="absolute top-4 left-4">
            <span className="px-2.5 py-1 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
              Low Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-primary-light bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 px-2 py-1 rounded-md uppercase tracking-wider">
            {product.category_name || 'Gear'}
          </span>
        </div>
        
        <Link to={`/product/${product.product_id}`} className="block mb-2 group-hover:text-primary-light transition-colors">
          <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Price</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white">
              ₹{Number(product.price).toLocaleString()}
            </span>
          </div>

          <button 
            className={`
              p-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2
              ${isAdded 
                ? 'bg-green-500 text-white shadow-green-500/30' 
                : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-primary-light dark:hover:bg-primary-light hover:text-white dark:hover:text-white shadow-gray-200 dark:shadow-none'
              }
            `}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-xs font-bold pr-1">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs font-bold pr-1">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;