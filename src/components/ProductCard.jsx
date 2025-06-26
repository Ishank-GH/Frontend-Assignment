import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="w-full h-56 overflow-hidden bg-gray-100 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">{product.title}</h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-1">{product.category}</p>
        </div>
      </Link>
      <div className="flex justify-between items-center px-4 pb-4">
        <span className="text-xl font-extrabold text-purple-700">${product.price.toFixed(2)}</span>
        <div className="flex items-center">
          <span className="text-yellow-500 mr-1">★</span>
          <span className="text-gray-700 font-semibold">{product.rating.rate}</span>
          <span className="text-gray-500 text-sm ml-1">({product.rating.count})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 