import React from "react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const sizeClasses = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const SellerStarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = "md",
  showValue = false,
}) => {
  const starSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }, (_, i) => {
          const filled = rating >= i + 1;
          const partial = !filled && rating > i;
          const fillPercent = partial ? Math.round((rating - i) * 100) : 0;
          const uniqueId = `star-grad-${i}-${Math.random().toString(36).slice(2, 7)}`;

          return (
            <svg
              key={i}
              className={starSize}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              {partial && (
                <defs>
                  <linearGradient id={uniqueId}>
                    <stop
                      offset={`${fillPercent}%`}
                      stopColor="#facc15"
                    />
                    <stop
                      offset={`${fillPercent}%`}
                      stopColor="#d1d5db"
                    />
                  </linearGradient>
                </defs>
              )}
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                fill={
                  filled
                    ? "#facc15"
                    : partial
                    ? `url(#${uniqueId})`
                    : "none"
                }
                stroke={filled || partial ? "#facc15" : "#d1d5db"}
                strokeWidth="1"
              />
            </svg>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm text-foreground/70 font-medium tabular-nums">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default SellerStarRating;