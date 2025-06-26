import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import axios from 'axios';

const HomePage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
  });
  const [sortOption, setSortOption] = useState('popularity');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setAllProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
    });
    setCurrentPage(1);
  }, []);

  const applyFiltersAndSort = useMemo(() => {
    let productsToDisplay = [...allProducts];

    if (filters.category) {
      productsToDisplay = productsToDisplay.filter(
        (product) => product.category === filters.category
      );
    }
    if (filters.minPrice) {
      productsToDisplay = productsToDisplay.filter(
        (product) => product.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      productsToDisplay = productsToDisplay.filter(
        (product) => product.price <= parseFloat(filters.maxPrice)
      );
    }

    switch (sortOption) {
      case 'priceAsc':
        productsToDisplay.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        productsToDisplay.sort((a, b) => b.price - a.price);
        break;
      case 'nameAsc':
        productsToDisplay.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'nameDesc':
        productsToDisplay.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'popularity':
      default:
        productsToDisplay.sort((a, b) => b.rating.count - a.rating.count);
        break;
    }

    return productsToDisplay;
  }, [allProducts, filters, sortOption]);

  useEffect(() => {
    setFilteredProducts(applyFiltersAndSort);
  }, [applyFiltersAndSort]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      {/* Mobile Filter Toggle Button */}
      <button 
        className="md:hidden bg-blue-600 text-white p-3 rounded-md mb-4 mx-4 shadow-md font-semibold hover:bg-blue-700 transition duration-300"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Filter Sidebar */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block md:w-64 md:mr-8 mb-6 md:mb-0 p-4`}>
        <FilterSidebar onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
      </div>

      <div className="flex-1 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Our Products</h1>
          <div className="flex items-center space-x-3">
            <label htmlFor="sort" className="font-medium text-gray-700">Sort by:</label>
            <select
              id="sort"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition duration-200"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="popularity">Popularity</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A-Z</option>
              <option value="nameDesc">Name: Z-A</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-4 py-2 rounded-md font-semibold transition duration-300 ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;