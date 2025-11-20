import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  id?: number;
  name?: string;
  price?: number;
  originalPrice?: number;
  imageUrl?: string;
  colors?: string[];
  product?: Product; // Product object contains all necessary data
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
  // Use product object if provided, otherwise use individual props
  const productData = product || {
    id: id!,
    name: name!,
    price: originalPrice || price!,
    imageUrl: imageUrl!,
    colors: colors!,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    category: 'general',
    description: name!
  };

  // Determine display prices
  const displayPrice = productData.salePrice || productData.price;
  const displayOriginalPrice = productData.salePrice ? productData.price : originalPrice;

  const [selectedColor, setSelectedColor] = useState(productData.colors?.[0] || 'black');
  const { dispatch } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...productData,
        selectedColor,
        selectedSize: productData.sizes?.[2] || 'M', // Default to medium
        quantity: 1
      }
    });
  };

  return (
    <div className="group card-product overflow-hidden transition-all duration-200 hover:shadow-medium">
      <div className="relative overflow-hidden">
        <Link to={`/product/${productData.id}`}>
          <img
            src={productData.imageUrl}
            alt={productData.name}
            className="w-full h-64 object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="p-4">
        <Link to={`/product/${productData.id}`}>
          <h3 className="text-lg font-heading font-semibold text-neutral-900 mb-1 group-hover:text-primary-800 transition-colors duration-200">
            {productData.name}
          </h3>
        </Link>
        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
          {productData.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            {displayOriginalPrice ? (
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary-800">
                  ${displayPrice.toFixed(2)}
                </span>
                <span className="text-sm text-neutral-500 line-through">
                  ${displayOriginalPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="text-xl font-bold text-neutral-900">
                ${displayPrice.toFixed(2)}
              </div>
            )}
          </div>
        </div>
        
        {/* Color Options */}
        {productData.colors && (
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {productData.colors.map((color) => (
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
