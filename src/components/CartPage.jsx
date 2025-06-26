import React from 'react';
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 sm:mb-8 text-center">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg sm:text-xl text-gray-600 mb-4">Your cart is empty. Start shopping now!</p>
          <Link to="/" className="bg-blue-600 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-md">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 last:pb-0 last:border-b-0">
                <img src={item.image} alt={item.title} className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-md mr-0 sm:mr-6 mb-4 sm:mb-0 border border-gray-200 p-1" />
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 line-clamp-2">{item.title}</h2>
                  <p className="text-blue-600 font-bold text-base sm:text-lg mb-2">${item.price.toFixed(2)}</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-4">
                    <label htmlFor={`quantity-${item.id}`} className="text-gray-700 font-medium">Quantity:</label>
                    <input
                      type="number"
                      id={`quantity-${item.id}`}
                      value={item.quantity}
                      min="1"
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 sm:w-20 p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition duration-300 text-sm sm:text-base font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 mt-4 sm:mt-0 ml-0 sm:ml-auto">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end items-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mr-0 sm:mr-4 mb-2 sm:mb-0">Total:</h2>
            <span className="text-2xl sm:text-3xl font-bold text-blue-700">${getTotalPrice().toFixed(2)}</span>
          </div>

          <div className="flex justify-center sm:justify-end mt-8">
            <button className="w-full sm:w-auto bg-green-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-green-700 transition duration-300 transform hover:scale-105 shadow-md">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
