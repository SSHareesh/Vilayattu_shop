import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, ArrowDownUp, Tag, Banknote } from 'lucide-react';

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterSection = ({ 
  title, 
  icon: Icon,
  children, 
  defaultOpen = true 
}: { 
  title: string; 
  icon?: any;
  children: React.ReactNode; 
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 dark:border-gray-700 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-5 px-1 group"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-400 group-hover:text-primary-light transition-colors" />}
          <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider group-hover:text-primary-light transition-colors">
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-primary-light" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary-light" />
        )}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pb-5' : 'max-h-0 opacity-0'}`}>
        <div className="px-1">
          {children}
        </div>
      </div>
    </div>
  );
};

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 h-auto self-start sticky top-24">
      
      {/* Sort Section */}
      <FilterSection title="Sort By" icon={ArrowDownUp}>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none appearance-none cursor-pointer transition-all hover:border-primary-light"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </FilterSection>

      {/* Categories Section */}
      <FilterSection title="Categories" icon={Tag}>
        <div className="space-y-0.5">
          {/* 'All' Option */}
          <label className="flex items-center justify-between cursor-pointer group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <span className={`text-sm ${selectedCategory === null ? 'font-bold text-primary-light' : 'text-gray-600 dark:text-gray-400'}`}>
              All Equipment
            </span>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedCategory === null ? 'border-primary-light bg-primary-light text-white' : 'border-gray-300 dark:border-gray-600'}`}>
              {selectedCategory === null && <Check className="w-3 h-3" />}
            </div>
            <input
              type="radio"
              name="category"
              className="hidden"
              checked={selectedCategory === null}
              onChange={() => onCategoryChange(null)}
            />
          </label>

          {/* Dynamic Categories */}
          {categories.map((cat) => (
            <label key={cat} className="flex items-center justify-between cursor-pointer group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <span className={`text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors ${selectedCategory === cat ? 'font-bold text-primary-light' : 'text-gray-600 dark:text-gray-400'}`}>
                {cat}
              </span>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedCategory === cat ? 'border-primary-light bg-primary-light text-white' : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'}`}>
                {selectedCategory === cat && <Check className="w-3 h-3" />}
              </div>
              <input
                type="radio"
                name="category"
                className="hidden"
                checked={selectedCategory === cat}
                onChange={() => onCategoryChange(cat)}
              />
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Section */}
      <FilterSection title="Price Range" icon={Banknote}>
        <div className="px-1 py-2 ">
          <input
            type="range"
            min="0"
            max="10000"
            step="500"
            value={priceRange[1]}
            onChange={(e) => onPriceChange([0, parseInt(e.target.value)])}
            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-light hover:accent-blue-600"
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">₹0</span>
            <div className="px-3 py-1 bg-primary-light/10 text-primary-light rounded-md text-xs font-bold border border-primary-light/20">
              ₹{priceRange[1].toLocaleString()}
            </div>
          </div>
        </div>
      </FilterSection>

    </div>
  );
};

export default ProductFilters;