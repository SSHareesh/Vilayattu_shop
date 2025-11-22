import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden h-full">
      
      {/* Image Container */}
      <Link to={`/product/${product.product_id}`} className="relative block w-full pt-[100%] overflow-hidden bg-gray-50 dark:bg-gray-700">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Badges (Optional - e.g. New Arrival) */}
        {product.stock_quantity < 10 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            Low Stock
          </span>
        )}
      </Link>

      {/* Quick Actions (Appear on Hover) */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
        <button className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-600 transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-xs font-semibold text-primary-light uppercase tracking-wider">
            {product.category_name || 'Sports Gear'}
          </span>
        </div>
        
        <Link to={`/product/${product.product_id}`} className="block mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-light transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">Price</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ₹{Number(product.price).toLocaleString()}
            </span>
          </div>

          <button 
            className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-light dark:hover:bg-primary-light hover:text-white dark:hover:text-white transition-all shadow-lg shadow-gray-200 dark:shadow-none transform active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add dispatch to cart logic here
              console.log('Add to cart:', product.name);
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;