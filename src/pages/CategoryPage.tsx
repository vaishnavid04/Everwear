import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import FilterSection from '../components/FilterSection';
import ProductGrid from '../components/ProductGrid';
import { Product } from '../types';

// Simulated products data - Essential Basics Collection
const products: Product[] = [
  // T-Shirts
  {
    id: 1,
    name: 'Essential T-Shirt',
    description: 'Premium cotton essential t-shirt in classic fit',
    price: 28.00,
    category: 't-shirts',
    imageUrl: '/images/tshirt-1.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 2,
    name: 'Essential T-Shirt',
    description: 'Premium cotton essential t-shirt in classic fit',
    price: 28.00,
    category: 't-shirts',
    imageUrl: '/images/tshirt-2.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },

  // Crop Tops
  {
    id: 3,
    name: 'Essential Crop Top',
    description: 'Comfortable cotton crop top for everyday wear',
    price: 24.00,
    category: 'crop-tops',
    imageUrl: '/images/crop-top-1.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 4,
    name: 'Essential Crop Top',
    description: 'Comfortable cotton crop top for everyday wear',
    price: 24.00,
    category: 'crop-tops',
    imageUrl: '/images/crop-top-2.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },

  // Sweatshirts
  {
    id: 5,
    name: 'Essential Sweatshirt',
    description: 'Cozy cotton blend sweatshirt for ultimate comfort',
    price: 48.00,
    category: 'sweatshirts',
    imageUrl: '/images/sweatshirt-1.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 6,
    name: 'Essential Sweatshirt',
    description: 'Cozy cotton blend sweatshirt for ultimate comfort',
    price: 48.00,
    category: 'sweatshirts',
    imageUrl: '/images/sweatshirt-2.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },

  // Sweatpants
  {
    id: 7,
    name: 'Essential Sweatpants',
    description: 'Relaxed fit sweatpants in soft cotton blend',
    price: 42.00,
    category: 'sweatpants',
    imageUrl: '/images/sweatpants-1.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 8,
    name: 'Essential Sweatpants',
    description: 'Relaxed fit sweatpants in soft cotton blend',
    price: 42.00,
    category: 'sweatpants',
    imageUrl: '/images/sweatpants-2.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },


];

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [selectedSort, setSelectedSort] = useState('newest');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  const categoryProducts = products.filter(
    (product) => product.category.toLowerCase() === category?.toLowerCase()
  );

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
          {category?.replace('-', ' ')}
        </h1>
        <p className="text-gray-600">
          {filteredProducts.length} items found in {category}
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