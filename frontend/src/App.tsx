import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Temporary Home Placeholder
const Home = () => (
  <div className="p-10 text-center">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Vilayattu Shop</h1>
    <p className="text-gray-600 dark:text-gray-300">Your premium destination for sports gear.</p>
  </div>
);

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* We will build these pages next */}
        <Route path="/login" element={<div className="p-20 text-center dark:text-white">Login Page Coming Soon</div>} />
        <Route path="/register" element={<div className="p-20 text-center dark:text-white">Register Page Coming Soon</div>} />
        <Route path="/products" element={<div className="p-20 text-center dark:text-white">Products Page Coming Soon</div>} />
      </Routes>
    </Layout>
  );
}

export default App;