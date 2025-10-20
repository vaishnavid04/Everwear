import { Product } from '../types';

// Essential Basics Collection - Single source of truth
export const products: Product[] = [
  // Accessories
  {
    id: 1,
    name: 'Beanie',
    description: 'Cozy knit beanie for everyday warmth and style',
    price: 28.00,
    category: 'accessories',
    imageUrl: '/images/tshirt-1.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['One Size'],
  },
  {
    id: 2,
    name: 'Baseball Hat',
    description: 'Classic baseball cap with adjustable strap',
    price: 48.00,
    salePrice: 38.00,
    category: 'sale',
    imageUrl: '/images/sweatshirt-1.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['One Size'],
  },
  {
    id: 9,
    name: 'Baseball Hat',
    description: 'Classic baseball cap with adjustable strap',
    price: 48.00,
    salePrice: 38.00,
    category: 'accessories',
    imageUrl: '/images/sweatshirt-1.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['One Size'],
  },
  // Women's Items
  {
    id: 3,
    name: 'Sports Bra',
    description: 'Supportive sports bra for active lifestyle',
    price: 32.00,
    category: 'women',
    imageUrl: '/images/crop-top-1.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 4,
    name: 'Essential Crop Top',
    description: 'Comfortable cotton crop top for everyday wear',
    price: 24.00,
    category: 'women',
    imageUrl: '/images/crop-top-2.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  // Men's Items
  {
    id: 5,
    name: 'Essential T-Shirt',
    description: 'Premium cotton essential t-shirt in classic fit',
    price: 28.00,
    category: 'men',
    imageUrl: '/images/tshirt-2.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 6,
    name: 'Essential Sweatshirt',
    description: 'Cozy cotton blend sweatshirt for everyday comfort',
    price: 48.00,
    category: 'men',
    imageUrl: '/images/sweatshirt-2.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 7,
    name: 'Straight Leg Sweats',
    description: 'Comfortable straight leg sweatpants for everyday wear',
    price: 42.00,
    category: 'men',
    imageUrl: '/images/sweatpants-1.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 8,
    name: 'Cuffed Sweats',
    description: 'Comfortable cuffed sweatpants for lounging',
    price: 42.00,
    category: 'women',
    imageUrl: '/images/sweatpants-2.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
];

// Helper functions
export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getMensProducts = (): Product[] => {
  return products.filter(product => product.category === 'men');
};

export const getWomensProducts = (): Product[] => {
  return products.filter(product => product.category === 'women');
};

export const getAccessoriesProducts = (): Product[] => {
  return products.filter(product => product.category === 'accessories');
};

export const getSaleProducts = (): Product[] => {
  return products.filter(product => product.category === 'sale');
};

export const getFeaturedProducts = (): Product[] => {
  // Return beanie, sports bra, and baseball hat as featured
  return [
    products.find(p => p.id === 1)!, // Beanie
    products.find(p => p.id === 3)!, // Sports Bra
    products.find(p => p.id === 2)!, // Baseball Hat
  ];
};
