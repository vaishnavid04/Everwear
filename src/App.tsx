import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import DepartmentPage from './pages/DepartmentPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LegalPage from './pages/LegalPage';
import BestSellersPage from './pages/BestSellersPage';

// Inner component that has access to auth context
const AppContent: React.FC = () => {
  const { state: authState } = useAuth();

  return (
    <CartProvider userId={authState.user?.id}>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<CategoryPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/mens" element={<DepartmentPage />} />
            <Route path="/women" element={<DepartmentPage />} />
            <Route path="/accessories" element={<DepartmentPage />} />
            <Route path="/best-sellers" element={<BestSellersPage />} />
            <Route path="/sale" element={<DepartmentPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<LegalPage />} />
            <Route path="/contact" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/shipping" element={<LegalPage />} />
          </Routes>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </CartProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;