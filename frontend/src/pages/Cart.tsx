import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import CartItem from '../components/common/CartItem';
import { AppDispatch, RootState } from '../store/store';
import { fetchCart } from '../store/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    } else {
      // Optional: Redirect to login if accessing cart while logged out
      // navigate('/login');
    }
  }, [isAuthenticated, dispatch]);

  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST example
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + tax + shipping;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <ShoppingBag className="w-20 h-20 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Please Log In</h2>
        <p className="text-gray-500 mb-8">You need to be logged in to view your cart.</p>
        <Link to="/login" className="px-8 py-3 bg-primary-light text-white rounded-full font-bold shadow-lg hover:bg-blue-600 transition-colors">
          Log In Now
        </Link>
      </div>
    );
  }

  if (loading && items.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-primary-light font-bold">Loading Cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
        Your Cart <span className="text-lg font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{items.length} items</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="flex-grow w-full space-y-4">
          {items.map((item) => (
            <CartItem key={item.cart_item_id} item={item} />
          ))}
        </div>

        {/* Order Summary - Sticky */}
        <div className="w-full lg:w-96 lg:sticky lg:top-28">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
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
                  <span className="text-green-500 font-medium">Free</span>
                ) : (
                  <span>₹{shipping}</span>
                )}
              </div>
              
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-bold text-primary-light">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              className="w-full py-4 bg-primary-light hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mb-6"
              onClick={() => alert('Proceed to checkout logic here')}
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </button>

            {/* Trust Badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span>Secure Checkout with 256-bit SSL</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <Truck className="w-5 h-5 text-blue-500" />
                <span>Free shipping on orders over ₹2,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;