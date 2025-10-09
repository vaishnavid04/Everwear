import React from 'react';
import { Link } from 'react-router-dom';
import StructuredData from './StructuredData';

interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  isBestseller?: boolean;
  category: string;
}

const PopularNow: React.FC = () => {
  // Top 3 bestselling products - curated list
  const popularProducts: Product[] = [
    {
      id: 1,
      name: 'Beanie',
      price: 28.00,
      imageUrl: '/images/tshirt-1.jpg',
      isBestseller: true,
      category: 'accessories'
    },
    {
      id: 3,
      name: 'Sports Bra',
      price: 63.00,
      imageUrl: '/images/crop-top-1.jpg',
      isBestseller: true,
      category: 'sports-bras'
    },
    {
      id: 5,
      name: 'Baseball Hat',
      price: 48.00,
      salePrice: 38.00,
      imageUrl: '/images/sweatshirt-1.jpg',
      isBestseller: true,
      category: 'accessories'
    }
  ];

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
              onClick={() => {
                // Analytics event
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'select_item', {
                    product_id: product.id,
                    name: product.name,
                    price: product.salePrice || product.price,
                    position: index + 1
                  });
                }
              }}
            >
              {/* Product Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {product.isBestseller && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-800 text-white">
                      Bestseller
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-800 transition-colors">
                  {product.name}
                </h3>
                
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
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link
            to="/best-sellers"
            className="inline-flex items-center text-primary-800 hover:text-primary-900 font-medium transition-colors duration-200"
          >
            View all best sellers
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularNow;
