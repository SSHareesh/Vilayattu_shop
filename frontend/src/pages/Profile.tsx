import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, LogOut, CreditCard, Settings, Clock } from 'lucide-react';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { orderService, Order } from '../api/orderService';
import { addressService, Address } from '../api/addressService';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersData, addressesData] = await Promise.all([
          orderService.getMyOrders(),
          addressService.getMyAddresses()
        ]);
        setOrders(ordersData);
        setAddresses(addressesData);
      } catch (error) {
        console.error("Failed to load profile data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'shipped': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'pending': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'cancelled': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user.first_name}!</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              
              {/* User Card */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="w-12 h-12 bg-primary-light text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {user.first_name[0]}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-gray-900 dark:text-white truncate">{user.first_name} {user.last_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
              </div>

              {/* Menu */}
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'orders' 
                      ? 'bg-primary-light text-white shadow-lg shadow-primary-light/30' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Package className="w-5 h-5" /> Orders
                </button>
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'addresses' 
                      ? 'bg-primary-light text-white shadow-lg shadow-primary-light/30' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <MapPin className="w-5 h-5" /> Addresses
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'settings' 
                      ? 'bg-primary-light text-white shadow-lg shadow-primary-light/30' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Settings className="w-5 h-5" /> Account Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 min-h-[500px]">
              
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order History</h2>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />)}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <p className="text-lg">No orders yet</p>
                      <button onClick={() => navigate('/products')} className="mt-4 text-primary-light font-bold hover:underline">Start Shopping</button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.order_id} className="border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-bold text-gray-900 dark:text-white">Order #{order.order_id}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(order.order_date).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><CreditCard className="w-4 h-4" /> Total: ₹{Number(order.total_amount).toLocaleString()}</span>
                              </div>
                            </div>
                            <button className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ADDRESSES TAB */}
              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Saved Addresses</h2>
                  {loading ? (
                    <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                      <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <p>No addresses saved</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div key={addr.address_id} className="p-6 border border-gray-200 dark:border-gray-700 rounded-2xl relative group">
                          <div className="flex items-start justify-between mb-2">
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              {addr.address_type}
                            </span>
                            {/* <button className="text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button> */}
                          </div>
                          <p className="font-bold text-gray-900 dark:text-white mb-1">{addr.address_line1}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{addr.city}, {addr.state} - {addr.postal_code}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{addr.country}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SETTINGS TAB (Placeholder) */}
              {activeTab === 'settings' && (
                <div className="text-center py-20">
                  <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600 animate-spin-slow" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account Settings</h3>
                  <p className="text-gray-500 mt-2">Password change and profile editing coming soon.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;