import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { Plus, Minus, Check, AlertCircle } from 'lucide-react';
import { getProductById } from '../data/products';

// Using centralized product data

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const product = getProductById(Number(id));

  // Set default selections when product loads
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || '');
      setSelectedSize(product.sizes?.[2] || ''); // Default to medium
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container-minimal section-spacing text-center">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Product Not Found</h2>
        <p className="text-neutral-600">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select both color and size');
      return;
    }

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...product,
        selectedColor,
        selectedSize
      }
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="container-minimal section-spacing">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">{product.name}</h1>
            <p className="text-2xl text-primary-800 font-semibold">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <p className="text-neutral-600 text-lg leading-relaxed">{product.description}</p>

          {/* Color Selection */}
          {product.colors && (
            <div className="space-y-3">
              <span className="text-neutral-900 font-medium block">Color</span>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`color-swatch ${color} ${selectedColor === color ? 'selected' : ''}`}
                    title={color.replace('-', ' ')}
                  />
                ))}
              </div>
              <p className="text-sm text-neutral-500 capitalize">Selected: {selectedColor.replace('-', ' ')}</p>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && (
            <div className="space-y-3">
              <span className="text-neutral-900 font-medium block">Size</span>
              <div className="flex space-x-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
                      selectedSize === size
                        ? 'border-primary-800 bg-primary-800 text-white'
                        : 'border-neutral-300 hover:border-primary-800'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <span className="text-neutral-900 font-medium block">Quantity</span>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="text-xl font-medium w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn-primary w-full"
          >
            {showSuccess ? (
              <span className="flex items-center justify-center space-x-2">
                <Check size={20} />
                <span>Added to Cart!</span>
              </span>
            ) : (
              'Add to Cart'
            )}
          </button>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="text-center p-4 bg-neutral-100 rounded-lg">
              <p className="text-sm text-neutral-600">Free Shipping</p>
              <p className="font-medium">On orders over $100</p>
            </div>
            <div className="text-center p-4 bg-neutral-100 rounded-lg">
              <p className="text-sm text-neutral-600">Returns</p>
              <p className="font-medium">30-day money back</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}