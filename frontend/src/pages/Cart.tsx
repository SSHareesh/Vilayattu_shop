import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, Tag } from 'lucide-react';
import CartItem from '../components/common/CartItem';
import { AppDispatch, RootState } from '../store/store';
import { fetchCart } from '../store/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + tax + shipping;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-full shadow-lg mb-6">
          <ShoppingBag className="w-12 h-12 text-primary-light" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Sign in to view your cart</h2>
        <p className="text-gray-500 mb-8 max-w-md">Join the club to save your items and checkout faster.</p>
        <div className="flex gap-4">
          <Link to="/login" className="px-8 py-3 bg-primary-light text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
            Log In
          </Link>
          <Link to="/register" className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Register
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added any gear yet. Check out our latest arrivals!</p>
        <Link to="/products" className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold shadow-lg hover:transform hover:scale-105 transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          Shopping Cart <span className="text-lg font-medium text-gray-500 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">{items.length} items</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="flex-grow w-full space-y-4">
            {items.map((item) => (
              <CartItem key={item.cart_item_id} item={item} />
            ))}
          </div>

          {/* Order Summary - Sticky */}
          <div className="w-full lg:w-[400px] lg:sticky lg:top-28">
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-light to-secondary-light"></div>
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
              
              {/* Promo Code UI */}
              <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Promo Code</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Tag className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Enter code" 
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-light outline-none"
                    />
                  </div>
                  <button className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>GST (18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-500 font-bold text-sm bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">Free</span>
                  ) : (
                    <span>₹{shipping}</span>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between items-end mb-8">
                <span className="text-gray-900 dark:text-white font-medium">Total Amount</span>
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{total.toLocaleString()}</span>
              </div>

              <button 
                className="w-full py-4 bg-primary-light hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mb-6 active:scale-95"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                  <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Secure SSL Encrypted Transaction</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                  <Truck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>Free shipping on orders over ₹2,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
