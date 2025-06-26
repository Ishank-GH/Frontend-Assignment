import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import { CartProvider } from './components/CartContext';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg">
          <nav className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
            <Link to="/" className="text-3xl font-extrabold tracking-tight mb-3 sm:mb-0">My <span className="text-yellow-300">Store</span></Link>
            <div className="flex space-x-6">
              <Link 
                to="/"
                className="text-lg font-semibold hover:text-yellow-300 transition duration-300 transform hover:scale-105"
              >
                Products
              </Link>
              <Link 
                to="/cart"
                className="text-lg font-semibold hover:text-yellow-300 transition duration-300 transform hover:scale-105"
              >
                Cart
              </Link>
            </div>
          </nav>
        </header>

        <main className="container mx-auto p-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>

        <footer className="bg-gray-900 text-white p-4 text-center mt-8 shadow-inner">
          <p className="text-sm">&copy; 2024 My Store. All rights reserved.</p>
        </footer>
      </Router>
    </CartProvider>
  );
}

export default App;
