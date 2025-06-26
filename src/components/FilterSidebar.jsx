import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const FilterSidebar = ({ onFilterChange, onClearFilters }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    // Fetch categories from Fakestore API
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products/categories');
        setCategories(['All', ...response.data]); // Add 'All' option
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Apply filters whenever selectedCategory, minPrice, or maxPrice changes
    onFilterChange({ category: selectedCategory, minPrice, maxPrice });
  }, [selectedCategory, minPrice, maxPrice, onFilterChange]);

  const handleClear = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    onClearFilters();
  };

  return (
    <div className="w-64 p-6 bg-gray-50 shadow-md rounded-lg sticky top-4 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Filters</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Category</h3>
        <select
          className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category === 'All' ? '' : category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Price Range</h3>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
      <button
        onClick={handleClear}
        className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition duration-300 transform hover:scale-105 font-semibold shadow-md"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterSidebar; 