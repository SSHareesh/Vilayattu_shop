import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { updateCartItem, removeCartItem } from '../../store/slices/cartSlice';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleUpdateQuantity = (newQty: number) => {
    if (newQty < 1) return;
    dispatch(updateCartItem({ cartItemId: item.cart_item_id, quantity: newQty }));
  };

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      dispatch(removeCartItem(item.cart_item_id));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
      
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden p-2 border border-gray-100 dark:border-gray-600">
        <img 
          src={item.image_url} 
          alt={item.name} 
          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" 
        />
      </div>

      {/* Details */}
      <div className="flex-grow text-center sm:text-left">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{item.name}</h3>
        <p className="text-primary-light font-bold">₹{Number(item.price).toLocaleString()}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        {/* Quantity Stepper */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
          <button 
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 transition-all shadow-sm"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center font-bold text-gray-900 dark:text-white">{item.quantity}</span>
          <button 
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            className="p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Total & Remove */}
        <div className="flex flex-col items-end gap-2 min-w-[80px]">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ₹{(Number(item.price) * item.quantity).toLocaleString()}
          </span>
          <button 
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;