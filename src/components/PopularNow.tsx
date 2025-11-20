import React from 'react';
import { Link } from 'react-router-dom';
import StructuredData from './StructuredData';
import { getFeaturedProducts } from '../data/products';

const PopularNow: React.FC = () => {
  // Get featured products from centralized data
  const popularProducts = getFeaturedProducts().map(product => ({
    ...product,
    isBestseller: true
  }));

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <section id="popular-now" className="py-16 lg:py-20 bg-white">
      <StructuredData products={popularProducts} />
      <div className="container-minimal">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-neutral-900 mb-4">
            Popular Now
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Best sellers our customers love right now.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {popularProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden bg-neutral-50">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-semibold text-lg text-neutral-900 mb-2 group-hover:text-primary-800 transition-colors">
                  {product.name}
                </h3>
                <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Price */}
                <div className="flex items-center space-x-2">
                  {product.salePrice ? (
                    <>
                      <span className="text-lg font-bold text-primary-800">
                        {formatPrice(product.salePrice)}
                      </span>
                      <span className="text-sm text-neutral-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-neutral-900">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="flex items-center space-x-1 mt-3">
                    <span className="text-xs text-neutral-500 mr-2">Colors:</span>
                    {product.colors.slice(0, 4).map((color) => (
                      <div
                        key={color}
                        className="w-4 h-4 rounded-full border border-neutral-200"
                        style={{
                          backgroundColor: color === 'cream' ? '#f5f5dc' : 
                                         color === 'dark-brown' ? '#654321' : color
                        }}
                      />
                    ))}
                    {product.colors.length > 4 && (
                      <span className="text-xs text-neutral-500">+{product.colors.length - 4}</span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/shop"
            className="btn-secondary inline-flex items-center justify-center"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularNow;
