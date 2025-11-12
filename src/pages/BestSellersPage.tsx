import React from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const BestSellersPage: React.FC = () => {
  // Get bestselling products from centralized data
  const bestSellerProducts = [
    products.find(p => p.id === 1), // Beanie
    products.find(p => p.id === 3), // Sports Bra
    products.find(p => p.id === 2), // Baseball Hat (on sale)
  ].filter(Boolean); // Remove any undefined products

  return (
    <div className="min-h-screen bg-white">
      <div className="container-minimal py-12 lg:py-16">
        {/* Page Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral-900 mb-4">
            Best Sellers
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Our most popular items that customers love and keep coming back for. 
            These bestselling pieces combine quality, comfort, and style.
          </p>
        </div>

        {/* Bestseller Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-800 text-white text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Customer Favorites
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {bestSellerProducts.map((product) => (
            <div key={product.id} className="relative">
              {/* Bestseller Badge on Card */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-800 text-white shadow-lg">
                  #1 Bestseller
                </span>
              </div>
              
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.salePrice || product.price}
                originalPrice={product.salePrice ? product.price : undefined}
                imageUrl={product.imageUrl}
                colors={product.colors}
              />
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-neutral-50 rounded-2xl p-8 lg:p-12 max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-4">
              Why These Are Bestsellers
            </h2>
            <p className="text-neutral-600 mb-6 leading-relaxed">
              These three items represent the core of what Everwear stands for: quality, 
              comfort, and timeless style. Each piece has been carefully selected by our 
              customers as their go-to essentials.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Premium Quality</h3>
                <p className="text-sm text-neutral-600">Made with the finest materials for lasting comfort</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Customer Loved</h3>
                <p className="text-sm text-neutral-600">Consistently rated 5 stars by our community</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Fast Selling</h3>
                <p className="text-sm text-neutral-600">These items sell out quickly - don't wait!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellersPage;
