import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

export default function StarRating({ rating, size = 14, className = '' }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating);
        return (
          <Star
            key={star}
            size={size}
            className={filled ? 'fill-bronze-400 text-bronze-400' : 'text-sage-300'}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
}
