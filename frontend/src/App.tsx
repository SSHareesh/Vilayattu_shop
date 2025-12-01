import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';

function App() {
  return (
    <Layout>
      <Routes>
        {/* Main Home Route */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />

        {/* Placeholder Routes for future development */}
        <Route path="*" element={<div className="p-20 text-center dark:text-white font-bold text-xl">404 - Page Not Found</div>} />

      </Routes>
    </Layout>
  );
}

export default App;