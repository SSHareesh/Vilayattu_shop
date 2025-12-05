import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, CheckCircle, Plus, Loader, Shield, Lock } from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { addressService, Address } from '../api/addressService';
import { orderService } from '../api/orderService';
import { clearCart } from '../store/slices/cartSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  
  // FIX: We are now using this variable in the JSX below
  const [loading, setLoading] = useState(false); 
  const [placingOrder, setPlacingOrder] = useState(false);

  // New Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_line1: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    address_type: 'Home'
  });

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    if (items.length === 0) navigate('/products');

    const loadAddresses = async () => {
      setLoading(true);
      try {
        const data = await addressService.getMyAddresses();
        setAddresses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAddresses();
  }, [isAuthenticated, items, navigate]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const added = await addressService.addAddress(newAddress);
      setAddresses([...addresses, added]);
      setSelectedAddressId(added.address_id);
      setShowAddressForm(false);
    } catch (err) {
      alert('Failed to add address.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return alert('Please select an address');
    
    setPlacingOrder(true);
    try {
      const result = await orderService.createOrder(selectedAddressId);
      dispatch(clearCart());
      alert(`Order Placed Successfully! Order ID: ${result.orderId}`);
      navigate('/products');
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 relative">
      
      {/* FIX: Use the loading variable to show a spinner overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <Loader className="w-10 h-10 text-primary-light animate-spin" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Steps */}
          <div className="flex-grow space-y-6">
            
            {/* STEP 1: Address */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border ${step === 1 ? 'border-primary-light ring-1 ring-primary-light' : 'border-gray-200 dark:border-gray-700'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-light text-white flex items-center justify-center text-sm">1</div>
                  Shipping Address
                </h2>
                {step > 1 && (
                  <button onClick={() => setStep(1)} className="text-sm text-primary-light font-bold hover:underline">Change</button>
                )}
              </div>

              {step === 1 && (
                <div className="space-y-4 ml-10">
                  {addresses.length === 0 && !showAddressForm && (
                    <div className="text-gray-500 mb-4">No addresses found. Please add one.</div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.address_id}
                        onClick={() => setSelectedAddressId(addr.address_id)}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${selectedAddressId === addr.address_id ? 'border-primary-light bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{addr.address_type}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{addr.address_line1}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{addr.city}, {addr.postal_code}</p>
                          </div>
                          {selectedAddressId === addr.address_id && <CheckCircle className="w-5 h-5 text-primary-light" />}
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => setShowAddressForm(true)}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 flex flex-col items-center justify-center text-gray-500 hover:border-primary-light hover:text-primary-light transition-colors min-h-[120px]"
                    >
                      <Plus className="w-6 h-6 mb-2" />
                      <span className="font-medium">Add New Address</span>
                    </button>
                  </div>

                  {/* New Address Form */}
                  {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl mt-4 border border-gray-200 dark:border-gray-700 animate-fadeIn">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">New Delivery Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required placeholder="Address Line 1" className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800" onChange={e => setNewAddress({...newAddress, address_line1: e.target.value})} />
                        <input required placeholder="City" className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800" onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                        <input required placeholder="State" className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800" onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                        <input required placeholder="Postal Code" className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800" onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})} />
                      </div>
                      <div className="mt-4 flex gap-3">
                        <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold text-sm">Save Address</button>
                        <button type="button" onClick={() => setShowAddressForm(false)} className="px-6 py-2 text-gray-600 font-bold text-sm">Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className="pt-4">
                    <button 
                      disabled={!selectedAddressId}
                      onClick={() => setStep(2)}
                      className="px-8 py-3 bg-primary-light text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 2: Payment */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border ${step === 2 ? 'border-primary-light ring-1 ring-primary-light' : 'border-gray-200 dark:border-gray-700'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 2 ? 'bg-primary-light text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
                  Payment Method
                </h2>
              </div>

              {step === 2 && (
                <div className="ml-10 space-y-4">
                  <div className="p-4 border border-primary-light bg-blue-50 dark:bg-blue-900/10 rounded-xl flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center">
                        <span className="font-bold text-xs text-gray-700">CASH</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when your gear arrives</p>
                      </div>
                    </div>
                    <CheckCircle className="w-6 h-6 text-primary-light" />
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-4 opacity-60 cursor-not-allowed">
                    <CreditCard className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Credit / Debit Card</p>
                      <p className="text-xs text-gray-400">Temporarily Unavailable</p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={placingOrder}
                      className="w-full sm:w-auto px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transition-all"
                    >
                      {placingOrder ? <Loader className="animate-spin" /> : <Lock className="w-5 h-5" />}
                      Place Order - ₹{total.toLocaleString()}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Summary */}
          <div className="w-full lg:w-96 lg:sticky lg:top-28 h-fit">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">In Your Bag</h3>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mb-6 scrollbar-thin">
                {items.map((item) => (
                  <div key={item.cart_item_id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-lg p-2 border border-gray-100 dark:border-gray-600">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">₹{(Number(item.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2">
                 <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Tax</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl font-extrabold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 justify-center text-xs text-gray-400">
              <Shield className="w-4 h-4" /> Secure Checkout
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;