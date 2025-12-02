import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import connectDB from '../config/database.js';

dotenv.config();

// products data to seed
const productsData = [
  {
    name: 'Beanie',
    description: 'Cozy knit beanie for everyday warmth and style',
    price: 28.00,
    category: 'accessories',
    imageUrl: '/images/tshirt-1.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['One Size'],
    stockCount: 50
  },
  {
    name: 'Baseball Hat',
    description: 'Classic baseball cap with adjustable strap',
    price: 48.00,
    salePrice: 38.00,
    category: 'sale',
    imageUrl: '/images/sweatshirt-1.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['One Size'],
    stockCount: 30
  },
  {
    name: 'Sports Bra',
    description: 'Supportive sports bra for active lifestyle',
    price: 32.00,
    category: 'women',
    imageUrl: '/images/crop-top-1.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stockCount: 40
  },
  {
    name: 'Essential Crop Top',
    description: 'Comfortable cotton crop top for everyday wear',
    price: 24.00,
    category: 'women',
    imageUrl: '/images/crop-top-2.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stockCount: 45
  },
  {
    name: 'Essential T-Shirt',
    description: 'Premium cotton essential t-shirt in classic fit',
    price: 28.00,
    category: 'men',
    imageUrl: '/images/tshirt-2.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stockCount: 60
  },
  {
    name: 'Essential Sweatshirt',
    description: 'Cozy cotton blend sweatshirt for everyday comfort',
    price: 48.00,
    category: 'men',
    imageUrl: '/images/sweatshirt-2.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stockCount: 35
  },
  {
    name: 'Straight Leg Sweats',
    description: 'Comfortable straight leg sweatpants for everyday wear',
    price: 42.00,
    category: 'men',
    imageUrl: '/images/sweatpants-1.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stockCount: 25
  },
  {
    name: 'Cuffed Sweats',
    description: 'Comfortable cuffed sweatpants for lounging',
    price: 42.00,
    category: 'women',
    imageUrl: '/images/sweatpants-2.jpg',
    colors: ['black', 'grey', 'cream', 'dark-brown'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stockCount: 30
  }
];

// seed products function
const seedProducts = async () => {
  try {
    await connectDB();
    
    // clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // insert new products
    await Product.insertMany(productsData);
    console.log('Products seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();


