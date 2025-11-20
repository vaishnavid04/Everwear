import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { useCart } from "../context/CartContext";

const departments = [
  { name: "Menswear", path: "/mens" },
  { name: "Womenswear", path: "/women" },
  { name: "Accessories", path: "/accessories" },
  { name: "Best Sellers", path: "/best-sellers" },
  { name: "Sale", path: "/sale" }
];

export default function Navbar() {
  const { state } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItemsCount = state.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-sm shadow-minimal border-b border-neutral-200'
        : 'bg-white'
    }`}>
      <div className="container-minimal">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="text-2xl font-heading font-bold text-primary-800 group-hover:text-primary-900 transition-colors duration-200">
                Everwear
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-8 ml-12">
              {departments.map((department) => (
                <Link
                  key={department.name}
                  to={department.path}
                  className="text-neutral-700 hover:text-primary-800 font-medium transition-colors duration-200"
                >
                  {department.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Search Icon */}
            <button className="p-2 text-neutral-700 hover:text-primary-800 transition-colors duration-200">
              <Search size={20} />
            </button>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-neutral-700 hover:text-primary-800 transition-colors duration-200"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Sign In Button */}
            <Link
              to="/login"
              className="hidden sm:flex items-center space-x-2 text-neutral-700 hover:text-primary-800 transition-colors duration-200"
            >
              <User size={20} />
              <span className="font-medium">Account</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-neutral-700 hover:text-primary-800 transition-colors duration-200"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ?
                <X size={20} /> :
                <Menu size={20} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-200 animate-slideUp">
          <div className="container-minimal py-6 space-y-4">
            {departments.map((department) => (
              <Link
                key={department.name}
                to={department.path}
                className="block text-neutral-700 hover:text-primary-800 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {department.name}
              </Link>
            ))}
            <div className="border-t border-neutral-200 pt-4">
              <Link
                to="/login"
                className="flex items-center space-x-3 text-neutral-700 hover:text-primary-800 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <User size={20} />
                <span>Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
