import React from 'react';
import { Sliders, ChevronDown } from 'lucide-react';

interface FilterSectionProps {
  selectedSort: string;
  onSortChange: (sort: string) => void;
  selectedPriceRange: string;
  onPriceRangeChange: (range: string) => void;
}

export default function FilterSection({
  selectedSort,
  onSortChange,
  selectedPriceRange,
  onPriceRangeChange
}: FilterSectionProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2 text-gray-600">
          <Sliders size={20} />
          <span>Filters</span>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <select
              value={selectedPriceRange}
              onChange={(e) => onPriceRangeChange(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Prices</option>
              <option value="0-25">Under $25</option>
              <option value="25-50">$25 to $50</option>
              <option value="50-100">$50 to $100</option>
              <option value="100+">Over $100</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}