import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  colors: string[];
  product?: Product; // Optional for backward compatibility
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  imageUrl,
  colors,
  product
}: ProductCardProps) {
  // Use individual props or fallback to product object for backward compatibility
  const productData = product || {
    id,
    name,
    price: originalPrice || price,
    imageUrl,
    colors,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    category: 'general',
    description: name
  };

  const [selectedColor, setSelectedColor] = useState(colors?.[0] || 'black');
  const { dispatch } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...productData,
        selectedColor,
        selectedSize: productData.sizes?.[2] || 'M' // Default to medium
      }
    });
  };

  return (
    <div className="group card-product overflow-hidden transition-all duration-200 hover:shadow-medium">
      <div className="relative overflow-hidden">
        <Link to={`/product/${id}`}>
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-64 object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </Link>
      </div>
      
      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="text-lg font-heading font-semibold text-neutral-900 mb-1 group-hover:text-primary-800 transition-colors duration-200">
            {name}
          </h3>
        </Link>
        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
          {productData.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            {originalPrice ? (
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary-800">
                  ${price.toFixed(2)}
                </span>
                <span className="text-sm text-neutral-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="text-xl font-bold text-neutral-900">
                ${price.toFixed(2)}
              </div>
            )}
          </div>
        </div>
        
        {/* Color Options */}
        {colors && (
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`color-swatch ${color} ${selectedColor === color ? 'selected' : ''}`}
                  title={color.replace('-', ' ')}
                />
              ))}
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="btn-minimal flex items-center space-x-1 text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
