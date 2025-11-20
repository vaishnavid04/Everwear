import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import FilterSection from '../components/FilterSection';
import ProductGrid from '../components/ProductGrid';
import { Product } from '../types';
import {
  products,
  getMensProducts,
  getWomensProducts,
  getAccessoriesProducts,
  getSaleProducts
} from '../data/products';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [selectedSort, setSelectedSort] = useState('newest');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  // Get products based on category using centralized data
  const getCategoryProducts = (): Product[] => {
    // If no category parameter, show all products (for /shop route)
    if (!category) {
      return products;
    }

    switch (category?.toLowerCase()) {
      case 'mens':
      case 'men':
        return getMensProducts();
      case 'women':
      case 'womens':
        return getWomensProducts();
      case 'accessories':
        return getAccessoriesProducts();
      case 'sale':
        return getSaleProducts();
      default:
        return products.filter(
          (product) => product.category.toLowerCase() === category?.toLowerCase()
        );
    }
  };

  const categoryProducts = getCategoryProducts();

  // Apply sorting
  const sortedProducts = [...categoryProducts].sort((a, b) => {
    switch (selectedSort) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popular':
        return 0; // In a real app, would sort by popularity metric
      default:
        return 0; // Newest first would use creation date
    }
  });

  // Apply price filtering
  const filteredProducts = sortedProducts.filter((product) => {
    switch (selectedPriceRange) {
      case '0-25':
        return product.price < 25;
      case '25-50':
        return product.price >= 25 && product.price < 50;
      case '50-100':
        return product.price >= 50 && product.price < 100;
      case '100+':
        return product.price >= 100;
      default:
        return true;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
          {category ? category.replace('-', ' ') : 'All Products'}
        </h1>
        <p className="text-gray-600">
          {filteredProducts.length} items found{category ? ` in ${category}` : ''}
        </p>
      </div>

      <FilterSection
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        selectedPriceRange={selectedPriceRange}
        onPriceRangeChange={setSelectedPriceRange}
      />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found matching your criteria.</p>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} category={category || ''} />
      )}
    </div>
  );
}