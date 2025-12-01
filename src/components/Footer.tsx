import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const handleContactClick = (type: 'email' | 'phone') => {
    // Analytics event
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: unknown }).gtag) {
      const gtag = (window as unknown as { gtag: (event: string, action: string, params: Record<string, unknown>) => void }).gtag;
      gtag('event', 'footer_contact_click', {
        contact_type: type
      });
    }
  };

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <div className="container-minimal py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          
          {/* Headquarters */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Headquarters
            </h3>
            <div className="space-y-2 text-neutral-600">
              <p className="font-medium text-neutral-900">Everwear</p>
              <p>123 Market Street</p>
              <p>San Jose, CA 95113</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-neutral-600">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Email:</p>
                <a
                  href="mailto:support@everwear.co"
                  className="text-primary-800 hover:text-primary-900 font-medium transition-colors duration-200"
                  onClick={() => handleContactClick('email')}
                >
                  support@everwear.co
                </a>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Phone:</p>
                <a
                  href="tel:+14085550126"
                  className="text-primary-800 hover:text-primary-900 font-medium transition-colors duration-200"
                  onClick={() => handleContactClick('phone')}
                >
                  (408) 555-0126
                </a>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Hours:</p>
                <p>Mon–Fri 9:00 AM – 6:00 PM PT</p>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Shop
            </h3>
            <div className="space-y-3">
              <Link
                to="/mens"
                className="block text-neutral-600 hover:text-primary-800 transition-colors duration-200"
              >
                Menswear
              </Link>
              <Link
                to="/women"
                className="block text-neutral-600 hover:text-primary-800 transition-colors duration-200"
              >
                Womenswear
              </Link>
              <Link
                to="/accessories"
                className="block text-neutral-600 hover:text-primary-800 transition-colors duration-200"
              >
                Accessories
              </Link>
              <Link
                to="/sale"
                className="block text-neutral-600 hover:text-primary-800 transition-colors duration-200"
              >
                Sale
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-200 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-sm">
              <Link
                to="/about"
                className="text-neutral-600 hover:text-primary-800 transition-colors duration-200"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-neutral-600 hover:text-primary-800 transition-colors duration-200"
              >
                Contact Information
              </Link>
              <Link
                to="/terms"
                className="text-neutral-600 hover:text-primary-800 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-neutral-600 hover:text-primary-800 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/shipping"
                className="text-neutral-600 hover:text-primary-800 transition-colors duration-200"
              >
                Shipping Policy
              </Link>
            </div>

            {/* Payment Icons & Copyright */}
            <div className="flex flex-col items-center lg:items-end space-y-4">
              {/* Payment Icons */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-xs text-neutral-500">
                  <span>We accept:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    VISA
                  </div>
                  <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    MC
                  </div>
                  <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                    AMEX
                  </div>
                  <div className="w-8 h-5 bg-yellow-400 rounded text-blue-900 text-xs flex items-center justify-center font-bold">
                    PP
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <p className="text-sm text-neutral-500">
                © 2025 Everwear
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
