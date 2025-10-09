import React from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  colors: string[];
  sizes: string[];
  gender?: 'men' | 'women' | 'unisex';
}

const DepartmentPage: React.FC = () => {
  const { department } = useParams<{ department: string }>();

  // All products from the existing catalog
  const allProducts: Product[] = [
    {
      id: 1,
      name: 'Essential T-Shirt',
      description: 'Premium cotton essential t-shirt in classic fit',
      price: 28.00,
      category: 't-shirts',
      imageUrl: '/images/tshirt-1.jpg',
      colors: ['black', 'grey', 'cream', 'dark-brown'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      gender: 'unisex'
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
      gender: 'unisex'
    },
    {
      id: 3,
      name: 'Essential Crop Top',
      description: 'Comfortable crop top perfect for layering',
      price: 24.00,
      category: 'crop-tops',
      imageUrl: '/images/crop-top-1.jpg',
      colors: ['black', 'grey', 'cream', 'dark-brown'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      gender: 'women'
    },
    {
      id: 4,
      name: 'Essential Crop Top',
      description: 'Comfortable crop top perfect for layering',
      price: 24.00,
      category: 'crop-tops',
      imageUrl: '/images/crop-top-2.jpg',
      colors: ['black', 'grey', 'cream', 'dark-brown'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      gender: 'women'
    },
    {
      id: 5,
      name: 'Essential Sweatshirt',
      description: 'Cozy cotton blend sweatshirt for everyday comfort',
      price: 48.00,
      category: 'sweatshirts',
      imageUrl: '/images/sweatshirt-1.jpg',
      colors: ['black', 'grey', 'cream', 'dark-brown'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      gender: 'unisex'
    },
    {
      id: 6,
      name: 'Essential Sweatshirt',
      description: 'Cozy cotton blend sweatshirt for everyday comfort',
      price: 48.00,
      category: 'sweatshirts',
      imageUrl: '/images/sweatshirt-2.jpg',
      colors: ['black', 'grey', 'cream', 'dark-brown'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      gender: 'unisex'
    },
    {
      id: 7,
      name: 'Essential Sweatpants',
      description: 'Relaxed fit sweatpants in soft cotton blend',
      price: 42.00,
      category: 'sweatpants',
      imageUrl: '/images/sweatpants-1.jpg',
      colors: ['black', 'grey', 'cream', 'dark-brown'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      gender: 'unisex'
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
      gender: 'unisex'
    }
  ];

  // Filter products based on department
  const getFilteredProducts = () => {
    switch (department) {
      case 'mens':
        return allProducts.filter(product => 
          product.gender === 'men' || product.gender === 'unisex'
        );
      case 'women':
        return allProducts.filter(product => 
          product.gender === 'women' || product.gender === 'unisex'
        );
      case 'accessories':
        return []; // No accessories in current catalog
      case 'sale':
        return allProducts.slice(0, 3); // Mock sale items
      default:
        return allProducts;
    }
  };

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

  const filteredProducts = getFilteredProducts();

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
                price={product.price}
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
