import { useState } from "react";
import { X, Star } from "lucide-react";

interface ReviewModalProps {
  sellerId: number;
  sellerName: string;
  initialRating?: number;
  initialComment?: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export default function ReviewModal({
  sellerId,
  sellerName,
  initialRating = 5,
  initialComment = "",
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(rating, comment);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {initialComment ? "Edit Review" : "Review Seller"}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Share your experience buying from <span className="font-semibold text-gray-700">{sellerName}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Stars */}
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium text-gray-700 mb-2">Your Rating</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 transition-colors ${
                      star <= rating ? "text-yellow-400" : "text-gray-200"
                    }`}
                  >
                    <Star
                      size={32}
                      className={star <= rating ? "fill-yellow-400" : "fill-transparent"}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike about this seller?"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#cc000b]/20 focus:border-[#cc000b] transition-all resize-none text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#cc000b] hover:bg-[#aa0009] text-white font-semibold rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Submit Review"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
