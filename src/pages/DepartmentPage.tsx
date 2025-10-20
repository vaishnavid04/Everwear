import React from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import {
  getMensProducts,
  getWomensProducts,
  getAccessoriesProducts,
  getSaleProducts
} from '../data/products';
import { Product } from '../types';

const DepartmentPage: React.FC = () => {
  const location = useLocation();

  // Extract department from pathname
  const getDepartmentFromPath = (): string => {
    const path = location.pathname.replace('/', '');
    return path;
  };

  const department = getDepartmentFromPath();

  // Get products based on department using centralized data
  const getFilteredProducts = (): Product[] => {
    switch (department) {
      case 'mens':
        return getMensProducts();
      case 'women':
        return getWomensProducts();
      case 'accessories':
        return getAccessoriesProducts();
      case 'sale':
        return getSaleProducts();
      default:
        return [];
    }
  };

  const filteredProducts = getFilteredProducts();

  const getDepartmentTitle = () => {
    switch (department) {
      case 'mens':
        return 'Menswear';
      case 'women':
        return 'Womenswear';
      case 'accessories':
        return 'Accessories';
      case 'sale':
        return 'Sale';
      default:
        return 'Shop';
    }
  };

  const getDepartmentDescription = () => {
    switch (department) {
      case 'mens':
        return 'Essential pieces designed for the modern man';
      case 'women':
        return 'Timeless essentials for the contemporary woman';
      case 'accessories':
        return 'Complete your look with our curated accessories';
      case 'sale':
        return 'Limited time offers on selected items';
      default:
        return 'Discover our complete collection';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container-minimal py-12 lg:py-16">
        {/* Page Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral-900 mb-4">
            {getDepartmentTitle()}
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {getDepartmentDescription()}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.salePrice || product.price}
                originalPrice={product.salePrice ? product.price : undefined}
                imageUrl={product.imageUrl}
                colors={product.colors}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Coming Soon
            </h3>
            <p className="text-neutral-600">
              We're working on adding products to this section.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentPage;
