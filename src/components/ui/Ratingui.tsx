import {
    Star,

} from 'lucide-react';
import React from 'react';

interface RenderRatingProps {
    rating: number;
    size?: number;
}

const RenderRating = ({ rating, size = 18 }: RenderRatingProps): React.ReactElement => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={size}
                className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
            />
        ))}
    </div>
);

export default RenderRating