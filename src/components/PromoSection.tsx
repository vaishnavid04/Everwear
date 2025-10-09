import React from 'react';
import { Sparkles, Truck, RefreshCw, Clock, Shield, Award } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: 'Premium Quality',
    description: 'Handpicked materials for lasting comfort and style',
    gradient: 'bg-gradient-primary'
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Free Shipping',
    description: 'On orders over $100 worldwide',
    gradient: 'bg-gradient-secondary'
  },
  {
    icon: <RefreshCw className="w-8 h-8" />,
    title: 'Easy Returns',
    description: '30-day hassle-free return policy',
    gradient: 'bg-gradient-accent'
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: '24/7 Support',
    description: 'Always here to help you succeed',
    gradient: 'bg-gradient-warm'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Secure Payment',
    description: 'Your data is protected with SSL encryption',
    gradient: 'bg-gradient-dark'
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Quality Guarantee',
    description: 'Satisfaction guaranteed or money back',
    gradient: 'bg-gradient-primary'
  }
];

export default function PromoSection() {
  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-4">
            Why Choose MyTshirts?
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            We're committed to providing you with the best shopping experience and premium quality products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group card-gradient p-8 rounded-2xl text-center card-hover animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading font-bold text-neutral-900 mb-3 group-hover:text-gradient-primary transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center animate-slideUp" style={{ animationDelay: '600ms' }}>
          <div className="inline-flex items-center space-x-8 bg-neutral-50 px-8 py-4 rounded-2xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-gradient-primary">500+</div>
              <div className="text-sm text-neutral-600">Happy Customers</div>
            </div>
            <div className="w-px h-8 bg-neutral-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gradient-primary">50+</div>
              <div className="text-sm text-neutral-600">Unique Designs</div>
            </div>
            <div className="w-px h-8 bg-neutral-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gradient-primary">99%</div>
              <div className="text-sm text-neutral-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}