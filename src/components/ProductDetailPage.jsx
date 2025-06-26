import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import axios from 'axios';
import { gsap } from "gsap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mock reviews data (for demonstration purposes)
const mockReviews = {
  1: [
    { id: 1, author: 'Alice', rating: 5, comment: 'Absolutely love this product! Highly recommended.', date: '2024-05-10' },
    { id: 2, author: 'Bob', rating: 4, comment: 'Good quality, but a bit pricey.', date: '2024-05-12' },
  ],
  2: [
    { id: 3, author: 'Charlie', rating: 3, comment: 'It\'s okay, nothing special.', date: '2024-05-15' },
  ],
  // Add more mock reviews for other product IDs as needed
};

const StarRating = ({ rating, setRating, editable = false }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`cursor-pointer text-2xl ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
        onClick={() => editable && setRating(i)}
      >
        ★
      </span>
    );
  }
  return <div className="flex">{stars}</div>;
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(0);

  const { addToCart } = useCart();

  const container = useRef();
  const detailContentRef = useRef();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
        setProduct(response.data);
        // Load mock reviews for this product
        setReviews(mockReviews[id] || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Only animate if the element exists
    if (product && detailContentRef.current) {
      gsap.fromTo(
        detailContentRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
      const img = detailContentRef.current.querySelector('.product-image');
      if (img) {
        gsap.fromTo(
          img,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 0.3 }
        );
      }
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      setIsAdding(true);
      addToCart(product);
      toast.success(`${product.title} added to cart!`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => setIsAdding(false), 2000); // Reset button state after animation
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReviewText.trim() === '' || newReviewRating === 0) {
      toast.error('Please provide a review and a rating.');
      return;
    }
    const newReview = {
      id: reviews.length + 1,
      author: 'You', // In a real app, this would be the logged-in user
      rating: newReviewRating,
      comment: newReviewText,
      date: new Date().toISOString().slice(0, 10),
    };
    setReviews([...reviews, newReview]);
    setNewReviewText('');
    setNewReviewRating(0);
    toast.success('Review submitted successfully!');
  };

  if (loading) return <div className="text-center text-xl mt-10">Loading product details...</div>;
  if (error) return <div className="text-center text-xl mt-10 text-red-500">Error: {error.message}</div>;
  if (!product) return <div className="text-center text-xl mt-10">Product not found.</div>;

  return (
    <div ref={container} className="w-full flex flex-col items-center">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 self-start flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        style={{ minWidth: 120 }}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Go Back
      </button>
      <div
        ref={detailContentRef}
        className="product-detail-content bg-white p-6 sm:p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-10 lg:space-x-14 border border-gray-100 max-w-5xl w-full animate-fadeIn"
        style={{ minHeight: 400 }}
      >
        <div className="md:w-1/2 flex justify-center items-center mb-8 md:mb-0">
          <img 
            src={product.image} 
            alt={product.title} 
            className="product-image max-w-full h-auto max-h-80 md:max-h-96 object-contain rounded-lg shadow-md border border-gray-200 p-2"
          />
        </div>
        <div className="md:w-1/2 w-full">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 leading-tight">{product.title}</h1>
          <p className="text-xl sm:text-2xl text-blue-600 font-bold mb-5 sm:mb-6">${product.price.toFixed(2)}</p>
          <p className="text-gray-700 mb-6 leading-relaxed text-base sm:text-lg">{product.description}</p>
          
          <div className="flex items-center mb-6">
            <span className="text-yellow-500 text-xl mr-2">★ {product.rating.rate}</span>
            <span className="text-gray-600 text-lg">({product.rating.count} reviews)</span>
          </div>

          <button 
            onClick={handleAddToCart}
            className={`w-full md:w-auto bg-green-600 text-white py-3 px-8 rounded-full text-lg font-semibold transition duration-300 transform ${isAdding ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700 hover:scale-105'}`}
            disabled={isAdding}
          >
            {isAdding ? 'Added to Cart!' : 'Add to Cart'}
          </button>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-2">
                      <StarRating rating={review.rating} />
                      <span className="ml-0 sm:ml-3 mt-2 sm:mt-0 font-semibold text-gray-800 text-lg">{review.author}</span>
                      <span className="ml-auto text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews available for this product yet. Be the first to review!</p>
            )}

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-5 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <div>
                <label htmlFor="reviewRating" className="block text-lg font-medium text-gray-700 mb-2">Your Rating:</label>
                <StarRating rating={newReviewRating} setRating={setNewReviewRating} editable={true} />
              </div>
              <div>
                <label htmlFor="reviewComment" className="block text-lg font-medium text-gray-700 mb-2">Your Review:</label>
                <textarea
                  id="reviewComment"
                  rows="5"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-y"
                  placeholder="Share your thoughts about this product..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-md"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductDetailPage;
