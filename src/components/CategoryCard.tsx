import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  image: string;
  description: string;
}

export default function CategoryCard({ name, image, description }: CategoryCardProps) {
  return (
    <Link
      to={`/category/${name.toLowerCase().replace(' ', '-')}`}
      className="group block card-minimal overflow-hidden transition-all duration-200 hover:shadow-medium"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-200"></div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-heading font-semibold text-neutral-900">
            {name}
          </h3>
          <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-800 transition-colors duration-200" />
        </div>
        <p className="text-neutral-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}
