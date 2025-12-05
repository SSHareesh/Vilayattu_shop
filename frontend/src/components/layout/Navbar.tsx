import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { fetchCart } from '../../store/slices/cartSlice';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Access auth and cart state from Redux
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);

  // Fetch cart on mount if logged in, to ensure badge is correct
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center text-white font-bold text-xl italic transform -skew-x-12">
              V
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white">
              Vilayattu<span className="text-primary-light">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark font-medium transition-colors">
              Shop
            </Link>
            <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark font-medium transition-colors">
              About
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search */}
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search gears..." 
                className="pl-10 pr-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light w-40 transition-all group-hover:w-64 text-gray-800 dark:text-gray-200"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Cart Icon with Live Badge */}
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full animate-pulse">
                  {items.length}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            <div className="relative">
              {isAuthenticated ? (
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-light transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                    <User className="w-5 h-5" />
                  </div>
                </button>
              ) : (
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg bg-primary-light hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-md shadow-blue-500/30"
                >
                  Login
                </Link>
              )}

              {/* Dropdown Menu */}
              {isProfileOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none transform origin-top-right transition-all z-50">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-900 dark:text-white font-bold">{user?.first_name} {user?.last_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsProfileOpen(false)}>Your Profile</Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
             <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/cart" className="relative p-2 rounded-full text-gray-600 dark:text-gray-300">
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-primary-light focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 absolute w-full z-40">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-light hover:bg-gray-50 dark:hover:bg-gray-800">Home</Link>
            <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-light hover:bg-gray-50 dark:hover:bg-gray-800">Shop</Link>
            <Link to="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-light hover:bg-gray-50 dark:hover:bg-gray-800">Cart</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-light hover:bg-gray-50 dark:hover:bg-gray-800">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800">Sign Out</button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-primary-light font-bold">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;