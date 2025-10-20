import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="relative bg-white pt-16">
      {/* Hero Content */}
      <div className="container-minimal section-spacing">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="animate-fadeIn">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-neutral-900 mb-6 leading-tight">
              Timeless
              <br />
              <span className="text-primary-800">Essentials</span>
              <br />
              for Every Day
            </h1>

            <p className="text-lg text-neutral-600 mb-8 leading-relaxed max-w-lg">
              Everwear brings you carefully curated basics that last.
              Simple, comfortable, and timeless pieces for your everyday wardrobe.
            </p>

            <div className="flex justify-center sm:justify-start">
              <Link
                to="/shop"
                className="btn-primary inline-flex items-center justify-center space-x-2"
              >
                <span>Shop Collection</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <img
                src="/images/store front.jpg"
                alt="Everwear Store Front"
                className="w-full h-[500px] object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-neutral-100 py-16">
        <div className="container-minimal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <h3 className="font-heading font-semibold text-neutral-900 mb-2">Premium Quality</h3>
              <p className="text-neutral-600">Carefully selected materials for lasting comfort</p>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              <h3 className="font-heading font-semibold text-neutral-900 mb-2">Timeless Design</h3>
              <p className="text-neutral-600">Classic pieces that never go out of style</p>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.8s' }}>
              <h3 className="font-heading font-semibold text-neutral-900 mb-2">Perfect Fit</h3>
              <p className="text-neutral-600">Thoughtfully designed for everyday comfort</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
