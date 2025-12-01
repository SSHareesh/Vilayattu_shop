import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

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

        {/* Placeholder Routes for future development */}
        <Route path="/product/:id" element={<div className="p-20 text-center dark:text-white">Product Detail Page Coming Soon</div>} />
        <Route path="/profile" element={<div className="p-20 text-center dark:text-white">Profile Page Coming Soon</div>} />
      </Routes>
    </Layout>
  );
}

export default App;