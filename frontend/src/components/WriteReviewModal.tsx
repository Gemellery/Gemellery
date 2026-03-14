import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

export interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  productName?: string;
  isSubmitting?: boolean;
}

const WriteReviewModal: React.FC<WriteReviewModalProps> = ({ isOpen, onClose, onSubmit, productName, isSubmitting = false }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }
    onSubmit(rating, comment);
    // Reset form after submission
    setRating(0);
    setHoverRating(0);
    setComment('');
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    onClose();
  };

  // Close modal when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4 relative animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Write a Review {productName && <span className="text-gray-500 font-normal text-sm block mt-1">for {productName}</span>}
          </h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Rating Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating *</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={`transition-colors duration-200 ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating === 0 && <p className="text-xs text-red-500 mt-2">Selecting a rating is required.</p>}
          </div>

          {/* Comment Section */}
          <div className="mb-6">
            <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
              Add a written review <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none text-[13px]"
              placeholder="What did you like or dislike? What should other buyers know?"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed rounded-xl shadow-sm hover:shadow transition-all"
            >
              {isSubmitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WriteReviewModal;
